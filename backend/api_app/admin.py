from django.contrib import admin
from .models import users, attendance, leave_requests


@admin.register(users)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'role', 'position', 'department', 'joined_date']
    list_filter = ['role', 'department']


@admin.register(attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'status', 'total_hours']
    list_filter = ['status', 'date']

@admin.register(leave_requests)
class LeaveRequestsAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'leave_type']
