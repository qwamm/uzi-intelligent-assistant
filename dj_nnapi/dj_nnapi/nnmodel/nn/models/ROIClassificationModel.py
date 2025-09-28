import os

from ultralytics import YOLO
from typing import Dict, List, Union, Any
import numpy as np
import joblib

from nnmodel.nn.nnmodel import ModelABC, settings
class ROIClassificationModel(ModelABC):
    """
    Модель для классификации областей интереса (ROI) узлов щитовидной железы.
    """

    def __init__(self, model_type: str) -> None:  # model_type='all'/'long'/'cross'
        super().__init__()
        self.model_type = model_type

        self.names_numbers_dict = {
            'TIRADS1': 1,
            'TIRADS2': 2,
            'TIRADS3': 3,
            'TIRADS4': 4,
            'TIRADS5': 5,
        }

        self.numbers_names_dict = {
            1: 'TIRADS1',
            2: 'TIRADS2',
            3: 'TIRADS3',
            4: 'TIRADS4',
            5: 'TIRADS5',
        }

        self.load(paths=settings['classification']['all'])

    def load(self, paths: Dict[str, List[str]]) -> None:
        """
        Загружает предобученные модели для классификации RoIs

        Параметры:
        paths : dict
            Словарь с путями к моделям, содержащий:
            - 'cv_models': список путей к YOLO-моделям;
            - 'ml_models': список путей к ML-моделям (joblib-файлы).
        """

        cv_model_paths = paths['cv_models']
        ml_model_paths = paths['ml_models']  # 'cross' - 10, 'long' - 11
        self._cv_models = []
        self._ml_models = []
        for p in cv_model_paths:
            print(p)
            print("Текущий рабочий каталог:", os.getcwd())
            self._cv_models.append(YOLO(p))
        for p in ml_model_paths:
            print(p)
            print("Текущий рабочий каталог:", os.getcwd())
            self._ml_models.append(joblib.load(p))

    def preprocessing(self) -> None:
        pass

    def predict_one_track(self, nodule: np.ndarray, image_size: int) -> str:
        """
        Выполняет предсказание TIRADS-класса для одного отслеженного узла.

        Параметры:
        ----------
        nodule : np.ndarray
            Изображение ROI узла щитовидной железы.
        image_size : int
            Размер изображения, до которого оно будет масштабировано перед подачей в YOLO.

        Возвращает:
        ----------
        str
            Предсказанный класс в формате 'TIRADSX' (X ∈ {1,2,3,4,5}).
        """

        cv_preds = []
        for model in self._cv_models:
            result = model(source=nodule, imgsz=image_size)
            if len(result) != 1:
                print(f'Len(result) != 1 (= {len(result)})')
            for r in result:
                pred_class = r.probs.top1
                cv_preds.append(self.names_numbers_dict[model.names[int(pred_class)]] - 2)
        print(f'CV preds: {cv_preds}')

        ml_preds = []
        ml_pred1 = self._ml_models[0].predict([cv_preds]).item()
        # print(ml_pred1)
        ml_preds.append(ml_pred1)

        if self.model_type == 'all':
            cv_preds_with_type10 = cv_preds + [10]
            ml_pred2_0 = self._ml_models[1].predict([cv_preds_with_type10]).item()
            cv_preds_with_type11 = cv_preds + [11]
            ml_pred2_1 = self._ml_models[1].predict([cv_preds_with_type11]).item()
            ml_pred2 = max(ml_pred2_0, ml_pred2_1)
        else:
            if self.model_type == 'cross':
                model_feature = 10
            elif self.model_type == 'long':
                model_feature = 11
            cv_preds_with_type = cv_preds + [model_feature]
            ml_pred2 = self._ml_models[1].predict([cv_preds_with_type]).item()
        # print(ml_pred2)
        ml_preds.append(ml_pred2)

        print(f'ML preds: {ml_preds}')
        ml_pred3 = self._ml_models[2].predict([ml_preds]).item()
        # print(ml_pred3)

        return self.numbers_names_dict[ml_pred3 + 2]

    def predict(self, nodules: Dict[str, Dict[str, Any]], image_size: int) -> Union[str, Dict[str, str]]:
        """
        Выполняет классификацию всех отслеженных узлов.

        Параметры:
        ----------
        nodules : Dict[str, Dict[str, Any]]
            Словарь узлов, где ключ — идентификатор узла (str), значение — словарь с данными:
            {
                "enlarged_rois": List[np.ndarray],
                "largest_roi_idx_in_enlarged_rois": int
            }
        image_size : int
            Размер изображения для подачи в YOLO-модели.

        Возвращает:
        ----------
        Union[str, Dict[str, str]]
            - Если узлов нет → возвращает 'TIRADS1' (по умолчанию);
            - Иначе → словарь {id_узла: 'TIRADSX'} (X ∈ {1,2,3,4,5}).
        """

        nodule_class_dict = {}
        print('Classification started...')
        if not nodules:
            print('TIRADS1\nClassification completed!')
            return 'TIRADS1'
        else:
            for t_id in nodules:
                print(f'Nodule (id = {t_id}):')
                largest_roi_idx_in_enlarged_rois = nodules[t_id]["largest_roi_idx_in_enlarged_rois"]
                pred_class = self.predict_one_track(
                    nodule=nodules[t_id]["enlarged_rois"][largest_roi_idx_in_enlarged_rois], image_size=image_size)
                nodule_class_dict[t_id] = pred_class
            print(f'Final preds: {nodule_class_dict}\nClassification completed!')
            return nodule_class_dict
