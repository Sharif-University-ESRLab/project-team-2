# Generated by Django 3.2.12 on 2022-04-02 22:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patient',
            old_name='weight',
            new_name='mass',
        ),
    ]