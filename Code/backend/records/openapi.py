from drf_yasg import openapi

from records.serializers import RecordFullSerializer, RecordDefaultSerializer

day_param = openapi.Parameter('day', openapi.IN_QUERY, description="", type=openapi.TYPE_INTEGER)
hour_param = openapi.Parameter('hour', openapi.IN_QUERY, description="", type=openapi.TYPE_INTEGER)
minute_param = openapi.Parameter('minute', openapi.IN_QUERY, description="", type=openapi.TYPE_INTEGER)
second_param = openapi.Parameter('second', openapi.IN_QUERY, description="", type=openapi.TYPE_INTEGER)
latest_data_response = openapi.Response('response description', RecordFullSerializer)
latest_time_data_response = openapi.Response('response description', RecordFullSerializer(many=True))

patient_param = openapi.Parameter('patient', openapi.IN_QUERY, description="Patient ID", type=openapi.TYPE_INTEGER)
from_param = openapi.Parameter('from', openapi.IN_QUERY, description="", type=openapi.FORMAT_DATETIME)
to_param = openapi.Parameter('to', openapi.IN_QUERY, description="", type=openapi.FORMAT_DATETIME)
sensors_param = openapi.Parameter('sensors', openapi.IN_QUERY, description="Comma-separated list of sensors",
                                  type=openapi.TYPE_STRING)
filter_data_response = openapi.Response('response description', RecordDefaultSerializer(many=True))
