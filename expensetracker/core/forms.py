from django.forms import ModelForm, RadioSelect
from .models import Expenses


class ExpensesForm(ModelForm):
    class Meta:
        model = Expenses
        fields = ["description", "cost", "category"]
        # class customisation https://colinkingswood.github.io/Model-Form-Customisation/
        widgets = {"category": RadioSelect()}
