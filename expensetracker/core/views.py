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
from .serializers import (
    ExpenseTimePeriodSerializer,
    ExpenseCategorySerializer,
    ExpenseSerializer,
    MultipleExpenseSerializer,
)
from .utils.utils import summariseTimePeriod
from django.core import serializers

from rest_framework import viewsets, permissions, authentication, status, mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
class IndexView(TemplateView):
    template_name = "core/index.html"


# NOT USED FOR REACT APP
# decorator login_required is a shortcut to checking request.user.is_authenticated == True and
# redirect to a login page or display an error rather than take you to the "app.html" page
@login_required
def app(request):
    category = ExpenseCategory.objects.filter(user=request.user)
    timePeriod = ExpenseTimePeriod.objects.filter(category__user=request.user)
    expenses = Expense.objects.filter(expenseTimePeriod__category__user=request.user)
    if request.method == "POST":
        # Create a form instance and populate with data from the request
        form = CategoryForm(request.POST)
        if form.is_valid():
            event = form.save(commit=False)
            event.user = request.user
            event.save()
            messages.success(request, "Category created successfully.")
            return HttpResponseRedirect(reverse("core:app"))
        else:
            messages.error(request, "Invalid form submission.")
    else:
        form = CategoryForm()
    expenses_wk, coverage_wk = summariseTimePeriod(timePeriod, expenses, 7)
    expenses_mth, coverage_mth = summariseTimePeriod(timePeriod, expenses, 30)
    expenses_yr, coverage_yr = summariseTimePeriod(timePeriod, expenses, 365)

    context = {
        "expenses_wk": expenses_wk,
        "coverage_wk": coverage_wk,
        "expenses_mth": expenses_mth,
        "coverage_mth": coverage_mth,
        "expenses_yr": expenses_yr,
        "coverage_yr": coverage_yr,
        "category": category,
        "form": form,
    }
    return render(request, "core/app.html", context)


# NOT USED FOR REACT APP
@login_required
def time_period(request):
    """
    Create a time period.
    """
    if request.GET.get("category", "") == "":
        timePeriodPerCategory = ExpenseTimePeriod.objects.filter(
            category__user=request.user
        )
        expenseCategory = None
    else:
        timePeriodPerCategory = ExpenseTimePeriod.objects.filter(
            category__user=request.user
        )
        expenseCategory = ExpenseCategory.objects.filter(user=request.user).get(
            id=request.GET.get("category")
        )
    if request.method == "POST":
        # Create a form instance and populate with data from the request
        form = ExpenseTimePeriodForm(request.POST, prefix="add")
        if form.is_valid():
            # You can obtain the id of the record just created, and then pass it into the url inside HttpResponseRedirect
            # https://stackoverflow.com/questions/41700796/how-to-get-id-in-the-url-after-submission-of-form
            instance = form.save(commit=False)
            # instance.user = ExpenseTimePeriod.objects.get(id=request.user.id)
            instance.save()
            messages.success(request, "Expense Time Period submitted successfully.")
            # When using HttpResponseRedirect, remove action from form template
            # https://stackoverflow.com/a/60816124/12462631
            # You can use kwargs to pass into the url string. Refer example from
            # https://docs.djangoproject.com/en/3.2/ref/urlresolvers/
            # >>> reverse('admin:app_list', kwargs={'app_label': 'auth'})
            # '/admin/auth/'
            return HttpResponseRedirect(
                reverse("core:createExpenses", kwargs={"pk": instance.id})
            )
        else:
            messages.error(request, "Invalid form submission.")
    else:
        form = ExpenseTimePeriodForm(
            initial={"category": expenseCategory}, prefix="add"
        )
    # Re-instantiate that variable with the filtered query set using Django-filter
    # After lots of pain, finally found a post that the request needs to be passed in here
    # https://stackoverflow.com/a/58055651/12462631
    myFilter = ExpenseTimePeriodFilter(
        data=request.GET, request=request, queryset=timePeriodPerCategory
    )
    # myFilter.category.queryset = ExpenseTimePeriod.objects.filter(category__user=request.user)
    timePeriodPerCategory = myFilter.qs
    expenses = Expense.objects.filter(expenseTimePeriod__category__user=request.user)
    expenses_wk, coverage_wk = summariseTimePeriod(timePeriodPerCategory, expenses, 7)
    expenses_mth, coverage_mth = summariseTimePeriod(
        timePeriodPerCategory, expenses, 30
    )
    expenses_yr, coverage_yr = summariseTimePeriod(timePeriodPerCategory, expenses, 365)

    context = {
        "expenses_wk": expenses_wk,
        "coverage_wk": coverage_wk,
        "expenses_mth": expenses_mth,
        "coverage_mth": coverage_mth,
        "expenses_yr": expenses_yr,
        "coverage_yr": coverage_yr,
        "expenses": timePeriodPerCategory,
        "form": form,
        "expenseCategory": expenseCategory,
        "myFilter": myFilter,
    }
    return render(request, "core/timePeriod.html", context)


