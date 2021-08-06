from .models import ExpenseCategory, ExpenseTimePeriod, Expense
from rest_framework import serializers

class ExpenseTimePeriodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ExpenseTimePeriod
        fields = ['description','dateStart','dateEnd']