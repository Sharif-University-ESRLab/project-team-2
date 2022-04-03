from rest_framework import serializers

from patients.models import Patient


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        bmi = serializers.ReadOnlyField(source='bmi')

        fields = ('id', 'first_name', 'last_name', 'phone', 'email', 'gender', 'height', 'mass', 'bmi')
