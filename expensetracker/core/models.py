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

class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100)
    assignee = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    groupTransactions = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} by {self.assignee}"
    
# Expenses are grouped into time periods, related by a foreign key
class ExpenseTimePeriod(models.Model):
    description = models.CharField(max_length=100)
    dateStart = models.DateField('dateStart')
    dateEnd = models.DateField('dateEnd')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.description} {self.dateStart} to {self.dateEnd}"

class Expense(models.Model):
    description = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits=8, decimal_places=2)
    expenseTimePeiod = models.ForeignKey(ExpenseTimePeriod, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.description} ${self.cost:.2f}"