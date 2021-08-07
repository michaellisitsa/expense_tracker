from .models import ExpenseCategory, ExpenseTimePeriod, Expense
from rest_framework import serializers

# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = 
#         fields = ['description','dateStart','dateEnd']

class ExpenseTimePeriodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ExpenseTimePeriod
        fields = ['description','dateStart','dateEnd']