from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.base import TemplateView
from .models import Expenses

# Create your views here.
class IndexView(TemplateView):
    template_name = "core/index.html"


# decorator login_required is a shortcut to checking request.user.is_authenticated == True and
# redirect to a login page or display an error rather than take you to the "app.html" page
@login_required
def app(request):
    filtered_description = Expenses.objects.filter(id=1)
    context = {"filtered_description": filtered_description}
    return render(request, "core/app.html", context)
