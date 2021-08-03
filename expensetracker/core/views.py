from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Avg, Count, Min, Sum
from django.urls import reverse
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.base import TemplateView
from .models import ExpenseTimePeriod, ExpenseCategory, Expense
from .forms import CategoryForm, ExpenseTimePeriodForm, ExpenseForm
from .filters import ExpenseTimePeriodFilter

# Create your views here.
class IndexView(TemplateView):
    template_name = "core/index.html"


# decorator login_required is a shortcut to checking request.user.is_authenticated == True and
# redirect to a login page or display an error rather than take you to the "app.html" page
@login_required
def app(request):
    category = ExpenseCategory.objects.all()
    if request.method == "POST":
        # Create a form instance and populate with data from the request
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Category created successfully.")
            return HttpResponseRedirect(reverse('core:app'))
        else:
            messages.error(request, "Invalid form submission.")
    else:
        form = CategoryForm()
    context = {
        "category": category,
        "form": form,
    }
    return render(request, "core/app.html", context)

@login_required
def time_period (request, pk=1):
    """
        Create a time period.
    """
    timePeriodPerCategory = ExpenseTimePeriod.objects.filter(category__pk=pk)
    expenseCategory = ExpenseCategory.objects.get(id=pk)
    # if request.method == "POST":
    #     # Create a form instance and populate with data from the request
    #     form = ExpenseTimePeriodForm(request.POST)
    #     if form.is_valid():
    #         # You can obtain the id of the record just created, and then pass it into the url inside HttpResponseRedirect
    #         # https://stackoverflow.com/questions/41700796/how-to-get-id-in-the-url-after-submission-of-form
    #         instance = form.save(commit = False)
    #         instance.user = ExpenseTimePeriod.objects.get(id=request.user.id)
    #         instance.save()            
    #         messages.success(request, "Expense Time Period submitted successfully.")
    #         # When using HttpResponseRedirect, remove action from form template
    #         # https://stackoverflow.com/a/60816124/12462631
    #         # You can use kwargs to pass into the url string. Refer example from
    #         # https://docs.djangoproject.com/en/3.2/ref/urlresolvers/
    #         # >>> reverse('admin:app_list', kwargs={'app_label': 'auth'})
    #         # '/admin/auth/'
    #         return HttpResponseRedirect(reverse('core:createExpensesSelected',kwargs={'pk': instance.id}))
    #     else:
    #         messages.error(request, "Invalid form submission.")
    # else:
    #     form = ExpenseTimePeriodForm(initial={'category':expenseCategory})
    
    #Re-instantiate that variable with the filtered query set using Django-filter
    myFilter = ExpenseTimePeriodFilter(request.GET, queryset=timePeriodPerCategory)
    timePeriodPerCategory = myFilter.qs

    context = {
        "expenses": timePeriodPerCategory,
        # "form": form,
        "expenseCategory": expenseCategory,
        'myFilter': myFilter,
    }
    return render(request, "core/timePeriod.html", context)

@login_required
def createExpenses(request, pk=1):
    """
        Create an expense entry under a time period
    """
    expensesPerCategory = Expense.objects.filter(expenseTimePeriod__pk=pk)
    expenseTimePeriod = ExpenseTimePeriod.objects.get(id=pk)
    if request.method == "POST":
        form = ExpenseForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Expense submitted successfully.")
            return HttpResponseRedirect("/createExpenses/")
        else:
            messages.error(request, "Invalid Form Submission")
    else:
    # Use id to fill in the initial value of the foreign key
    # https://youtu.be/MRWFg30FmZQ?t=128
        form = ExpenseForm(initial={'expenseTimePeriod':expenseTimePeriod})
    context = {
        "form": form,
        "expenses": expensesPerCategory,
        "expenses_time_period": expenseTimePeriod,
    }
    return render(request, "core/createExpenses.html", context)