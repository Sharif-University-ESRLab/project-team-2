from rest_framework import serializers

from patients.serializers import PatientSerializer
from records.mixins import DynamicFieldsSerializerMixin
from records.models import Record

id_field = ['id']
environment_sensors_fields = ['environment_temperature', 'relative_humidity', 'air_pollution']
body_sensors_fields = ['body_temperature', 'systolic_blood_pressure', 'diastolic_blood_pressure', 'oxygen_saturation',
                       'heart_rate', 'ecg']
other_fields = ['patient', 'timestamp']


class RecordDefaultSerializer(DynamicFieldsSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = id_field + environment_sensors_fields + body_sensors_fields + other_fields


class RecordFullSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()

    class Meta:
        model = Record
        fields = id_field + environment_sensors_fields + body_sensors_fields + other_fields
