from django_filters import rest_framework as filters
from . import models


class NotificationDynamicsFilter(filters.FilterSet):
    class Meta:
        model = models.NotificationDynamics
        fields = ["status"]
