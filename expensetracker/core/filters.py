from django.forms.fields import ChoiceField
import django_filters
from django_filters import DateFilter, CharFilter, ModelChoiceFilter
from django.forms import ModelForm, RadioSelect, DateInput, Select, CheckboxInput

from .models import *

class ExpenseTimePeriodFilter(django_filters.FilterSet):
    # Link describing how to set up filters, including the lte gte etc. styles
    # https://youtu.be/G-Rct7Na0UQ?t=809
    category = ModelChoiceFilter(queryset=ExpenseCategory.objects.all(),widget=RadioSelect(attrs={'id':'categoryField','class':'categoryFilter'}))
    # startAfter = DateFilter(field_name='dateStart', lookup_expr='gte',widget=DateInput(format=('%d/%m/%Y'), attrs={'class':'form-control', 'placeholder':'Select a date', 'type':'date'}))
    # startBefore = DateFilter(field_name='dateStart', lookup_expr='lte',widget=DateInput(format=('%d/%m/%Y'), attrs={'class':'form-control', 'placeholder':'Select a date', 'type':'date'}))
    # note = CharFilter(field_name='description',lookup_expr='icontains')
    class Meta:
        model = ExpenseTimePeriod
        fields = ['category']