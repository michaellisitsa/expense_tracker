"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.urls import include, path, re_path
from django.contrib import admin
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from django.contrib.auth.decorators import login_required


urlpatterns = [
    path("", include("expensetracker.core.urls")),
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path(
        "reactapp/",
        login_required(never_cache(TemplateView.as_view(template_name="index.html"))),
    )
    # path('reactapp/',never_cache(TemplateView.as_view(template_name='index.html')))
]

if settings.DEBUG:
    import debug_toolbar
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
    urlpatterns += staticfiles_urlpatterns()
