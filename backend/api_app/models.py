from django.db import models
from django.contrib.auth.models import AbstractUser 
from django.utils import timezone
class users(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'Admin', 'Admin'
        MANAGER = 'Manager', 'Manager'
        EMPLOYEE = 'Employee', 'Employee'

    employee_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.TextField()
    role = models.CharField(
        max_length=50, 
        choices=Roles.choices, 
        default=Roles.EMPLOYEE
    )
    position = models.CharField(max_length=100, default='Engineer')
    department = models.CharField(max_length=100, default='Unknown')
    joined_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','employee_id']

    def __str__(self):
        return self.email

class attendance(models.Model):
    attendance_id = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    employee = models.ForeignKey(
        'users',  # Refers to the `users` model
        on_delete=models.CASCADE,
        db_column='employee_id' 
    )
    date = models.DateField()  # Date of attendance
    clock_in_time = models.DateTimeField()  # Not nullable
    clock_out_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, default='Open')
    total_hours = models.FloatField(null=True, blank=True)  # Nullable field

    def __str__(self):
        # Customize to return a readable string, e.g., "Attendance - Employee ID on Date"
        return f"Attendance {self.attendance_id} - {self.employee_id} on {self.date}"



class leave_requests(models.Model):

    leave_id = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    employee = models.ForeignKey(
        'users',  # Refers to the `users` model
        on_delete=models.CASCADE,
        db_column='employee_id'  # Ensures the column matches the database schema
    )
    leave_type = models.CharField(max_length=50)  # Type of leave, e.g., 'sick', 'vacation'
    start_date = models.DateField()  # Start date of the leave
    end_date = models.DateField()  # End date of the leave
    status = models.CharField(max_length=50)  # Leave status, e.g., 'approved', 'pending'
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for record creation
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp for record update

    def __str__(self):
        return f"Leave Request {self.leave_id} - {self.employee_id} from {self.start_date} to {self.end_date}"

