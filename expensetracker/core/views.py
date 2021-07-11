from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.base import TemplateView
from .models import Expenses
from .forms import ExpensesForm

# Create your views here.
class IndexView(TemplateView):
    template_name = "core/index.html"


# decorator login_required is a shortcut to checking request.user.is_authenticated == True and
# redirect to a login page or display an error rather than take you to the "app.html" page
@login_required
def app(request):
    filtered_description = Expenses.objects.filter(id=1)
    if request.method == "POST":
        # Create a form instance and populate with data from the request
        form = ExpensesForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect("/submitted/")
    else:
        form = ExpensesForm()
    context = {"filtered_description": filtered_description, "form": form}
    return render(request, "core/app.html", context)
