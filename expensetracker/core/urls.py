from django.urls import path

from expensetracker.core import views

app_name = "core"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("app/", views.app, name="app"),
    path("timeperiods/", views.time_period, name="timeperiods")
]
