from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('attendance/clock_in_out/', views.clock_in_out, name='clock_in_out'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
