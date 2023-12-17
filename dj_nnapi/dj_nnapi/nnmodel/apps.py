from django.apps import AppConfig
from typing import *
from nnmodel.nn.nnmodel import ModelABC
from nnmodel.nn.models.SegmentationModel import SegmentationModel
from nnmodel.nn.models.ClassificationModel import EfficientNetModel
from os import getenv

class NNmodelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'nnmodel'

    MODEL_DIR = {
        'S': 'segUZI',
        'B': 'boxUZI',
        'C': 'classUZI',
    }

    
    wsgi = int(getenv('wsgi_start','0'))

    if wsgi:
        DefalutModels: Dict[str, Dict[str,ModelABC]] = {
        'C': {
            'all': EfficientNetModel(MODEL_DIR['C'],'all')

        },
        'S': {
            'cross': SegmentationModel(MODEL_DIR['S'],'cross'),
            'long': SegmentationModel(MODEL_DIR['S'],'long'),
        },
        }
    else:
        DefalutModels = {}