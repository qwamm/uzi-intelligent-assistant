from torch.utils.data import Dataset
from ultralytics import YOLO

from nnmodel.nn.nnmodel import ModelABC, settings

class DetectionTrackingModel(ModelABC):
    """
    Модель для детекции и трекинга узлов щитовидной железы на ультразвуковых изображениях
    """

    def __init__(self, model_type: str) -> None:  # model_type='all'/'long'/'cross'
        super().__init__()
        self.model_type = model_type
        self.load(path=settings['detection'][self.model_type])

    def load(self, path: str) -> None:
        self._model = YOLO(path)

    def preprocessing(self,
                      xyxy: list[float],
                      roi_margin_percent: int,
                      cropped_image_width: int,
                      cropped_image_height: int) -> tuple[int, int, int, int]:
        """
        Расширение границ bounding box для получения ROI с отступом.

        Args:
            xyxy (list[float]): Координаты bounding box [x1, y1, x2, y2]
            roi_margin_percent (int): Процент отступа от границ bounding box
            cropped_image_width (int): Ширина обрезанного изображения
            cropped_image_height (int): Высота обрезанного изображения

        Returns:
            tuple[int, int, int, int]: Новые координаты расширенного ROI [x1_new, y1_new, x2_new, y2_new]
        """

        width = xyxy[2] - xyxy[0]
        height = xyxy[3] - xyxy[1]
        add_w = int(width * roi_margin_percent / 100)
        add_h = int(height * roi_margin_percent / 100)
        x1_new = max(0, int(xyxy[0] - add_w))
        x2_new = min(cropped_image_width, int(xyxy[2] + add_w))
        y1_new = max(0, int(xyxy[1] - add_h))
        y2_new = min(cropped_image_height, int(xyxy[3] + add_h))

        return x1_new, y1_new, x2_new, y2_new

    @staticmethod
    def make_nodule_dict(cropped_image_width: int,
                         cropped_image_height: int) -> dict:
        """
        Создание словаря для хранения информации об узле щитовидной железы.

        Args:
            cropped_image_width (int): Ширина обрезанного изображения
            cropped_image_height (int): Высота обрезанного изображения

        Returns:
            dict: Словарь с базовой информацией об узле
        """

        nodule = {}
        nodule["cropped_image_width"] = cropped_image_width
        nodule["cropped_image_height"] = cropped_image_height
        nodule["frame_numbers"] = []
        nodule["enlarged_rois"] = []
        nodule["enlarged_xyxys"] = []
        nodule["inds_in_rois_in_frames"] = []
        nodule["largest_area"] = None
        nodule["largest_roi_idx_in_enlarged_rois"] = None

        return nodule

    def detect(self,
               dataset: Dataset,
               image_size: int,
               batch_size: int,
               conf_det: float,
               iou: float,
               save: bool,
               result_dir: str = None) -> list:
        """
        Выполнение детекции узлов на однокадровом изображении.

        Args:
            dataset (Dataset): Датасет с изображениями
            image_size (int): Размер изображения для обработки
            batch_size (int): Размер батча
            conf_det (float): Порог уверенности для детекции
            iou (float): Порог IoU для подавления немаксимумов
            save (bool): Флаг сохранения результатов
            result_dir (str, optional): Директория для сохранения результатов

        Returns:
            list: Результаты детекции
        """

        detection_results = []
        if save:
            current_results = self._model(source=dataset[0], imgsz=image_size, conf=conf_det, iou=iou, single_cls=True,
                                          save=True, project=result_dir)
            detection_results.append(current_results)
        else:
            current_results = self._model(source=dataset[0], imgsz=image_size, conf=conf_det, iou=iou, single_cls=True,
                                          save=None)
            detection_results.append(current_results)

        return detection_results

    def detect_track(self,
                     dataset: Dataset,
                     image_size: int,
                     batch_size: int,
                     iou: float,
                     save: bool,
                     result_dir: str = None) -> list:
        """
        Выполнение детекции и трекинга узлов на последовательности изображений.

        Args:
            dataset (Dataset): Датасет с изображениями
            image_size (int): Размер изображения для обработки
            batch_size (int): Размер батча
            iou (float): Порог IoU для подавления немаксимумов
            save (bool): Флаг сохранения результатов
            result_dir (str, optional): Директория для сохранения результатов

        Returns:
            list: Результаты детекции и трекинга
        """

        tracking_results = []
        if save:
            for i in range(len(dataset)):
                current_results = self._model.track(source=dataset[i], tracker='my_tracker.yaml', persist=True,
                                                    imgsz=image_size, iou=iou, single_cls=True, save=True,
                                                    project=result_dir)
                tracking_results.append(current_results)
        else:
            for i in range(len(dataset)):
                current_results = self._model.track(source=dataset[i], tracker='my_tracker.yaml', persist=True,
                                                    imgsz=image_size, iou=iou, single_cls=True, save=None)
                tracking_results.append(current_results)

        return tracking_results

    def predict(self,
                dataset: Dataset,
                image_size: int,
                batch_size: int,
                conf_det: float,
                iou: float,
                roi_margin_percent: int,
                save: bool,
                result_dir: str = None) -> tuple:
        """
        Основной метод предсказания - выполняет детекцию и трекинг узлов.

        Args:
            dataset (Dataset): Датасет с изображениями
            image_size (int): Размер изображения для обработки
            batch_size (int): Размер батча
            conf_det (float): Порог уверенности для детекции
            iou (float): Порог IoU для подавления немаксимумов
            roi_margin_percent (int): Процент отступа для ROI
            save (bool): Флаг сохранения результатов
            result_dir (str, optional): Директория для сохранения результатов

        Returns:
            tuple: Кортеж из (результаты, словарь узлов, список ROI в кадрах)
        """

        print(f'Found {len(dataset)} frames')

        cropped_image_width = dataset.cropped_width
        cropped_image_height = dataset.cropped_height

        nodules = {}  # {nodule_id: {"frame_numbers": [], "enlarged_rois"(enlarged_roi_numpy_array): [], "enlarged_xyxys": [], "inds_in_rois_in_frames_list": []}}
        rois_in_frames = []  # List[List[List[enlarged_roi_numpy_array, nodule_index, numpy_array_of_full_mask]]]

        if len(dataset) == 1:
            print('Detection started...')
            detection_results = self.detect(
                dataset=dataset,
                image_size=image_size,
                batch_size=batch_size,
                conf_det=conf_det,
                iou=iou,
                save=save,
                result_dir=result_dir
            )
            print(f'Number of frames in detection results: {len(detection_results)}')

            t_id = 0
            for i in range(len(detection_results)):  # Итерация по frames
                current_rois_in_frame = []

                if len(detection_results[i]) != 1:
                    print(f'Len(frame) == {len(detection_results[i])}, индекс: {i}')

                for m in range(len(detection_results[i])):  # Итерация по ?
                    bboxes = detection_results[i][m].boxes
                    conf_list = bboxes.conf.tolist()
                    xyxy_list = bboxes.xyxy.tolist()

                    for cnf, xyxy in zip(conf_list, xyxy_list):
                        if cnf >= conf_det:
                            x1_new, y1_new, x2_new, y2_new = self.preprocessing(xyxy, roi_margin_percent,
                                                                                cropped_image_width,
                                                                                cropped_image_height)
                            enlarged_roi = dataset[i][y1_new:y2_new, x1_new:x2_new, :]
                            nodules[t_id] = self.make_nodule_dict(cropped_image_width, cropped_image_height)
                            nodules[t_id]["frame_numbers"].append(i)
                            nodules[t_id]["enlarged_rois"].append(enlarged_roi)
                            nodules[t_id]["enlarged_xyxys"].append([x1_new, y1_new, x2_new, y2_new])
                            nodules[t_id]["inds_in_rois_in_frames"].append(len(current_rois_in_frame))
                            nodules[t_id]["largest_area"] = (x2_new - x1_new) * (y2_new - y1_new)
                            nodules[t_id]["largest_roi_idx_in_enlarged_rois"] = len(nodules[t_id]["enlarged_rois"]) - 1
                            current_rois_in_frame.append([enlarged_roi, t_id, None])
                            t_id += 1
                rois_in_frames.append(current_rois_in_frame)

            print('Detection completed!')

            return detection_results, nodules, rois_in_frames

        else:
            print('Detection and tracking started...')
            tracking_results = self.detect_track(
                dataset=dataset,
                image_size=image_size,
                batch_size=batch_size,
                iou=iou,
                save=save,
                result_dir=result_dir
            )

            print(f'Number of frames in tracking results: {len(tracking_results)}')
            for i in range(len(tracking_results)):  # Итерация по frames
                current_rois_in_frame = []

                if len(tracking_results[i]) != 1:
                    print(f'Len(frame) == {len(tracking_results[i])}, индекс: {i}')

                for m in range(len(tracking_results[i])):  # Итерация по ?
                    bboxes = tracking_results[i][m].boxes

                    if bboxes.id is not None:
                        tracked_id_list = bboxes.id.tolist()
                        xyxy_list = bboxes.xyxy.tolist()

                        for t_id, xyxy in zip(tracked_id_list, xyxy_list):

                            if t_id is not None:
                                x1_new, y1_new, x2_new, y2_new = self.preprocessing(xyxy, roi_margin_percent,
                                                                                    cropped_image_width,
                                                                                    cropped_image_height)
                                enlarged_roi = dataset[i][y1_new:y2_new, x1_new:x2_new, :]
                                if t_id not in nodules:
                                    nodules[t_id] = self.make_nodule_dict(cropped_image_width, cropped_image_height)
                                nodules[t_id]["frame_numbers"].append(i)
                                nodules[t_id]["enlarged_rois"].append(enlarged_roi)
                                nodules[t_id]["enlarged_xyxys"].append([x1_new, y1_new, x2_new, y2_new])
                                nodules[t_id]["inds_in_rois_in_frames"].append(len(current_rois_in_frame))
                                area = (x2_new - x1_new) * (y2_new - y1_new)
                                if nodules[t_id]["largest_area"] is None:
                                    nodules[t_id]["largest_area"] = area
                                    nodules[t_id]["largest_roi_idx_in_enlarged_rois"] = len(
                                        nodules[t_id]["enlarged_rois"]) - 1
                                elif area >= nodules[t_id]["largest_area"]:
                                    nodules[t_id]["largest_area"] = area
                                    nodules[t_id]["largest_roi_idx_in_enlarged_rois"] = len(
                                        nodules[t_id]["enlarged_rois"]) - 1
                                current_rois_in_frame.append([enlarged_roi, t_id, None])
                            else:
                                print(f'Nodule id {t_id} is None (frame {i})')

                rois_in_frames.append(current_rois_in_frame)

            print('Detection and tracking completed!')

            return tracking_results, nodules, rois_in_frames
