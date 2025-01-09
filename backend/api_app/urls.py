from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .views import AddUserView
from .views import FetchAttendanceView
from .views import CreateLeaveRequestView
from .views import FetchLeaveRequestsView
from .views import UpdateUserDetailsView

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('attendance/clock_in_out/', views.clock_in_out, name='clock_in_out'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('add_user/', AddUserView.as_view(), name='add_user'),
    path('fetch_attendance/<int:employee_id>/', FetchAttendanceView.as_view(), name='fetch_attendance'),
    path('create_leave_requests/', CreateLeaveRequestView.as_view(), name='create_leave_requests'),
    path('fetch_leave_requests/', FetchLeaveRequestsView.as_view(), name='fetch_leave_requests'),
    path('update_user_details/', UpdateUserDetailsView.as_view(), name='update_user_details'),
]
