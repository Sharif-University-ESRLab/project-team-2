from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from patients.models import Patient


# Create your models here.


class Record(models.Model):
    # TODO Maybe in the future, we should make two different records for environment and human records

    # Environment
    environment_temperature = models.DecimalField(max_digits=4, decimal_places=2, null=True)  # °C
    relative_humidity = models.DecimalField(max_digits=5, decimal_places=2,
                                            validators=[MaxValueValidator(100), MinValueValidator(0)],
                                            null=True)  # Percentage
    # TODO May need some changes based on the value we get from sensor
    air_pollution = models.DecimalField(max_digits=10, decimal_places=1, null=True)

    # Human
    body_temperature = models.DecimalField(max_digits=4, decimal_places=2, null=True)  # °C
    systolic_blood_pressure = models.IntegerField(null=True)  # mmHg
    diastolic_blood_pressure = models.IntegerField(null=True)  # mmHg
    oxygen_saturation = models.DecimalField(max_digits=5, decimal_places=2,
                                            validators=[MaxValueValidator(100), MinValueValidator(0)],
                                            null=True)  # Percentage
    heart_rate = models.IntegerField(null=True)  # BPM

    # TODO I don't now how the output of ECG sensor will be. May need change.
    ecg = models.FloatField(null=True)

    # other data
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now())
