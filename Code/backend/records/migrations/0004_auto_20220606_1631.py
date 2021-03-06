# Generated by Django 3.2.12 on 2022-06-06 12:01

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0003_auto_20220606_1630'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='air_pollution',
            field=models.DecimalField(blank=True, decimal_places=1, default=None, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='body_temperature',
            field=models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=4, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='diastolic_blood_pressure',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='ecg',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='environment_temperature',
            field=models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=4, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='heart_rate',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='oxygen_saturation',
            field=models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='record',
            name='relative_humidity',
            field=models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='record',
            name='systolic_blood_pressure',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
