from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Patient(models.Model):
    class GENDER(models.TextChoices):
        WOMAN = 'W', _('Woman')
        MAN = 'M', _('Man')

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, null=True)
    email = models.EmailField(null=True)
    gender = models.CharField(max_length=4, choices=GENDER.choices, default=GENDER.WOMAN)
    height = models.DecimalField(max_digits=3, decimal_places=2)
    weight = models.DecimalField(max_digits=6, decimal_places=3)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{'Ms.' if self.gender == self.GENDER.WOMAN else 'Mr.'} {self.first_name} {self.last_name}"
        )
