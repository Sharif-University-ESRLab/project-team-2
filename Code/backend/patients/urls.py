from django.urls import path
from patients import views
from django.conf.urls import url, include

from patients.views import PatientCreate

urlpatterns = [
    path('patient/register/', PatientCreate.as_view(), name='patient-register'),
    # path(r'patient/update/(?P<patient_id>[0-9]+)?/$', LoginView.as_view(), name='patient-update'),
    # path(r'patient/delete/(?P<patient_id>[0-9]+)?/', knox_views.LogoutView.as_view(), name='patinet-delete'),
    # path('patinet/view/(?P<patient_id>[0-9]+)?/', knox_views.LogoutAllView.as_view(), name='patient-view')
]