# NOT USED FOR REACT APP
def AjaxExpensePeriod(request):
    """
    First attempt at an ajax request.
    https://www.pluralsight.com/guides/work-with-ajax-django
    """
    # request should be ajax and method POST
    if request.method == "POST":
        # get the form data
        form = ExpenseTimePeriodForm(request.POST, prefix="ajax")
        if form.is_valid():
            instance = form.save()
            # serialize in new friend object in json
            ser_instance = serializers.serialize(
                "json",
                [
                    instance,
                ],
            )
            # send to client side.
            return JsonResponse({"instance": ser_instance}, status=200)
        else:
            # Some form error occurs
            return JsonResponse({"error": form.errors}, status=400)
    # some error occured
    return JsonResponse({"error": ""}, status=400)


# NOT USED FOR REACT APP
@login_required
def createExpenses(request, pk):
    """
    Create an expense entry under a time period
    """
    expenseTimePeriodList = ExpenseTimePeriod.objects.filter(
        category__user=request.user
    )
    expenseTimePeriod = ExpenseTimePeriod.objects.filter(
        category__user=request.user
    ).get(id=pk)
    expenseCategory = expenseTimePeriod.category
    if request.method == "POST":
        if "formset" in request.POST:
            formset = CreateExpenseSet(data=request.POST, instance=expenseTimePeriod)
            # Check if submitted forms are valid
            if formset.is_valid():
                formset.save()
                messages.success(request, "Expense submitted successfully.")
                return HttpResponseRedirect(
                    f"{reverse('core:timeperiods')}?category={expenseTimePeriod.category.id}"
                )
            else:
                messages.error(request, "Invalid Form Submission")
    else:
        # Use of formsets
        # https://www.brennantymrak.com/articles/django-dynamic-formsets-javascript.html
        formset = CreateExpenseSet(instance=expenseTimePeriod)
    expenses = Expense.objects.filter(expenseTimePeriod__category__user=request.user)
    expenses_wk, coverage_wk = summariseTimePeriod(expenseTimePeriodList, expenses, 7)
    expenses_mth, coverage_mth = summariseTimePeriod(
        expenseTimePeriodList, expenses, 30
    )
    expenses_yr, coverage_yr = summariseTimePeriod(expenseTimePeriodList, expenses, 365)
    context = {
        "expenses_wk": expenses_wk,
        "coverage_wk": coverage_wk,
        "expenses_mth": expenses_mth,
        "coverage_mth": coverage_mth,
        "expenses_yr": expenses_yr,
        "coverage_yr": coverage_yr,
        "expenseCategory": expenseCategory,
        "expenseTimePeriod": expenseTimePeriod,
        "formset": formset,
    }
    return render(request, "core/createExpenses.html", context)


# class MultipleExpenseViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows Expenses to be viewed or editted.
#     """

#     queryset = Expense.objects.all()  # gets filtered in get_queryset
#     serializer_class = MultipleExpenseSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         req = self.request
#         if req:
#             self.queryset = Expense.objects.filter(
#                 expenseTimePeriod__category__user=req.user
#             )
#             print("request accessed")
#             return self.queryset
#         else:
#             print("request not accessed")
#             return self.queryset


class MultipleExpenseViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Expense.objects.all()
    serializer_class = MultipleExpenseSerializer

    def create(self, request, *args, **kwargs):
        self.user = request.user
        listOfThings = request.data["expenses"]

        serializer = self.get_serializer(data=listOfThings, many=True)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Expenses to be viewed or editted.
    """

    queryset = Expense.objects.all()  # gets filtered in get_queryset
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        req = self.request
        if req:
            self.queryset = Expense.objects.filter(
                expenseTimePeriod__category__user=req.user
            )
            print("request accessed")
            return self.queryset
        else:
            print("request not accessed")
            return self.queryset


# @api_view(['POST'])
# def ImportExpenses(request):
#     serialized = ExpenseTimePeriodSerializer(data=request.data, many=True)
#     if serialized.is_valid():
#         serialized.save()
#         return Response(serialized.data, status=status.HTTP_201_CREATED)
#     return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseTimePeriodViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Expense Time Periods to be viewed or editted.
    """

    # queryset = ExpenseTimePeriod.objects.filter(category__user=request.user)
    queryset = ExpenseTimePeriod.objects.all()  # gets filtered in get_queryset
    serializer_class = ExpenseTimePeriodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        req = self.request
        category = self.request.query_params.get("category")
        if req:
            self.queryset = ExpenseTimePeriod.objects.filter(category__user=req.user)
            print("request accessed")
            if category:
                self.queryset = self.queryset.filter(category=category)
            return self.queryset
        else:
            print("request not accessed")
            return self.queryset


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Expense Time Periods to be viewed or editted.
    """

    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        req = self.request
        if req:
            self.queryset = ExpenseCategory.objects.filter(user=req.user)
            print("request accessed")
            return self.queryset
        else:
            print("request not accessed")
            return self.queryset
