import json
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.views import APIView
from nnmodel import models


# from nnmodel.nn.defaultModels import DefalutModels
from nnmodel.apps import NNmodelConfig
from nnmodel.nn.loaders.img_loader import defaultImgLoader
import cv2 as cv

"""SERIALIZERS"""
from rest_framework.serializers import Serializer, ModelSerializer
import rest_framework.serializers as ser


class PredictAllSerializer(Serializer):
    file_path = ser.CharField()
    projection_type = ser.CharField()
    id = ser.IntegerField()


class UZISegmentationForm(ModelSerializer):
    def __init__(self, instance=None, data=..., **kwargs):
        super().__init__(instance, data, **kwargs)

    nodule_type = ser.IntegerField(
        min_value=1, max_value=5, default=1, allow_null=True
    )

    nodule_2_3 = ser.FloatField(default=0, min_value=0, max_value=1)
    nodule_4 = ser.FloatField(default=0, min_value=0, max_value=1)
    nodule_5 = ser.FloatField(default=0, min_value=0, max_value=1)

    nodule_width = ser.FloatField(default=1, min_value=0)
    nodule_height = ser.FloatField(default=1, min_value=0)
    nodule_length = ser.FloatField(default=1, min_value=0)

    class Meta:
        model = models.SegmentationData
        exclude = ["details", "original_image"]

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


def segmetationDataForm(nn_class):
    data = {
        "nodule_type": nn_class.argmax() + 3,
        "nodule_2_3": nn_class[0],
        "nodule_4": nn_class[1],
        "nodule_5": nn_class[2],
    }
    ser = UZISegmentationForm(data=data)
    ser.is_valid(raise_exception=True)
    return ser.validated_data


"""APIVIEWS"""


class PredictAll(APIView):
    serializer_class = PredictAllSerializer

    def post(self, request: Request, *args, **kwargs):
        ser = self.serializer_class(data=request.data)
        ser.is_valid(raise_exception=True)
        k = self.predict(
            ser.validated_data["file_path"],
            ser.validated_data["projection_type"],
            ser.validated_data["id"],
        )
        return Response(
            data={"text": "predicted", "k": k}, status=status.HTTP_201_CREATED
        )

    def predict(self, file_path: str, projection_type: str, id: int):
        print(f"predictions, {projection_type=} {file_path=}")
        nn_cls = NNmodelConfig.DefalutModels["C"]["all"]  # projection_type
        nn_seg = NNmodelConfig.DefalutModels["S"][projection_type]
        img = defaultImgLoader.load(file_path)
        nn_mask = nn_seg.predict(img)
        ind, track = nn_cls.predict(nn_seg.rois, nn_seg.img_type)
        segments_data = []
        pre_details = {}
        for ni in ind:
            for nj in ni:
                pre_details = segmetationDataForm(nj)
                segments_data.append(
                    models.SegmentationData(
                        original_image_id=id, details=pre_details
                    )
                )

        models.SegmentationData.objects.bulk_create(segments_data)

        details = (
            pre_details
            if track is None
            else segmetationDataForm(list(track.values())[0])
        )
        uzi_img = models.OriginalImage.objects.get(id=id).uzi_image
        uzi_img.details = details
        uzi_img.save()

        segments_points = []
        k = 0
        for j, mask_img in enumerate(nn_mask):
            c, h = cv.findContours(
                mask_img,
                cv.RETR_TREE,
                cv.CHAIN_APPROX_SIMPLE | cv.CHAIN_APPROX_TC89_L1,
            )
            # print(c, h)
            if h is not None:
                cc = [c[i] for i in range(h.shape[1]) if h[0][i][3] == -1]
                for counter in cc:
                    for i, pi in enumerate(counter):
                        segments_points.append(
                            models.SegmentationPoint(
                                uid=i,
                                segment=segments_data[k],
                                x=pi[0, 0],
                                y=pi[0, 1],
                                z=j,
                            )
                        )
                    k += 1
        models.SegmentationPoint.objects.bulk_create(
            segments_points, batch_size=2048
        )

        print("predicted!")
        return k
