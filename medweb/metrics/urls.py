from django.urls import path
from . import views


urlpatterns = [path("metrics/", views.index, name="metrics")]
