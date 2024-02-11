from celery import shared_task


@shared_task(name="predict_all")
def predict_all(file_path: str, projection_type: str, id: int):
    print("predictions")
