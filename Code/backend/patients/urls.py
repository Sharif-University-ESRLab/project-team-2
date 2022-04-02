from django.urls import path
from rest_framework.routers import DefaultRouter

from patients import views
from django.conf.urls import url, include

# from patients.views import PatientCreate

# urlpatterns = [
#     path('register/', PatientCreate.as_view(), name='patient-register'),
#     # path(r'/update/(?P<patient_id>[0-9]+)?/$', LoginView.as_view(), name='patient-update'),
#     # path(r'/delete/(?P<patient_id>[0-9]+)?/', knox_views.LogoutView.as_view(), name='patinet-delete'),
#     # path('/view/(?P<patient_id>[0-9]+)?/', knox_views.LogoutAllView.as_view(), name='patient-view')
# ]
from patients.views import PatientViewSet

router = DefaultRouter()
router.register(r'', PatientViewSet, basename='patient')
urlpatterns = router.urls