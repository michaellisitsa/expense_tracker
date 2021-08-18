from django.forms.fields import ChoiceField
import django_filters
from django_filters import DateFilter, CharFilter, ModelChoiceFilter
from django.forms import ModelForm, RadioSelect, DateInput, Select, CheckboxInput

from .models import *

def categoryFilter(request):
    if request is None:
        return ExpenseCategory.objects.none()

    # user = request.user
    return ExpenseCategory.objects.filter(user=request.user)
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

    # def __init__(self, user, *args, **kwargs):
    #     super(ExpenseTimePeriodFilter, self).__init__(*args, **kwargs)
    #     self.category.queryset = ExpenseCategory.objects.filter(user=user)
    # @property
    # def qs(self):
    #     queryset=super(ExpenseTimePeriodFilter, self).qs
    #     if request.user.has_perm("app_label.has_permission"):       
    #         return queryset.exclude(invited_user!=self.request.user)
    #     return queryset      