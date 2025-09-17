from .nnmodel import ModelABC
from .models.SegmentationModel import SegmentationModel
from .models.ClassificationModel import EfficientNetModel

from typing import *
from os import getenv


MODEL_DIR = {"S": "segUZI", "B": "boxUZI", "C": "classUZI"}

wsgi = int(getenv("wsgi_start", "0"))
print(wsgi)

if wsgi:
    DefalutModels: Dict[str, Dict[str, ModelABC]] = {
        "C": {
            # 'cross': ResnetModel(MODEL_DIR['C'],'cross'),
            # 'long': ResnetModel(MODEL_DIR['C'],'long'),
            "all": EfficientNetModel(MODEL_DIR["C"], "all")
        },
        "S": {
            "cross": SegmentationModel(MODEL_DIR["S"], "cross"),
            "long": SegmentationModel(MODEL_DIR["S"], "long"),
        },
    }
    print("all models were loaded!")
else:
    DefalutModels = {}
