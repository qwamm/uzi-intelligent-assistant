from PIL import Image
from nnmodel.nn.nnmodel import ModelABC
from django.conf import settings

class ClassificationModel(ModelABC):

  def load(self, path: list) -> None:
    self._model = Image.open(path[0])

  def preprocessing(self, path: str) -> object:
    pass

  def predict(self, path: str) -> object:
    img = self._model.rotate(45)
    print(img, np.array(img).shape)
    return np.array([np.array(img)])


import torch
from torch import nn
from torchvision import transforms as T
from torchvision.models import resnet18 as resnet18
from torchvision.utils import draw_bounding_boxes
from torchvision.transforms.functional import to_pil_image
from skimage.transform import resize
from pathlib import Path
import numpy as np

from nnmodel.nn.loaders.preloader import ModelPreLoaderABC, ZipModelPreLoader


class ResnetModel(ModelABC):

    def __init__(self, model_type: str, projection_type:str='full', model_pre_loader:ModelPreLoaderABC=ZipModelPreLoader) -> None:
        self.model_type = model_type
        self.projection_type = projection_type
        self.device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
        self._base_clear()
        self.labels = {0: 'tirads 2-3', 1: 'tirads 4', 2: 'tirads 5'}
        self.pre_loader = model_pre_loader(model_type, projection_type)
        base_dir = self.pre_loader.load(settings.NN_SETTINGS['classification'][self.projection_type])
        self.load(base_dir)
        self.result_class = None

    def _base_clear(self):
        self.classes = []

    def load(self, path: str) -> None:
        path2 = Path(path) / 'resnet.pth'
        self._model = resnet18()
        self._model.conv1 = nn.Conv2d(1, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False)
        self._model.fc = nn.Linear(512, 3)
        self._model.to(self.device)
        self._model.load_state_dict(torch.load(path2, map_location=self.device))
        self._model.eval()

    def preprocessing(self, img_array: object, img_dtype: str) -> object:
        img_array0 = resize(img_array, (224, 224), order=3)
        img_array_tensor = torch.tensor(data=img_array0, dtype=img_dtype)
        img_array_tensor = torch.unsqueeze(img_array_tensor, 0)
        normalization = T.Normalize((0.45), (0.225))
        img_array_tensor = normalization(img_array_tensor)
        img_array_tensor = torch.unsqueeze(img_array_tensor, 0).to(self.device)
        return img_array_tensor

    @staticmethod
    def get_bbox(img: object) -> object:
        c = np.where(img != 0)
        return np.max(c[1]), np.max(c[0]), np.min(c[1]), np.min(c[0])

    def draw_bbox(self, img: object, label: list, bbox: object) -> object:
        img_tensor = torch.tensor(img)
        if len(img.shape) == 3:
            img_tensor = torch.permute(img_tensor, (2, 0, 1))
        elif len(img.shape) == 2:
            img_tensor = torch.unsqueeze(img_tensor, 0)
        bbox_tensor = torch.tensor(bbox)
        final_tensor = draw_bounding_boxes(img_tensor, bbox_tensor, width=1, labels=label, colors='red')
        final_image = to_pil_image(final_tensor)
        return np.array(final_image)
        
    def max_met_class(self, classes: list) -> str:
        counter_dict = {}
        max_number = 0
        for key in self.labels:
            counter_dict[key] = classes.count(self.labels[key])
            if counter_dict[key] > max_number:
                max_number = counter_dict[key]
        key = len(self.labels) - 1
        while key >= 0:
            if counter_dict[key] == max_number:
                result_class = self.labels[key]
                key = -1
            else:
                key -= 1
        return result_class

    def predict(self, rois: list, image_type: str) -> object:
        self._base_clear()
        l1 = len(rois)
        l2 = max([len(r) for r in rois])
        self.classes2 = np.zeros((l1,l2,3))
        bi = 0 
        for r1, r in enumerate(rois):
            classes_on_image = []
            for r2, nd in enumerate(r):
                roi_tensor = self.preprocessing(nd, image_type)
                with torch.no_grad():
                    logits = self._model(roi_tensor)
                    res2 = logits.cpu().numpy()
                    res = res2.flatten()
                    maxs = res.max()
                    mins = res.min()
                    mmx = (res - mins) / (maxs- mins) 
                    mmx = mmx / mmx.sum() * 100
                    classes_on_image.append(self.labels[mmx.argmax()])
                    self.classes2[r1,r2] = mmx
                bi += 1
            self.classes.append(classes_on_image)
        return self.classes2 / 100

    @staticmethod
    def norm_classes(cls: np.ndarray):
        r = cls.mean(axis=0)
        if not cls.size:
            return {
            '1': 0.0,
            '2': 0.0,
            '3': 0.0,
            '4': 0.0,
            '5': 0.0,
        }
        r1 = r[0]
        return {
            '1': 0.0,
            '2': round(r1[0] / 2,2),
            '3': round(r1[0] / 2,2),
            '4': round(r1[1], 2),
            '5': round(r1[2], 2),
        }

    def draw_boxes(self, imgs: list, bbox_coordinates: list):
        new_masks = []
        for m, b, c in zip(imgs, bbox_coordinates, self.classes):
            # print(m.shape, b, c)
            if b:
                new_m = self.draw_bbox(m, ['' for i in c], b)
            else:
                new_m = m
            # new_m = self.draw_bbox(m, c, b) # TODO: change :)
            new_masks.append(new_m)
        return np.array(new_masks)



