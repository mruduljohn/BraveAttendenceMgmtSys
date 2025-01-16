from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView
from .views import AddUserView
from .views import FetchAttendanceView
from .views import FetchLeaveRequestsView
from .views import UpdateUserDetailsView
from .views import DeleteUserView
from .views import TokenValidityCheckView

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('attendance/clock_in_out/', views.clock_in_out, name='clock_in_out'),
     path('attendance/status/', views.check_attendance_status, name='attendance-status'),
    path('token/validity-check/', TokenValidityCheckView.as_view(), name='token_validity_check'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('add_user/', AddUserView.as_view(), name='add_user'),
    path('fetch_attendance/', FetchAttendanceView.as_view(), name='fetch_attendance'),
    path('create_leave_requests/', views.create_leave_request, name='create_leave_requests'),
    path('fetch_leave_requests/', FetchLeaveRequestsView.as_view(), name='fetch_leave_requests'),
    path('update_user_details/', UpdateUserDetailsView.as_view(), name='update_user_details'),
    path('edit_user/', views.EditUserView.as_view(), name='edit_user'),
    path('user_list/', views.UserListView.as_view(), name='user_list'),
    path('delete_user/', DeleteUserView.as_view(), name='delete_user'),
    path('fetch_all_leave_requests/', views.FetchAllLeaveRequestsView.as_view(), name='fetch_all_leave_requests'),
    path('fetch_all_attendance_records/', views.FetchAllAttendanceRecordsView.as_view(), name='fetch_all_attendance_records'),
    path('accept_reject_leave_request/', views.AcceptRejectLeaveRequestView.as_view(), name='accept_reject_leave_request'),
    path('generate_reports/<int:month>/', views.generate_report, name='generate_reports')

]
