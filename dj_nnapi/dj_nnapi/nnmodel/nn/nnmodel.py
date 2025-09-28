from abc import ABC, abstractmethod

settings = {
    'detection': {'all': 'media/nnModel/detectUZI/all/epoch93_P0,843_R0,741.pt'},
    'segmentation': {'all': 'media/nnModel/segUZI/all/Unet-timm-efficientnet-b7_dice-0.950.pt'},
    'classification': {
        'all':
            {
                'cv_models': [
                    'media/nnModel/classUZI/all/best90,5_s.pt',  # T2vsT3
                    'media/nnModel/classUZI/all/best95,1_l.pt',  # T2vsT4
                    'media/nnModel/classUZI/all/best90,6_m.pt',  # T2vsT5
                    'media/nnModel/classUZI/all/best77,1_n.pt',  # T3vsT4
                    'media/nnModel/classUZI/all/best84,9-l.pt',  # T3vsT5
                    'media/nnModel/classUZI/all/best77,5_s.pt',  # T4vsT5
                ],
                'ml_models': [
                    'media/nnModel/classUZI/all/XGB_without_US_type_73,13.pkl',
                    'media/nnModel/classUZI/all/XGB_with_US_type_73,88.pkl',
                    'media/nnModel/classUZI/all/XGB_ensemble_2_ml_models_74,63.pkl',
                ]
            }
    }
}

class ModelABC(ABC):

    def __init__(self):
        self._model = None

    @abstractmethod
    def load(self, path: str) -> None:
        """
        Функция, в которой обределяется структура NN и
        происходит загрузка весов модели в self._model

        params:
          path - путь к файлу, в котором содержатся веса модели
        """
        ...

    @abstractmethod
    def preprocessing(self, path: str) -> object:
        """
        Функция, котороя предобрабатывает изображение к виду,
        с которым можеn взаимодействовать модель из self._model

        params:
          path - путь к файлу (изображению .tiff/.png), который будет
                использоваться для предсказания

        return - возвращает предобработанное изображение
        """
        ...

    @abstractmethod
    def predict(self, path: str) -> object:
        """
        Функция, в которой предобработанное изображение подается
        на входы NN (self._model) и возвращается результат работы NN

        params:
          path - путь к файлу (изображению .tiff/.png), который будет
                использоваться для предсказания

        return - результаты предсказания
        """
        ...

class YourModel(ModelABC):

    def load(self, path: str) -> None:
        # Пример на псевдо-питоновском
        # with open(path, 'rb') as inp:
        #   weights = inp.read()
        #   self._model = nn.Pypeline(
        #     nn.Layer1(weights=weights[0]),
        #     nn.Layer2(weights=weights[1]),
        #   )
        pass

    def preprocessing(self, path: str) -> object:
        # Пример на псевдо-питоновском
        # with open(path, 'rb') as inp:
        #   x = nn.Tiff2Image(inp)
        #   preproced_x = nn.normalize(x)
        # return preproced_x
        pass

    def predict(self, path: str) -> object:
        # Пример на псевдо-питоновском
        # x = self.preprocessing(path)
        # return self._model.predict(x)
        pass

