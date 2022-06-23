from datetime import timedelta

from django.core.exceptions import ObjectDoesNotExist
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from records import serializers
from records.models import Record
from records.openapi import day_param, hour_param, minute_param, second_param, latest_data_response, \
    latest_time_data_response, patient_param, to_param, from_param, sensors_param, filter_data_response


# Handling All CRUD operations for Patient using Django Rest Framework and RecordDefaultSerializer
class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RecordDefaultSerializer
    queryset = Record.objects.all()


# Handling All CRUD operations for Patient using Django Rest Framework and RecordFullSerializer
class RecordFullViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RecordFullSerializer
    queryset = Record.objects.all()
    http_method_names = ['get']


@swagger_auto_schema(method='get', responses={200: latest_data_response})
@api_view(['GET'])
def get_latest_data(request):
    """
    @param patient_id: patient id
    @return latest data of patient.
    This function uses the latest data for each field separately. If data for one field is not available, it will return default value.
    """
    if not Record.objects.all().exists():
        return Response(status=status.HTTP_404_NOT_FOUND)
    patient_id = request.GET.get('patient_id', None)
    try:
        last_record_environment_temperature: Record = Record.objects.filter(patient_id=patient_id).filter(
            environment_temperature__isnull=False).latest('timestamp')
        environment_temperature = last_record_environment_temperature.environment_temperature

    except ObjectDoesNotExist:
        environment_temperature = 20
    try:
        last_record_relative_humidity: Record = Record.objects.filter(patient_id=patient_id).filter(
            relative_humidity__isnull=False).latest('timestamp')
        relative_humidity = last_record_relative_humidity.relative_humidity
    except ObjectDoesNotExist:
        relative_humidity = 50
    try:
        last_record_air_pollution: Record = Record.objects.filter(patient_id=patient_id).filter(
            air_pollution__isnull=False).latest('timestamp')
        air_pollution = last_record_air_pollution.air_pollution
    except ObjectDoesNotExist:
        air_pollution = 0
    try:
        last_record_body_temperature: Record = Record.objects.filter(patient_id=patient_id).filter(
            body_temperature__isnull=False).latest('timestamp')
        body_temperature = last_record_body_temperature.body_temperature
    except ObjectDoesNotExist:
        body_temperature = 37
    try:
        last_record_systolic_blood_pressure: Record = Record.objects.filter(patient_id=patient_id).filter(
            systolic_blood_pressure__isnull=False).latest('timestamp')
        systolic_blood_pressure = last_record_systolic_blood_pressure.systolic_blood_pressure
    except ObjectDoesNotExist:
        systolic_blood_pressure = 12
    try:
        last_record_diastolic_blood_pressure: Record = Record.objects.filter(patient_id=patient_id).filter(
            diastolic_blood_pressure__isnull=False).latest('timestamp')
        diastolic_blood_pressure = last_record_diastolic_blood_pressure.diastolic_blood_pressure
    except ObjectDoesNotExist:
        diastolic_blood_pressure = 8
    try:
        last_record_heart_rate: Record = Record.objects.filter(patient_id=patient_id).filter(
            heart_rate__isnull=False).latest('timestamp')
        heart_rate = last_record_heart_rate.heart_rate
    except ObjectDoesNotExist:
        heart_rate = 60
    try:
        last_record_oxygen_saturation: Record = Record.objects.filter(patient_id=patient_id).filter(
            oxygen_saturation__isnull=False).latest('timestamp')
        oxygen_saturation = last_record_oxygen_saturation.oxygen_saturation
    except ObjectDoesNotExist:
        oxygen_saturation = 100
    try:
        last_record_ecg: Record = Record.objects.filter(patient_id=patient_id).filter(
            ecg__isnull=False).latest('timestamp')
        ecg = last_record_ecg.ecg
    except ObjectDoesNotExist:
        ecg = 0

    print(patient_id)
    serializer = serializers.RecordFullSerializer(Record.objects.filter(patient_id=patient_id).latest('timestamp'))

    # JSON data that is sent to the Frontend.
    data = {
        'patient': serializer.data['patient'],
        'environment_temperature': environment_temperature,
        'relative_humidity': relative_humidity,
        'air_pollution': air_pollution,
        'body_temperature': body_temperature,
        'systolic_blood_pressure': systolic_blood_pressure,
        'diastolic_blood_pressure': diastolic_blood_pressure,
        'heart_rate': heart_rate,
        'oxygen_saturation': oxygen_saturation,
        'ecg': ecg,
        'timestamp': serializer.data['timestamp'],
        'id': serializer.data['id']
    }
    print(serializer.data)
    return Response(data=data, status=status.HTTP_200_OK)


@swagger_auto_schema(method='get', manual_parameters=[day_param, hour_param, minute_param, second_param],
                     responses={200: latest_time_data_response})
@api_view(['GET'])
def get_latest_time_data(request):
    """
    @params:
        day: day from now
        hour: hour from now
        minute: minute from now
        second: second from now
    @return:
        latest time data based on the time parameters

    Get the latest data specified by query params. By default, it finds last 1-minute data.
    It finds data based on latest (by timestamp) entry and not by datatime.now().
    """
    if not Record.objects.all().exists():
        return Response(status=status.HTTP_404_NOT_FOUND)
    last_record: Record = Record.objects.latest('timestamp')
    days = request.GET.get('day', 0)
    minutes = request.GET.get('minute', 1)
    hours = request.GET.get('hour', 0)
    seconds = request.GET.get('second', 0)
    new_timestamp = last_record.timestamp - timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)
    print(new_timestamp)
    print(last_record.timestamp)
    last_time_records = Record.objects.filter(timestamp__gte=new_timestamp)
    print(last_time_records)
    serializer = serializers.RecordFullSerializer(last_time_records, many=True)
    return Response(data=serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(method='get', manual_parameters=[patient_param, from_param, to_param, sensors_param],
                     responses={200: filter_data_response})
@api_view(['GET'])
def get_by_filter(request):
    """
    @params:
    Available Filters:
    - Patient: Patient ID (Default: All)
    - From: From DateTime
    - To: To DateTime
    - Sensors: A comma separated list of sensors (Default: All sensors)
    @ returns: A list of records based of specified filters.
    """
    sensors = request.GET.get('sensors', None)
    if sensors:
        sensors = list(map(lambda s: s.strip(), sensors.split(',')))
    patient_id = request.GET.get('patient', None)
    from_time = request.GET.get('from', None)
    to_time = request.GET.get('to', None)

    queryset = Record.objects.all()
    if patient_id:
        queryset = queryset.filter(patient_id=patient_id)
    if from_time:
        queryset = queryset.filter(timestamp__gte=from_time)
    if to_time:
        queryset = queryset.filter(timestamp__lte=to_time)
    if not queryset.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)
    if sensors:
        serializer = serializers.RecordDefaultSerializer(queryset, many=True, fields=['id', 'timestamp'] + sensors)
    else:
        serializer = serializers.RecordDefaultSerializer(queryset, many=True)
    return Response(data=serializer.data, status=status.HTTP_200_OK)
