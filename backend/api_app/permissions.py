from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied  
from rest_framework import status

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.user.role != 'Admin':
            raise PermissionDenied("Access denied: Admin role is required.")
        return request.user.role == 'Admin'

class IsManager(BasePermission):
    def has_permission(self, request, view):
        if request.user.role != 'Manager':
            raise PermissionDenied("Access denied: Manager role is required.")
        return request.user.role == 'Manager'

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        if request.user.role != 'Employee':
            raise PermissionDenied("Access denied: Employee role is required.")
        return request.user.role == 'Employee'

class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        if request.user.role not in ['Admin', 'Manager']:
            raise PermissionDenied("Access denied: Admin or Manager role is required.")
        return request.user.role in ['Admin', 'Manager']
class IsManagerorEmployee(BasePermission):
    def has_permission(self, request, view):
        if request.user.role not in ['Employee', 'Manager']:
            raise PermissionDenied("Access denied: Employee or Manager role is required.")
        return request.user.role in ['Employee', 'Manager']

class IsAdminorEmployee(BasePermission):
    def has_permission(self, request, view):
        if request.user.role not in ['Employee', 'Admin']:
            raise PermissionDenied("Access denied: Employee or Admin role is required.")
        return request.user.role in ['Employee', 'Admin']