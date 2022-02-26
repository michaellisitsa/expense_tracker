from django.urls import path, include
from rest_framework import routers
from expensetracker.core import views

router = routers.DefaultRouter()
router.register(r"expenseTimePeriod", views.ExpenseTimePeriodViewSet)
router.register(r"expenseCategory", views.ExpenseCategoryViewSet)
router.register(r"expense", views.ExpenseViewSet)
router.register(r"multipleExpenses", views.MultipleExpenseViewSet)

app_name = "core"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("app/", views.app, name="app"),
    path("timeperiods/", views.time_period, name="timeperiods"),
    # https://www.pluralsight.com/guides/work-with-ajax-django
    path("createExpenses/<str:pk>", views.createExpenses, name="createExpenses"),
    path("api/", include(router.urls)),
]