from torchvision.models import efficientnet_b6 as efficientnet_b6
from torch.nn import functional as F
from imgaug import augmenters as iaa



class EfficientNetModel(ModelABC):

    def __init__(self, model_type: str, projection_type:str='full', model_pre_loader:ModelPreLoaderABC=ZipModelPreLoader):  # model_type='all'/'long'/'cross'
        self.model_type = model_type
        self.device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
        print(f'Device: {self.device}')
        self.pre_loader = model_pre_loader(model_type, projection_type)
        base_dir = self.pre_loader.load(settings.NN_SETTINGS['classification']['all'])
        self.load(base_dir)
        # self.load(path=settings.NN_SETTINGS['classification']['all'])
        self.transform = T.Compose([
            iaa.Sequential([
            iaa.Resize({"height": 224, "width": 224})
            ]).augment_image,
            T.ToTensor(),
            T.Normalize((0.24), (0.12))
        ])
        self._base_clear()

    def _base_clear(self):
        self.classes = []
        self.individual_probs = []
        self.tracked_nodules_logits = {}
        self.tracked_nodules_probs = {}
        self.tracked_nodules_counts = {}

    def load(self, path: str) -> None:
        path2 = Path(path) / 'all/efficientnet.pth'
        self._model = efficientnet_b6()
        self._model.features[0][0] = nn.Conv2d(1, 56, kernel_size=(3, 3), stride=(2, 2), padding=(1, 1), bias=False)
        self._model.classifier[1] = nn.Linear(2304, 3)
        self._model.to(self.device)
        self._model.load_state_dict(torch.load(path2, map_location=self.device))
        self._model.eval()

    def preprocessing(self, image_array: object) -> object:
        image_tensor = self.transform(image_array)
        image_tensor = torch.unsqueeze(image_tensor, 0)
        image_tensor = image_tensor.to(self.device)
        return image_tensor

    def predict(self, rois: list, *args, **kwargs) -> np.ndarray:
        """
        Аргумент rois - [[...], [...], ..., [...]] - список списков с rois для всего tif,
        
        len(rois) - количество изображений tif, len(rois[i]) - количество rois на i-ой картинке
        Возвращает в аналогичном формате вероятности self.classes - [[...], [...], ..., [...]] - 
        список списков с вероятностями отнесения к классам каждого узла для всего tif

        len(self.classes) - количество изображений tif, len(self.classes[i]) - 
        количество numpy arrays с вероятностями отнесения к каждому классу для каждого roi 
        на i-ой картинке, 
        """
        """
        Аргумент rois - [[[roi[0], 1], ..., [roi[n], m]], [...], ..., [...]] - 
        список списков с rois и соответствующих им индексов узлов (для всего tif),
        len(rois) - количество изображений tif, len(rois[i]) - количество rois на i-ой картинке

        Возвращает: (self.individual_probs, self.tracked_nodules_probs)
        self.individual_probs - [[...], [...], ..., [...]] - список списков с вероятностями отнесения каждого сегмента к каждому классу для каждого изображения tif
        len(self.individual_probs) - количество изображений tif, len(self.individual_probs[i]) - 
        количество numpy массивов с вероятностями отнесения к каждому классу для каждого roi на i-ой картинке
        self.tracked_nodules_probs - None для одного изображения, словарь для кинопетли (нескольких изображений), 
        у которого ключ - индекс узла, отслеживаемого на кинопетле, значение - numpy массив с итоговыми вероятностями отнесения к классам
        """
        print('Class inference...')
        # self.classes2 = np.zeros((l1,l2,3))
        self._base_clear()
        k = 0
        for r in rois:
            probs_for_image = {}
            for nd in r:
                roi_tensor = self.preprocessing(nd[0])
                with torch.no_grad():
                    logits = self._model(roi_tensor)
                    new_probs = F.softmax(logits, dim=1)
                    new_probs = new_probs.cpu().numpy()[0]
                    if len(rois) > 1:
                        if nd[1] not in probs_for_image:
                            probs_for_image[nd[1]] = []
                        probs_for_image[nd[1]].append(new_probs)
                    else:
                        probs_for_image[k] = [new_probs]
                        probs_for_image[k]
                    if len(rois) > 1:
                        if nd[1] in self.tracked_nodules_logits:
                            self.tracked_nodules_logits[nd[1]] += logits
                            self.tracked_nodules_counts[nd[1]] += 1
                        else:
                            self.tracked_nodules_logits[nd[1]] = logits
                            self.tracked_nodules_counts[nd[1]] = 1
                    else:
                        self.tracked_nodules_probs[k] = new_probs
                        k += 1 
            self.individual_probs.append(probs_for_image)
        if len(rois) > 1:
            for nodule in self.tracked_nodules_logits:
                self.tracked_nodules_logits[nodule] = self.tracked_nodules_logits[nodule] / self.tracked_nodules_counts[nodule]
                self.tracked_nodules_probs[nodule] = F.softmax(self.tracked_nodules_logits[nodule], dim=1).cpu().numpy()[0]
        print('Done!')
        return self.individual_probs, self.tracked_nodules_probs