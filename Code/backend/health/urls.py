from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/v1/patients/', include('patients.urls')),
    url(r'^api/v1/records/', include('records.urls')),
]
