# Create your views here.
from rest_framework import viewsets

from patients import serializers
from patients.models import Patient


class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PatientSerializer
    queryset = Patient.objects.all()
