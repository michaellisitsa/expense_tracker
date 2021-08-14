from django.forms import ModelForm, RadioSelect, DateInput, Select, inlineformset_factory
from .models import ExpenseCategory, ExpenseTimePeriod, Expense

class CategoryForm(ModelForm):
    class Meta:
        model = ExpenseCategory
        fields = ["name", "assignee", "description","groupTransactions"]
        # class customisation https://colinkingswood.github.io/Model-Form-Customisation/
class ExpenseTimePeriodForm(ModelForm):
    class Meta:
        model = ExpenseTimePeriod
        fields = ["description", "dateStart","dateEnd","category"]
        widgets = {"category": RadioSelect(),
                'dateStart': DateInput(format=('%d/%m/%Y'), attrs={'class':'form-control', 'placeholder':'Select a date', 'type':'date'}),
                'dateEnd': DateInput(format=('%d/%m/%Y'), attrs={'class':'form-control', 'placeholder':'Select a date', 'type':'date'}),
}
class ExpenseForm(ModelForm):
    class Meta:
        model = Expense
        fields = ["description", "cost", "expenseTimePeriod"]
        widgets = {"category": Select()}

CreateExpenseSet = inlineformset_factory(ExpenseTimePeriod, Expense, fields=('description', 'cost','expenseTimePeriod'), extra=0)