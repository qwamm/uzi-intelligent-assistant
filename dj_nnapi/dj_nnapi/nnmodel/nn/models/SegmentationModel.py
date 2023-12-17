from typing import Iterable
import torch
from PIL import Image
from skimage.measure import label as sklabel
from skimage.measure import regionprops
from skimage.transform import resize
from torchvision import transforms as T
from pathlib import Path
import numpy as np
import segmentation_models_pytorch as smp

from nnmodel.nn.nnmodel import ModelABC
from nnmodel.nn.loaders.preloader import ModelPreLoaderABC, ZipModelPreLoader
from django.conf import settings


class SegmentationModel(ModelABC):
    def __init__(self, model_type: str, projection_type:str='full', model_pre_loader:ModelPreLoaderABC=ZipModelPreLoader) -> None:
        self._base_clear()
        self.img_type = None
        self.model_type = model_type
        self.projection_type = projection_type
        self.device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
        
        print(f'Device: {self.device}')
        self.pre_loader = model_pre_loader(model_type, projection_type)
        base_dir = self.pre_loader.load(settings.NN_SETTINGS['segmentation'][self.projection_type])
        self.load(base_dir)

    def _base_clear(self):
        self.rois = []
        self.images = []
        self.result_masks = []
        self.bbox_coordinates = []
        self.images_features = []
        self.nodules = []
        self.selected_nodules = []
        self.unique_indices = []
        self.img_type = None

    def load(self, path: str) -> None:
        path2 = Path(path)
        weight_c1 = path2 / 'deeplabv3plus.pkl'
        self._model = smp.DeepLabV3Plus(
            encoder_name="efficientnet-b6", encoder_weights=None, in_channels=1, classes=1)
        self._model.to(self.device)
        self._model.load_state_dict(torch.load(
            weight_c1, map_location=self.device))
        self._model.eval()


    @staticmethod
    def preprocessing(img: object) -> object:
        img = Image.fromarray(img).convert(mode='L')
        Transform = T.Compose([T.ToTensor()])
        img_tensor = Transform(img)
        img_dtype = img_tensor.dtype
        img_array_fromtensor = (torch.squeeze(img_tensor)).data.cpu().numpy()
        img_array = np.array(img, dtype=np.float32)
        or_shape = img_array.shape
        if or_shape == (735, 975):
            x_cut_min = 130
            x_cut_max = 655
            y_cut_min = 155
            y_cut_max = 700
        elif or_shape == (528, 687):
            x_cut_min = 15
            x_cut_max = 420
            y_cut_min = 40
            y_cut_max = 640
        else:
            value_x = np.mean(img, 1)
            value_y = np.mean(img, 0)
            x_hold_range = list((len(value_x) * np.array([0.24 / 3, 2.2 / 3])).astype(np.int64))
            y_hold_range = list((len(value_y) * np.array([0.8 / 3, 1.8 / 3])).astype(np.int64))
            value_thresold = 5
            x_cut = np.argwhere((value_x <= value_thresold) == True)
            x_cut_min = list(x_cut[x_cut <= x_hold_range[0]])
            if x_cut_min:
                x_cut_min = max(x_cut_min)
            else:
                x_cut_min = 0
            x_cut_max = list(x_cut[x_cut >= x_hold_range[1]])
            if x_cut_max:
                x_cut_max = min(x_cut_max)
            else:
                x_cut_max = or_shape[0]
            y_cut = np.argwhere((value_y <= value_thresold) == True)
            y_cut_min = list(y_cut[y_cut <= y_hold_range[0]])
            if y_cut_min:
                y_cut_min = max(y_cut_min)
            else:
                y_cut_min = 0
            y_cut_max = list(y_cut[y_cut >= y_hold_range[1]])
            if y_cut_max:
                y_cut_max = min(y_cut_max)
            else:
                y_cut_max = or_shape[1]
        cut_image = img_array_fromtensor[x_cut_min:x_cut_max,
                                         y_cut_min:y_cut_max]
        cut_image_orshape = cut_image.shape
        cut_image = resize(cut_image, (256, 256), order=3)
        cut_image_tensor = torch.tensor(data=cut_image, dtype=img_dtype)
        return [cut_image_tensor, cut_image_orshape, or_shape, [x_cut_min, x_cut_max, y_cut_min, y_cut_max]]

    @staticmethod
    def get_connect_components(bw_img: object) -> list:
        if np.sum(bw_img) == 0:
            return []
        labeled_img, num = sklabel(bw_img, connectivity=1, background=0, return_num=True)
        # print(f'Segmented areas: {num}')
        return [[(labeled_img == i + 1).astype(np.float32), None] for i in range(num)]

    @staticmethod
    def preprocessing2(roi: object) -> list:
        if np.sum(roi) == 0:
            minr, minc, maxr, maxc = [0, 0, 256, 256]
        else:
            region = regionprops(roi)[0]
            minr, minc, maxr, maxc = region.bbox
        dim1_center, dim2_center = [(maxr + minr) // 2, (maxc + minc) // 2]
        max_length = max(maxr - minr, maxc - minc)
        max_lengthl = int((256 / 256) * 80)
        preprocess1 = int((256 / 256) * 19)
        pp22 = int((256 / 256) * 31)
        if max_length > max_lengthl:
            ex_pixel = preprocess1 + max_length // 2
        else:
            ex_pixel = pp22 + max_length // 2
        dim1_cut_min = dim1_center - ex_pixel
        dim1_cut_max = dim1_center + ex_pixel
        dim2_cut_min = dim2_center - ex_pixel
        dim2_cut_max = dim2_center + ex_pixel
        if dim1_cut_min < 0:
            dim1_cut_min = 0
        if dim2_cut_min < 0:
            dim2_cut_min = 0
        if dim1_cut_max > 256:
            dim1_cut_max = 256
        if dim2_cut_max > 256:
            dim2_cut_max = 256
        return [dim1_cut_min, dim1_cut_max, dim2_cut_min, dim2_cut_max]

    @staticmethod
    def get_bbox(img: object) -> object:
        c = np.where(img != 0)
        # return [np.max(c[1]), np.max(c[0]), np.min(c[1]), np.min(c[0])]
        return [np.min(c[1]), np.min(c[0]), np.max(c[1]), np.max(c[0])]

    @staticmethod
    def get_iou(SR, GT) -> float:
        TP = (SR + GT == 2).astype(np.float32)
        FP = (SR + (1 - GT) == 2).astype(np.float32)
        FN = ((1 - SR) + GT == 2).astype(np.float32)
        IoU = float(np.sum(TP)) / (float(np.sum(TP + FP + FN)) + 1e-6)
        return IoU
    
    def find_same_indices(self, indices, ii=0) -> list:
        if ii >= len(indices) - 1:
            return indices
        for i in range(ii + 1, len(indices)):
            if set(indices[i]) & set(indices[ii]):
                indices[ii] = sorted(list(set(indices.pop(i)) | set(indices[ii])))
                return self.find_same_indices(indices, ii)
        return self.find_same_indices(indices, ii + 1)
    
    def track_nodules(self, iou_threshold, occurrence_threshold) -> list:
        print('Tracking nodules...')
        used_indices_dict = {}
        used_indices_list = []
        same_indices = []

        first_nodule_found = False
        st = 0
        while (not first_nodule_found) and (st < len(self.nodules)):
            for i, nodule in enumerate(self.nodules[st]):
                nodule[1] = i
                first_nodule_found = True
                used_indices_dict[i] = 1
                used_indices_list.append(i)
            st += 1

        for i in range(st, len(self.nodules)):
            for c in range(len(self.nodules[i])):
                current_indices = []
                for p in range(len(self.nodules[i - 1])):
                    iou = self.get_iou(self.nodules[i - 1][p][0], self.nodules[i][c][0])
                    if iou >= iou_threshold:
                        current_indices.append(self.nodules[i - 1][p][1])

                current_indices = list(set(current_indices))
                if len(current_indices) == 1:
                    self.nodules[i][c][1] = current_indices[0]
                    used_indices_dict[current_indices[0]] += 1
                elif len(current_indices) > 1:
                    current_indices = sorted(current_indices)
                    self.nodules[i][c][1] = current_indices[0]
                    for index in current_indices:
                        used_indices_dict[index] += 1 / len(current_indices)
                    same_indices.append(current_indices)
                else:
                    new_index = used_indices_list[-1] + 1
                    self.nodules[i][c][1] = new_index
                    used_indices_dict[new_index] = 1
                    used_indices_list.append(new_index)

        same_indices = self.find_same_indices(same_indices)
         
        new_indices = {}
        for ind in used_indices_list:
            new_indices[ind] = ind
        for lst in same_indices:
            min_ind = min(lst)
            new_sum = 0
            for ind in lst:
                new_sum += used_indices_dict[ind]
                new_indices[ind] = min_ind
            for ind in lst:
                used_indices_dict[ind] = new_sum
        
        for ind in new_indices:
            if used_indices_dict[ind] >= occurrence_threshold:
                self.unique_indices.append(new_indices[ind])
        self.unique_indices = sorted(list(set(self.unique_indices)))

        for im in self.nodules:
            im_nodules = []
            for nd in im:
                new_ind = new_indices[nd[1]]
                if new_ind in self.unique_indices:
                    im_nodules.append([nd[0], new_ind])
            self.selected_nodules.append(im_nodules)
        print(f'Tracked {len(self.unique_indices)} nodule(s)')

        return self.selected_nodules

    def predict(self, images: Iterable) -> object:
        self._base_clear()
        bi = 0
        tif_length = len(images)
        
        with torch.no_grad():
            for index, im in enumerate(images):
                with torch.no_grad():
                    img, cut_image_orshape, or_shape, location = self.preprocessing(im)
                    self.img_type = img.dtype
                    img = torch.unsqueeze(img, 0)
                    img = torch.unsqueeze(img, 0)
                    img = img.to(self.device)
                    img_array = (torch.squeeze(img)).data.cpu().numpy()
                    self.images_features.append([img_array, cut_image_orshape, or_shape, location])

                    with torch.no_grad():
                        mask_c1 = self._model(img)
                        mask_c1 = torch.sigmoid(mask_c1)
                        mask_c1_array = (torch.squeeze(mask_c1)).data.cpu().numpy()
                        mask_c1_array = (mask_c1_array > 0.5)
                        mask_c1_array = mask_c1_array.astype(np.float32)
                        current_nodules = self.get_connect_components(mask_c1_array.astype(np.int64))
                        self.nodules.append(current_nodules)

        if tif_length == 1:
            self.selected_nodules = self.nodules
        elif tif_length > 1:
            self.selected_nodules = self.track_nodules(iou_threshold=0.2, occurrence_threshold=tif_length/5)

        seg_nodules = []
        for index, (nodules, features) in enumerate(zip(self.selected_nodules, self.images_features)):
            # Убрал координаты, добавил одномерный массив со всеми сегментами, типом, и индексом
            img_array = features[0]
            cut_image_orshape = features[1]
            or_shape = features[2]
            location = features[3]
            new_nodules = []
            # coordinates = []
            mask_array = np.zeros(shape=(256, 256), dtype=np.float32)

            for node in nodules:
                nd = node[0].astype(np.int64)
                mask_array = mask_array + nd.astype(np.float32)
                mask_array = np.where(mask_array > 0, 1., 0.).astype(np.float32)

                dim1_cut_min, dim1_cut_max, dim2_cut_min, dim2_cut_max = self.preprocessing2(nd)
                img_array_roi = img_array[dim1_cut_min:dim1_cut_max, dim2_cut_min:dim2_cut_max]
                new_nodules.append([img_array_roi, node[1]])

                n1_array = nd.astype(np.float32)
                f1_mask = np.zeros(shape=or_shape, dtype=np.float32)
                n1_array = resize(n1_array, cut_image_orshape, order=1)
                f1_mask[location[0]:location[1],
                        location[2]:location[3]] = n1_array
                f1_mask = (f1_mask > 0.5)
                f1_mask = f1_mask.astype(np.uint8) * 255
                seg_nodules.append((f1_mask, node[1], index))
                # cs = self.get_bbox(f1_mask)
                # coordinates.append(cs)

            self.rois.append(new_nodules)
            # self.bbox_coordinates.append(coordinates)

            final_mask = np.zeros(shape=or_shape, dtype=np.float32)
            mask_array = resize(mask_array, cut_image_orshape, order=1)
            final_mask[location[0]:location[1],
                        location[2]:location[3]] = mask_array
            final_mask = (final_mask > 0.5)
            final_mask = np.where(final_mask > 0, 255, 0).astype(np.uint8)
            self.result_masks.append(final_mask)
        print('seg Done!')
        # self.save_result()
        # return self.result_masks
        return seg_nodules

    def save_result(self) -> str:
        """
        Method which saves segmentation result without boxes and classes

        image_path = '<folder>/<filename>.<extension>'
        """
        import imageio, pickle
        file_name = 'aaa'
        extension = 'tiff'
        result_path = settings.MEDIA_ROOT_PATH /f'{file_name}_result.{extension}'
        if len(self.result_masks) > 1:
            imageio.mimwrite(result_path, np.array(self.result_masks))
        with open(settings.MEDIA_ROOT_PATH /f'{file_name}_rois.pkl', 'wb') as out:
            pickle.dump(self.rois, out)
        print('Result saved')

        return result_path