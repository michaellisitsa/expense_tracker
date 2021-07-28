from django.forms import ModelForm, RadioSelect, DateInput
from .models import Expenses, ExpenseTimePeriod


class ExpensesForm(ModelForm):
    class Meta:
        model = Expenses
        fields = ["description", "cost", "category"]
        # class customisation https://colinkingswood.github.io/Model-Form-Customisation/
        widgets = {"category": RadioSelect()}

class ExpenseTimePeriodForm(ModelForm):
    class Meta:
        model = ExpenseTimePeriod
        fields = ["description", "dateStart","dateEnd","category"]
        widgets = {"category": RadioSelect(),
                'dateStart': DateInput(format=('%d/%m/%Y'), attrs={'class':'form-control', 'placeholder':'Select a date', 'type':'date'}),
                'dateEnd': DateInput(format=('%d/%m/%Y'), attrs={'class':'form-control', 'placeholder':'Select a date', 'type':'date'}),
}