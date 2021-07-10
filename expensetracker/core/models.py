from django.db import models

CATEGORY_CHOICES = [
    ("ELEC_GAS", "Electricity/Gas"),
    ("MOBILE", "Mobile"),
    ("INTERNET", "Internet"),
    ("WATER", "Water"),
    ("GROCERIES", "Groceries"),
    ("INSUR_HEALTH", "Health Insurance"),
]

# Create your models here.
class Expenses(models.Model):
    description = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)

    def __str__(self):
        return f"{self.description} ${self.cost:.2f}"
