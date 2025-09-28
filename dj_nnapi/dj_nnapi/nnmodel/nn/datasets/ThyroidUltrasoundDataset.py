from PIL import Image
import copy
import numpy as np
from torch.utils.data import Dataset


class ThyroidUltrasoundDataset(Dataset):
    """
    Датасет для работы с ультразвуковыми изображениями щитовидной железы.

    Загружает изображения (в т.ч. многокадровые), обрезает нерелевантные области и
    предоставляет доступ к обработанным изображениям через PyTorch Dataset интерфейс.
    """

    def __init__(self, path: str) -> None:
        print('Image processing started...')
        self.path = path
        self.initial_width = None
        self.initial_height = None
        self.images = []  # list of PIL images
        self.crop_coordinates = {}
        self.cropped_images = []  # list of RGB numpy arrays
        self.cropped_width = None
        self.cropped_height = None

        x_cut_min_list = []
        x_cut_max_list = []
        y_cut_min_list = []
        y_cut_max_list = []

        image = Image.open(self.path)
        self.initial_width, self.initial_height = image.size
        print(image.size)
        i = 0
        while True:
            try:
                image.seek(i)
                current_image = copy.deepcopy(image)
                self.images.append(current_image)
                x_cut_min, x_cut_max, y_cut_min, y_cut_max = self.irrelevant_region_coords(current_image)
                x_cut_min_list.append(x_cut_min)
                x_cut_max_list.append(x_cut_max)
                y_cut_min_list.append(y_cut_min)
                y_cut_max_list.append(y_cut_max)
                i += 1
            except EOFError:
                break

        self.crop_coordinates['x_cut_min'] = min(x_cut_min_list)
        self.crop_coordinates['x_cut_max'] = max(x_cut_max_list)
        self.crop_coordinates['y_cut_min'] = min(y_cut_min_list)
        self.crop_coordinates['y_cut_max'] = max(y_cut_max_list)
        print(
            f'Final crop coordinates: {self.crop_coordinates["x_cut_min"]} {self.crop_coordinates["x_cut_max"]} {self.crop_coordinates["y_cut_min"]} {self.crop_coordinates["y_cut_max"]}')

        for img in self.images:
            rgb_img = img.convert('RGB')
            img_array = np.array(rgb_img)
            img_array = img_array[
                        self.crop_coordinates['x_cut_min']:self.crop_coordinates['x_cut_max'],
                        self.crop_coordinates['y_cut_min']:self.crop_coordinates['y_cut_max']
                        ]
            self.cropped_images.append(img_array.astype(np.uint8))

        self.cropped_width = self.cropped_images[0].shape[1]
        self.cropped_height = self.cropped_images[0].shape[0]

        print(f'Original image processed!')

    def __len__(self) -> int:
        return len(self.cropped_images)

    def __getitem__(self, idx: int) -> np.ndarray:
        current_image = self.cropped_images[idx]
        return current_image

    @staticmethod
    def irrelevant_region_coords(img: Image.Image) -> tuple[int, int, int, int]:
        """
        Определяет координаты для обрезки нерелевантных областей изображения.

        Args:
            img (Image.Image): Входное PIL изображение

        Returns:
            tuple[int, int, int, int]: Кортеж с координатами обрезки
                                     (min_row, max_row, min_col, max_col)
        """

        grey_img = img.convert(mode='L')
        grey_img_array = np.array(grey_img)
        or_shape = grey_img_array.shape
        value_x = np.mean(grey_img, 1)
        value_y = np.mean(grey_img, 0)
        x_hold_range = list((len(value_x) * np.array([0.8 / 3, 2.2 / 3])).astype(np.int_))
        y_hold_range = list((len(value_y) * np.array([0.8 / 3, 1.8 / 3])).astype(np.int_))
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

        return x_cut_min, x_cut_max, y_cut_min, y_cut_max  # Actually return min_row, max_row, min_col, max_col
