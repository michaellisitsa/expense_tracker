from django.db import models
from expensetracker.users.models import User


class ExpenseCategory(models.Model):
    # Multi-tenancy model
    name = models.CharField(max_length=100)
    assignee = models.CharField(max_length=50)
    budget = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    description = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} by {self.assignee}"


# Expenses are grouped into time periods, related by a foreign key
class ExpenseTimePeriod(models.Model):
    description = models.CharField(max_length=100)
    dateStart = models.DateField("dateStart")
    dateEnd = models.DateField("dateEnd")
    category = models.ForeignKey(
        ExpenseCategory, on_delete=models.CASCADE, related_name="expenseTimePeriod"
    )

    def __str__(self):
        return f"{self.description} {self.dateStart} to {self.dateEnd}"


class Expense(models.Model):
    description = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits=8, decimal_places=2)
    expenseTimePeriod = models.ForeignKey(ExpenseTimePeriod, on_delete=models.CASCADE)
    date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.description} ${self.cost:.2f}"
