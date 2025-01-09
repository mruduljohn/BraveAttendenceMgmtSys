from django.urls import path
from . import views
from .views import AddUserView

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('add_user/', AddUserView.as_view(), name='add_user'),
]
