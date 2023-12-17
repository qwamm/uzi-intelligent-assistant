from nnmodel import models
from rest_framework.serializers import ModelSerializer, Serializer
import rest_framework.serializers as ser

class UZISegmentationGroupForm(Serializer):
  nodule_type = ser.IntegerField(
    min_value=1,
    max_value=5,
    default=1,
    allow_null=True
  )

  nodule_2_3 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )
  nodule_4 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )
  nodule_5 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )

  nodule_width = ser.FloatField(
    default=1,
    min_value=0,
  )
  nodule_height = ser.FloatField(
    default=1,
    min_value=0,
  )
  nodule_length = ser.FloatField(
    default=1,
    min_value=0,
  )

  
class UZISegmentationDataForm(Serializer):

  nodule_type = ser.IntegerField(
    min_value=1,
    max_value=5,
    default=1,
    allow_null=True
  )

  nodule_2_3 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )
  nodule_4 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )
  nodule_5 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )

  nodule_width = ser.FloatField(
    default=1,
    min_value=0,
  )
  nodule_height = ser.FloatField(
    default=1,
    min_value=0,
  )
  nodule_length = ser.FloatField(
    default=1,
    min_value=0,
  )


class UZISegmentationAiForm():

  nodule_type = ser.IntegerField(
    min_value=1,
    max_value=5,
    default=1,
    allow_null=True
  )

  nodule_2_3 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )
  nodule_4 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )
  nodule_5 = ser.FloatField(
    default=0,
    min_value=0,
    max_value=1
  )



def segmetationDataForm(nn_class, isData=False):
  print(f'sg data form {nn_class=}')
  data = {
    "nodule_type": nn_class.argmax() + 3,
    "nodule_2_3": nn_class[0],
    "nodule_4": nn_class[1],
    "nodule_5": nn_class[2],
  }
  if isData:
    ser = UZISegmentationDataForm(data=data)
  else:
    ser = UZISegmentationGroupForm(data=data)
  ser.is_valid(raise_exception=True)
  return ser.validated_data

def segmetationAiForm(nn_class, many=False):
  data = {
    "nodule_type": nn_class.argmax() + 3,
    "nodule_2_3": nn_class[0],
    "nodule_4": nn_class[1],
    "nodule_5": nn_class[2],
  }
  ser = UZISegmentationAiForm(data=data,many=many)
  ser.is_valid(raise_exception=True)
  return ser.validated_data