from celery import shared_task
from . import models
from .forms import segmetationDataForm, segmetationAiForm
from django.conf import settings

from .nn.loaders.img_loader import defaultImgLoader
from .apps import NNmodelConfig
import cv2 as cv


def createUziSegmentGroup(details, uzi_image_id, form=segmetationDataForm):
    return models.UZISegmentGroupInfo(
        details=form(details), is_ai=True, original_image_id=uzi_image_id
    )


@shared_task(name="predict_all")
def predict_all(file_path: str, projection_type: str, id: int):
    print(f"predictions, {projection_type=} {file_path=}")
    nn_cls = NNmodelConfig.DefalutModels["C"]["all"]
    nn_seg = NNmodelConfig.DefalutModels["S"][projection_type]
    img = defaultImgLoader.load(file_path)
    seg_nodules = nn_seg.predict(img)
    ind, track = nn_cls.predict(nn_seg.rois, nn_seg.img_type)
    print(f"{len(seg_nodules)=}")

    details = {}
    for key, val in track.items():
        details[key] = createUziSegmentGroup(val, id)

    models.UZISegmentGroupInfo.objects.bulk_create(details.values())

    segments_data = []
    for ni in ind:
        for idx, nj in ni.items():
            for nj2 in nj:
                pre_details = segmetationDataForm(nj2, True)
                segments_data.append(
                    models.SegmentationData(
                        segment_group=details[idx], details=pre_details
                    )
                )
    print(f"{len(segments_data)=}")
    models.SegmentationData.objects.bulk_create(segments_data)

    segments_points = []
    for k, seg in enumerate(seg_nodules):
        c, h = cv.findContours(
            seg[0],
            cv.RETR_TREE,
            cv.CHAIN_APPROX_SIMPLE | cv.CHAIN_APPROX_TC89_L1,
        )
        if h is not None:
            counter = [c[i] for i in range(h.shape[1]) if h[0][i][3] == -1][0]
            for i, pi in enumerate(counter):
                segments_points.append(
                    models.SegmentationPoint(
                        uid=i,
                        segment=segments_data[k],
                        x=pi[0, 0],
                        y=pi[0, 1],
                        z=seg[2],
                    )
                )
    print(f"{len(segments_points)=}")

    models.SegmentationPoint.objects.bulk_create(
        segments_points, batch_size=2048
    )
    models.OriginalImage.objects.filter(id=id).update(viewed_flag=True)
    print("predicted!")
    return
