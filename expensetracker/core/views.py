from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Avg, Count, Min, Sum
from django.urls import reverse
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.generic.base import TemplateView
from .models import ExpenseTimePeriod, ExpenseCategory, Expense
from .forms import CategoryForm, ExpenseTimePeriodForm, ExpenseForm
from .filters import ExpenseTimePeriodFilter

from django.core import serializers

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
def time_period (request, pk=None):
    """
        Create a time period.
    """
    if pk is None:
        timePeriodPerCategory = ExpenseTimePeriod.objects.all()
        expenseCategory = None
    else:
        timePeriodPerCategory = ExpenseTimePeriod.objects.filter(category__pk=pk)
        expenseCategory = ExpenseCategory.objects.get(id=pk)
    if request.method == "FAKE":
        # Create a form instance and populate with data from the request
        form = ExpenseTimePeriodForm(request.POST, prefix='add')
        if form.is_valid():
            # You can obtain the id of the record just created, and then pass it into the url inside HttpResponseRedirect
            # https://stackoverflow.com/questions/41700796/how-to-get-id-in-the-url-after-submission-of-form
            instance = form.save(commit = False)
            instance.user = ExpenseTimePeriod.objects.get(id=request.user.id)
            instance.save()            
            messages.success(request, "Expense Time Period submitted successfully.")
            # When using HttpResponseRedirect, remove action from form template
            # https://stackoverflow.com/a/60816124/12462631
            # You can use kwargs to pass into the url string. Refer example from
            # https://docs.djangoproject.com/en/3.2/ref/urlresolvers/
            # >>> reverse('admin:app_list', kwargs={'app_label': 'auth'})
            # '/admin/auth/'
            return HttpResponseRedirect(reverse('core:createExpensesSelected',kwargs={'pk': instance.id}))
        else:
            messages.error(request, "Invalid form submission.")
    else:
        form = ExpenseTimePeriodForm(initial={'category':expenseCategory}, prefix='add')
    
    #Re-instantiate that variable with the filtered query set using Django-filter
    myFilter = ExpenseTimePeriodFilter(request.GET, queryset=timePeriodPerCategory)
    timePeriodPerCategory = myFilter.qs

    context = {
        "expenses": timePeriodPerCategory,
        "form": form,
        "expenseCategory": expenseCategory,
        'myFilter': myFilter,
    }
    return render(request, "core/timePeriod.html", context)


def AjaxExpensePeriod(request):
    """
        First attempt at an ajax request.
        https://www.pluralsight.com/guides/work-with-ajax-django
    """
    # request should be ajax and method POST
    if request.method == "POST":
        # get the form data
        form = ExpenseTimePeriodForm(request.POST, prefix='ajax')
        if form.is_valid():
            instance = form.save()
            # serialize in new friend object in json
            ser_instance = serializers.serialize('json', [ instance, ])
            # send to client side.
            return JsonResponse({"instance": ser_instance}, status=200)
        else:
            #Some form error occurs
            return JsonResponse({
                "error": form.errors
            }, status=400)
    # some error occured
    return JsonResponse({"error": ""}, status=400)

@login_required
def createExpenses(request, pk=None):
    """
        Create an expense entry under a time period
    """
    if pk is None:
        expensesPerCategory = Expense.objects.all()
        expenseTimePeriod = None
    else:
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
        "expenseTimePeriod": expenseTimePeriod,
    }
    return render(request, "core/createExpenses.html", context)
