from django.urls import path
from rest_framework.routers import DefaultRouter

from records.views import RecordViewSet, RecordFullViewSet, get_latest_data, get_latest_time_data, get_by_filter

urlpatterns = [
    path('latest/', get_latest_data, name='last-record'),
    path(r'latest/time/', get_latest_time_data, name='last-time-record'),
    path(r'filter/', get_by_filter, name='filter-record'),
]
router = DefaultRouter()
router.register(r'full', RecordFullViewSet, basename='record-full')
router.register(r'', RecordViewSet, basename='record')
urlpatterns += router.urls
