# Create your views here.
from rest_framework import viewsets

from patients import serializers
from patients.models import Patient


# Handling All CRUD operations for Patient using Django Rest Framework

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PatientSerializer
    queryset = Patient.objects.all()
