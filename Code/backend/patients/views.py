from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response

from patients import serializers


class PatientCreate(generics.GenericAPIView):
    serializer_class = serializers.PatientSerializer

    def post(self, request):
        patient_serializer: serializers.PatientSerializer = self.get_serializer(**request.data)
        if patient_serializer.is_valid():
            patient_serializer.create(patient_serializer.validated_data)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
