from django.contrib import admin

# Register your models here.
from . models import ExpenseTimePeriod, Expense, ExpenseCategory

admin.site.register(ExpenseCategory)
admin.site.register(ExpenseTimePeriod)
admin.site.register(Expense)