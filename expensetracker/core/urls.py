from django.urls import path, include
from rest_framework import routers
from expensetracker.core import views

router = routers.DefaultRouter()
router.register(r'expenseTimePeriod', views.ExpenseTimePeriodViewSet)
router.register(r'expenseCategory', views.ExpenseCategoryViewSet)


app_name = "core"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("app/", views.app, name="app"),
    path("timeperiods/", views.time_period, name="timeperiods"),
    path("timeperiods/<str:pk>", views.time_period, name="timeperiodsSelected"),
    # https://www.pluralsight.com/guides/work-with-ajax-django
    path("post/ajax/createExpense", views.AjaxExpensePeriod, name = "ajaxExpensePeriod"),
    path("createExpenses/", views.createExpenses, name="createExpenses"),
    path("createExpenses/<str:pk>", views.createExpenses, name="createExpensesSelected"),
    path('api/',include(router.urls)),
]
