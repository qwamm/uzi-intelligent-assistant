import uuid

import dramatiq
from nnmodel import models

from nnmodel.nn.datasets.ThyroidUltrasoundDataset import ThyroidUltrasoundDataset
from nnmodel.apps import NNmodelConfig
import cv2

import numpy as np


# def calculate_and_save_nodule_dimensions(segmentation_data_obj, result_masks, pixel_size_mm=0.1):
#     """
#     Вычисляет размеры узла щитовидной железы на основе сегментационных данных
#     и сохраняет их в объект Nodule.
#
#     :param segmentation_data_obj: Объект SegmentationData с информацией о сегментации
#     :param result_masks: Список масок сегментации узла
#     :param pixel_size_mm: Размер пикселя в миллиметрах (по умолчанию 0.1 мм)
#                          Это значение должно быть калибровано для конкретного оборудования
#     """
#
#     all_points = []
#     z_values = set()
#
#     for result_mask_dict in result_masks:
#         for mask_idx, result_mask in result_mask_dict.items():
#             if result_mask is None or np.sum(result_mask) == 0:
#                 continue
#
#             y_coords, x_coords = np.where(result_mask > 0)
#
#             z_coords = np.full_like(x_coords, mask_idx)
#
#             for x, y, z in zip(x_coords, y_coords, z_coords):
#                 all_points.append([x, y, z])
#                 z_values.add(z)
#
#     if not all_points:
#         print("No segmentation points found for nodule")
#         return None
#
#     points_array = np.array(all_points)
#
#     if len(points_array) > 0:
#         min_x, min_y, min_z = np.min(points_array, axis=0)
#         max_x, max_y, max_z = np.max(points_array, axis=0)
#
#         length_px = max_x - min_x
#         width_px = max_y - min_y
#         thickness_px = max_z - min_z
#
#         length_mm = length_px * pixel_size_mm
#         width_mm = width_px * pixel_size_mm
#         thickness_mm = (thickness_px + 1) * pixel_size_mm
#
#         volume_mm3 = (4 / 3) * np.pi * (length_mm / 2) * (width_mm / 2) * (thickness_mm / 2)
#
#         try:
#             thyroid_gland = models.ThyroidGland.objects.filter(uzi_segment_group=segmentation_data_obj.segment_group).first()
#
#             nodule = models.Nodule(
#                 thyroid_gland=thyroid_gland,
#                 length=length_mm,
#                 width=width_mm,
#                 thickness=thickness_mm,
#                 location="",
#                 contour=""
#             )
#
#             nodule.save()
#
#             print(f"Nodule created: length={length_mm:.2f}mm, width={width_mm:.2f}mm, "
#                   f"thickness={thickness_mm:.2f}mm, volume={volume_mm3:.2f}mm³")
#
#             return nodule
#
#         except Exception as e:
#             print(f"Error creating Nodule object: {e}")
#             return None
#
#     return None

def createUziSegmentGroup(details, uzi_image_id):
    return models.UZISegmentGroupInfo(
        details=details, is_ai=True, original_image_id=uzi_image_id
    )

def createSegmentationDataObj(ind, nodule, details, image_id, result_masks):
    match nodule:
        case 'TIRADS1':
            nodule_type = 1
        case 'TIRADS2':
            nodule_type = 2
        case 'TIRADS3':
            nodule_type = 3
        case 'TIRADS4':
            nodule_type = 4
        case 'TIRADS5':
            nodule_type = 5
        case _:
            nodule_type = -1

    nodule_2_3 = 1 if nodule_type == 2 or nodule_type == 3 else 0
    nodule_4 = 1 if nodule_type == 4 else 0
    nodule_5 = 1 if nodule_type == 5 else 0

    pre_details = {'nodule_type': nodule_type, 'nodule_2_3': nodule_2_3, 'nodule_4': nodule_4, 'nodule_5': nodule_5}

    details[ind] = createUziSegmentGroup(pre_details, image_id)
    models.UZISegmentGroupInfo.objects.bulk_create([details[ind]])
    segmentation_data_obj = models.SegmentationData(
        segment_group=details[ind],
        details=pre_details
    )
    segmentation_data_obj.save()
    createSegmentationPointObj(result_masks, segmentation_data_obj)

    #calculate_and_save_nodule_dimensions(segmentation_data_obj, result_masks)

