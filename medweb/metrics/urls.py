from django.urls import path
import views


urlpatterns = [path("metrics/", views.index, name="metrics")]
