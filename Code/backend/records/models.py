from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from patients.models import Patient


# Define the Record model
class Record(models.Model):
    # Environment
    environment_temperature = models.DecimalField(max_digits=4, decimal_places=2, null=True, default=None,
                                                  blank=True)  # °C
    relative_humidity = models.DecimalField(max_digits=5, decimal_places=2,
                                            validators=[MaxValueValidator(100), MinValueValidator(0)],
                                            null=True, default=None, blank=True)  # Percentage

    air_pollution = models.DecimalField(max_digits=10, decimal_places=1, null=True, default=None, blank=True)

    # Human
    body_temperature = models.DecimalField(max_digits=4, decimal_places=2, null=True, default=None, blank=True)  # °C
    systolic_blood_pressure = models.IntegerField(null=True, default=None, blank=True)  # mmHg
    diastolic_blood_pressure = models.IntegerField(null=True, default=None, blank=True)  # mmHg
    oxygen_saturation = models.DecimalField(max_digits=5, decimal_places=2,
                                            validators=[MaxValueValidator(100), MinValueValidator(0)],
                                            null=True, default=None, blank=True)  # Percentage
    heart_rate = models.IntegerField(null=True, default=None, blank=True)  # BPM

    ecg = models.FloatField(null=True, default=None, blank=True)

    # other data
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