def createSegmentationPointObj(result_masks, segmentation_data_obj):
    segments_points = []
    for result_mask_dict in result_masks:
        for mask_idx, result_mask in result_mask_dict.items():
            if result_mask is None or np.sum(result_mask) == 0:
                print(f"Mask {mask_idx} is empty, skipping...")
                continue

            print(f"Processing mask {mask_idx} with shape {result_mask.shape}")

            binary_mask = (result_mask * 255).astype(np.uint8)

            contours, hierarchy = cv2.findContours(
                binary_mask,
                cv2.RETR_TREE,
                cv2.CHAIN_APPROX_SIMPLE | cv2.CHAIN_APPROX_TC89_L1,
            )

            print(f"Found {len(contours)} contours in mask {mask_idx}")

            # Обрабатываем найденные контуры
            for contour_idx, contour in enumerate(contours):
                print(f"Contour {contour_idx} has {len(contour)} points")

                # Создаем точки для каждого контура
                for point_idx, point in enumerate(contour):
                    x = point[0][0]
                    y = point[0][1]

                    segments_points.append(
                        models.SegmentationPoint(
                            uid=hash(uuid.uuid4()),
                            segment=segmentation_data_obj,
                            x=x,
                            y=y,
                            z=mask_idx,
                        )
                    )

    print(f"Total points to create: {len(segments_points)}")

    # Сохраняем точки сегментации батчами
    if segments_points:
        batch_size = 1000
        for i in range(0, len(segments_points), batch_size):
            batch = segments_points[i:i + batch_size]
            models.SegmentationPoint.objects.bulk_create(batch)
        print(f"Successfully created {len(segments_points)} segmentation points")
    else:
        print("No segmentation points to create")

def get_result_masks_for_nodule(rois_in_frames, nodule_ind):
    """
    Получение результирующих масок для данного узла
    :param rois_in_frames - регионы интереса для каждого слайда
    :param nodule_ind - id узла
    """
    res = []
    for mask_ind, roi in enumerate(rois_in_frames):
        for nodule in roi:
            if nodule[1] == nodule_ind:
                res.append({mask_ind : nodule[2]})
    return res

@dramatiq.actor(queue_name='predict_all', store_results=True)
def predict_all(file_path: str, projection_type: str, id: int):
    print(f"predictions, {projection_type=} {file_path=}")
    roi_classification_model = NNmodelConfig.DefalutModels["C"]["all"]
    roi_segmentation_model = NNmodelConfig.DefalutModels["S"]["all"]
    detector_tracker = NNmodelConfig.DefalutModels["D"]["all"]

    dataset = ThyroidUltrasoundDataset(path=file_path)
    detection_results, detected_nodules, rois_in_frames = detector_tracker.predict(
        dataset=dataset,
        image_size=640,
        batch_size=1,
        conf_det=0.5,
        iou=0.3,
        roi_margin_percent=10,
        save=False,
    )

    rois_in_frames, result_masks = roi_segmentation_model.predict(
        nodules=detected_nodules,
        rois_in_frames=rois_in_frames,
        batch_size=8,
        image_size=256,
        threshold=0.5,
        initial_image_height=dataset.initial_height,
        initial_image_width=dataset.initial_width,
        crop_coordinates=dataset.crop_coordinates,
        save=False
    )

    nodule_class_dict = roi_classification_model.predict(
        nodules=detected_nodules,
        image_size=224
    )

    details = {}

    if isinstance(nodule_class_dict, dict):
        for ind, nodule in nodule_class_dict.items():
            result_masks_with_cur_nodule = get_result_masks_for_nodule(rois_in_frames, ind)
            createSegmentationDataObj(ind, nodule, details, id, result_masks_with_cur_nodule)
    elif isinstance(nodule_class_dict, str):
        result_masks_with_cur_nodule = get_result_masks_for_nodule(rois_in_frames, 0)
        createSegmentationDataObj(0, nodule_class_dict, details, id, result_masks_with_cur_nodule)
    else:
        raise TypeError("Unexpected type in nodule_class_dict")

    models.OriginalImage.objects.filter(id=id).update(viewed_flag=True)
    print("predicted!")
    return