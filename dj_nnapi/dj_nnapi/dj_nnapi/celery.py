import os
from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "dj_nnapi.settings")
app = Celery("dj_nnapi")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()