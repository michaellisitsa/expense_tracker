from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Avg, Count, Min, Sum

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.base import TemplateView
from .models import Expenses, ExpenseTimePeriod, ExpenseCategory
from .forms import ExpensesForm

# Create your views here.
class IndexView(TemplateView):
    template_name = "core/index.html"


# decorator login_required is a shortcut to checking request.user.is_authenticated == True and
# redirect to a login page or display an error rather than take you to the "app.html" page
@login_required
def app(request):
    expenses = Expenses.objects.all()
    income_sum = expenses.filter(cost__gt=0).aggregate(Sum("cost"))
    expenses_sum = expenses.filter(cost__lt=0).aggregate(Sum("cost"))
    net_sum = expenses.aggregate(Sum("cost"))
    if request.method == "POST":
        # Create a form instance and populate with data from the request
        form = ExpensesForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Expense submitted successfully.")
            return HttpResponseRedirect("/app/")
        else:
            messages.error(request, "Invalid form submission.")
    else:
        form = ExpensesForm()
    context = {
        "expenses": expenses,
        "income_sum": income_sum,
        "expenses_sum": expenses_sum,
        "form": form,
        "net_sum": net_sum,
    }
    return render(request, "core/app.html", context)

@login_required
def time_period (request):
    expensesTimePeriod = ExpenseTimePeriod.objects.all()
    context = {
        "expenses": expensesTimePeriod
    }
    return render(request, "core/timePeriod.html", context)