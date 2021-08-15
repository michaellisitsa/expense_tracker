from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Avg, Count, Min, Sum
from django.urls import reverse
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.generic.base import TemplateView
from .models import ExpenseTimePeriod, ExpenseCategory, Expense
from .forms import CategoryForm, ExpenseTimePeriodForm, ExpenseForm, CreateExpenseSet
from .filters import ExpenseTimePeriodFilter
from .serializers import ExpenseTimePeriodSerializer, ExpenseCategorySerializer

from django.core import serializers

from rest_framework import viewsets, permissions, authentication, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
        timePeriodPerCategory = ExpenseTimePeriod.objects.all()
        expenseCategory = ExpenseCategory.objects.get(id=pk)
    if request.method == "POST":
        # Create a form instance and populate with data from the request
        form = ExpenseTimePeriodForm(request.POST, prefix='add')
        if form.is_valid():
            # You can obtain the id of the record just created, and then pass it into the url inside HttpResponseRedirect
            # https://stackoverflow.com/questions/41700796/how-to-get-id-in-the-url-after-submission-of-form
            instance = form.save(commit = False)
            # instance.user = ExpenseTimePeriod.objects.get(id=request.user.id)
            instance.save()
            messages.success(request, "Expense Time Period submitted successfully.")
            # When using HttpResponseRedirect, remove action from form template
            # https://stackoverflow.com/a/60816124/12462631
            # You can use kwargs to pass into the url string. Refer example from
            # https://docs.djangoproject.com/en/3.2/ref/urlresolvers/
            # >>> reverse('admin:app_list', kwargs={'app_label': 'auth'})
            # '/admin/auth/'
            return HttpResponseRedirect(reverse('core:createExpenses',kwargs={'pk': instance.id}))
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

# Not used
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
        if "formset" in request.POST:
            formset = CreateExpenseSet(data=request.POST, instance=expenseTimePeriod)
            form = ExpenseForm(initial={'expenseTimePeriod':expenseTimePeriod})
            #Check if submitted forms are valid
            if formset.is_valid():
                formset.save()
                messages.success(request, "Expense submitted successfully.")
                return HttpResponseRedirect(reverse('core:timeperiods'))
            else:
                messages.error(request, "Invalid Form Submission") 
    else:
        # Use id to fill in the initial value of the foreign key
        # https://youtu.be/MRWFg30FmZQ?t=128
        form = ExpenseForm(initial={'expenseTimePeriod':expenseTimePeriod})
        # Use of formsets
        # https://www.brennantymrak.com/articles/django-dynamic-formsets-javascript.html
        formset = CreateExpenseSet(instance=expenseTimePeriod)

    context = {
        "expenses": expensesPerCategory,
        "expenseTimePeriod": expenseTimePeriod,
        "formset":formset,
    }
    return render(request, "core/createExpenses.html", context)

class ExpenseTimePeriodViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Expense Time Periods to be viewed or editted.
    """
    queryset = ExpenseTimePeriod.objects.all()
    serializer_class = ExpenseTimePeriodSerializer
    permission_classes = [permissions.IsAuthenticated]

class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Expense Time Periods to be viewed or editted.
    """
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


