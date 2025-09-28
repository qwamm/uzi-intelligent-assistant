import torch
from torch.utils.data import Dataset
import numpy as np
from typing import List, Tuple, Optional
import albumentations as A


class ROIDataset(Dataset):
    """
    Датасет для работы с областями интереса (ROI) узлов щитовидной железы
    """

    def __init__(self,
                 images: List[np.ndarray],
                 coordinates: List[List[int]],
                 cropped_image_width: int,
                 cropped_image_height: int,
                 frame_numbers: List[int],
                 inds_in_rois_in_frames_list: List[int],
                 transform: Optional[A.Compose] = None) -> None:
        """
        Инициализация ROI датасета.

        Args:
            images (List[np.ndarray]): Список ROI изображений в виде numpy массивов
            coordinates (List[List[int]]): Список списков (координат ROI [x1, y1, x2, y2])
            cropped_image_width (int): Ширина оригинального обрезанного изображения
            cropped_image_height (int): Высота оригинального обрезанного изображения
            frame_numbers (List[int]): Номера кадров, к которым относятся ROI
            inds_in_rois_in_frames_list (List[int]): Индексы ROI в списке rois_in_frames
            transform (Optional[A.Compose], optional): Преобразования для применения к изображениям
        """

        self.images = images
        self.coordinates = coordinates
        self.cropped_image_width = cropped_image_width
        self.cropped_image_height = cropped_image_height
        self.frame_numbers = frame_numbers
        self.inds_in_rois_in_frames_list = inds_in_rois_in_frames_list
        self.transform = transform

    def __len__(self) -> int:
        return len(self.images)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int, int, int, int, int, int, int, int]:
        """
        Возвращает ROI изображение и связанную с ним информацию по индексу.

        Args:
            idx (int): Индекс ROI изображения

        Returns:
            Tuple[torch.Tensor, int, int, int, int, int, int, int, int]: Кортеж содержащий:
                - изображение (torch.Tensor)
                - координата x1 (int)
                - координата y1 (int)
                - координата x2 (int)
                - координата y2 (int)
                - высота исходного ROI (int)
                - ширина исходного ROI (int)
                - номер кадра (int)
                - индекс ROI в rois_in_frames_list (int)
        """

        image = self.images[idx].copy()
        initial_roi_height = image.shape[0]
        initial_roi_width = image.shape[1]
        coords0, coords1, coords2, coords3 = self.coordinates[idx]  # [x1, y1, x2, y2]
        frame_number = self.frame_numbers[idx]
        ind_in_rois_in_frames_list = self.inds_in_rois_in_frames_list[idx]

        if self.transform:
            transformed = self.transform(image=image)
            image = transformed['image']

        return image, coords0, coords1, coords2, coords3, initial_roi_height, initial_roi_width, frame_number, ind_in_rois_in_frames_list
