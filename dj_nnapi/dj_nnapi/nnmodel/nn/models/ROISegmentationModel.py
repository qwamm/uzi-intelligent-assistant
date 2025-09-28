import os
import numpy as np
from PIL import Image
import torch
from torch.utils.data import DataLoader
import albumentations as A
from albumentations.pytorch import ToTensorV2

from nnmodel.nn.nnmodel import ModelABC, settings
from ..datasets.ROIDataset import ROIDataset
import matplotlib.pyplot as plt


class ROISegmentationModel(ModelABC):
    """
    Модель для сегментации областей интереса (ROI) узлов щитовидной железы.
    """

    def __init__(self, model_type: str) -> None:
        super().__init__()
        self.model_type = model_type
        self.device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
        self.load(path=settings['segmentation'][self.model_type])

    def load(self, path: str) -> None:
        self._model = torch.load(path, map_location=self.device, weights_only=False)
        self._model.to(self.device)
        self._model.eval()

    def preprocessing(self,
                      images: list,
                      coordinates: list,
                      cropped_image_width: int,
                      cropped_image_height: int,
                      frame_numbers: list,
                      inds_in_rois_in_frames_list: list,
                      image_size: int,
                      batch_size: int) -> DataLoader:
        """
        Подготовка данных для сегментации - создание датасета с преобразованиями и даталоадера.

        Args:
            images (list): Список ROI изображений
            coordinates (list): Список координат ROI
            cropped_image_width (int): Ширина обрезанного изображения
            cropped_image_height (int): Высота обрезанного изображения
            frame_numbers (list): Номера кадров
            inds_in_rois_in_frames_list (list): Индексы ROI в rois_in_frames_list
            image_size (int): Размер изображения для сегментации
            batch_size (int): Размер батча

        Returns:
            DataLoader: Даталоадер для батчевой обработки
        """

        transform = A.Compose([
            A.Resize(image_size, image_size),
            A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ToTensorV2(),
        ])

        dataset = ROIDataset(
            images=images,
            coordinates=coordinates,
            cropped_image_width=cropped_image_width,
            cropped_image_height=cropped_image_height,
            frame_numbers=frame_numbers,
            inds_in_rois_in_frames_list=inds_in_rois_in_frames_list,
            transform=transform
        )

        dataloader = DataLoader(
            dataset=dataset,
            batch_size=batch_size,
            shuffle=False,
            num_workers=4,
        )

        return dataloader

    def predict_one_track(self,
                          images: list,
                          coordinates: list,
                          cropped_image_width: int,
                          cropped_image_height: int,
                          frame_numbers: list,
                          inds_in_rois_in_frames_list: list,
                          image_size: int,
                          batch_size: int,
                          threshold: float) -> list:  # return List[List[frame_number, ind_in_rois_in_frames_list, nodule_mask]]
        """
        Выполнение сегментации для одного трека узла.

        Args:
            images (list): Список ROI изображений для одного узла
            coordinates (list): Список координат ROI для одного узла
            cropped_image_width (int): Ширина обрезанного изображения
            cropped_image_height (int): Высота обрезанного изображения
            frame_numbers (list): Номера кадров для одного узла
            inds_in_rois_in_frames_list (list): Индексы ROI в rois_in_frames_list
            image_size (int): Размер изображения для обработки
            batch_size (int): Размер батча
            threshold (float): Порог бинаризации маски

        Returns:
            list: Результаты сегментации в список списков [номер_кадра, индекс_в_rois_in_frames_list, маска_узла]
        """

        dataloader = self.preprocessing(images, coordinates, cropped_image_width, cropped_image_height, frame_numbers,
                                        inds_in_rois_in_frames_list, image_size, batch_size)

        results = []
        with torch.no_grad():
            for batch, coords0, coords1, coords2, coords3, initial_roi_heights, initial_roi_widths, frame_numbers, inds_in_rois_in_frames_list in dataloader:
                coords0 = coords0.tolist()
                coords1 = coords1.tolist()
                coords2 = coords2.tolist()
                coords3 = coords3.tolist()
                initial_roi_heights = initial_roi_heights.tolist()
                initial_roi_widths = initial_roi_widths.tolist()
                frame_numbers = frame_numbers.tolist()
                inds_in_rois_in_frames_list = inds_in_rois_in_frames_list.tolist()
                batch = batch.to(self.device)
                output = self._model(batch)
                output = output.cpu().detach().numpy()
                output = (output < threshold)

                for i in range(batch.shape[0]):
                    current_mask = output[i][0].astype(float)
                    current_mask = Image.fromarray(current_mask)
                    current_mask = current_mask.resize((initial_roi_widths[i], initial_roi_heights[i]),
                                                       resample=Image.NEAREST)
                    current_mask = np.array(current_mask)
                    current_mask = (current_mask > threshold).astype(float)
                    cropped_mask = np.zeros(shape=(cropped_image_height, cropped_image_width), dtype=np.float32)
                    cropped_mask[
                    coords1[i]:coords3[i],
                    coords0[i]:coords2[i]
                    ] = current_mask
                    results.append([frame_numbers[i], inds_in_rois_in_frames_list[i], cropped_mask])

        return results

    def predict(self,
                nodules: dict,
                rois_in_frames: list,
                batch_size: int,
                image_size: int,
                threshold: float,
                initial_image_height: int,
                initial_image_width: int,
                crop_coordinates: dict,
                save: bool,
                result_dir: str = None) -> tuple:
        """
        Основной метод предсказания - выполняет сегментацию всех узлов.

        Args:
            nodules (dict): Словарь с информацией об узлах
            rois_in_frames (list): Список ROI в кадрах
            batch_size (int): Размер батча
            image_size (int): Размер изображения для сегментации
            threshold (float): Порог бинаризации маски
            initial_image_height (int): Высота исходного изображения
            initial_image_width (int): Ширина исходного изображения
            crop_coordinates (dict): Координаты обрезки изображения
            save (bool): Флаг сохранения результатов
            result_dir (str, optional): Директория для сохранения результатов

        Returns:
            tuple: Кортеж из (обновленные ROI в кадрах, список масок результатов)
        """

        print('Segmentation started...')
        all_segmentation_results = []
        for nodule_id in nodules:
            print(f"Nodule (id={nodule_id}) segmentation started...")
            segmentation_results = self.predict_one_track(
                images=nodules[nodule_id]["enlarged_rois"],
                coordinates=nodules[nodule_id]["enlarged_xyxys"],
                cropped_image_width=nodules[nodule_id]["cropped_image_width"],
                cropped_image_height=nodules[nodule_id]["cropped_image_height"],
                frame_numbers=nodules[nodule_id]["frame_numbers"],
                inds_in_rois_in_frames_list=nodules[nodule_id]["inds_in_rois_in_frames"],
                image_size=image_size,
                batch_size=batch_size,
                threshold=threshold
            )
            print(f"Nodule (id={nodule_id}) segmentation completed")
            all_segmentation_results.append(segmentation_results)

        for all_seg_res in all_segmentation_results:
            for seg_res in all_seg_res:
                frame_number = seg_res[0]
                ind_in_rois_in_frames_list = seg_res[1]
                initial_mask = np.zeros(shape=(initial_image_height, initial_image_width), dtype=np.float32)
                initial_mask[
                crop_coordinates['x_cut_min']:crop_coordinates['x_cut_max'],
                crop_coordinates['y_cut_min']:crop_coordinates['y_cut_max']
                ] = seg_res[2]
                rois_in_frames[frame_number][ind_in_rois_in_frames_list][2] = initial_mask

        if save:
            os.makedirs(result_dir, exist_ok=True)

        result_masks = []
        for i in range(len(rois_in_frames)):
            result_mask = np.zeros(shape=(initial_image_height, initial_image_width), dtype=np.float32)
            for element in rois_in_frames[i]:
                result_mask += element[2]
                result_mask = (result_mask != 0).astype(float)
            result_masks.append(result_mask)

            if save:
                result_path = os.path.join(result_dir, f'{i}.png')
                plt.imsave(result_path, result_mask)

        print('Segmentation completed!')

        return rois_in_frames, result_masks
