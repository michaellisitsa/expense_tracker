from django.forms import ModelForm, RadioSelect, DateInput, NumberInput, TextInput, Select, inlineformset_factory
from .models import ExpenseCategory, ExpenseTimePeriod, Expense

class CategoryForm(ModelForm):
    class Meta:
        model = ExpenseCategory
        fields = ["name", "assignee", "budget", "description"]
        # class customisation https://colinkingswood.github.io/Model-Form-Customisation/
        widgets = {"budget": TextInput(attrs={'type': 'number','min':0,'step':50})}
class ExpenseTimePeriodForm(ModelForm):

    # def __init__(self,*args,**kwargs):
    #     super().__init__(*args, **kwargs)
    #     self.fields['category'].queryset = ExpenseTimePeriod.objects.filter()
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

CreateExpenseSet = inlineformset_factory(ExpenseTimePeriod, Expense, fields=('description', 'cost','expenseTimePeriod'), extra=1)