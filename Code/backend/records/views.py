import datetime
from datetime import timedelta

from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from records import serializers
from records.models import Record
from records.openapi import day_param, hour_param, minute_param, second_param, latest_data_response, \
    latest_time_data_response, patient_param, to_param, from_param, sensors_param, filter_data_response


class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RecordDefaultSerializer
    queryset = Record.objects.all()


class RecordFullViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RecordFullSerializer
    queryset = Record.objects.all()
    http_method_names = ['get']


@swagger_auto_schema(method='get', responses={200: latest_data_response})
@api_view(['GET'])
def get_latest_data(request):
    serializer = serializers.RecordFullSerializer(Record.objects.latest('timestamp'))
    return Response(data=serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(method='get', manual_parameters=[day_param, hour_param, minute_param, second_param],
                     responses={200: latest_time_data_response})
@api_view(['GET'])
def get_latest_time_data(request):
    """
    Get the latest data specified by query params. By default, it finds last 1-minute data.
    It finds data based on latest (by timestamp) entry and not by datatime.now().
    """
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
    Available Filters:
    - Patient: Patient ID (Default: All)
    - From: From DateTime
    - To: To DateTime
    - Sensors: A comma separated list of sensors (Default: All sensors)
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
    if sensors:
        serializer = serializers.RecordDefaultSerializer(queryset, many=True, fields=['id', 'timestamp'] + sensors)
    else:
        serializer = serializers.RecordDefaultSerializer(queryset, many=True)
    return Response(data=serializer.data, status=status.HTTP_200_OK)
