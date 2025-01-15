from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied  
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from rest_framework.views import APIView
from .serializers import (
    AddUserSerializer,
    LoginSerializer,
    AttendanceSerializer,
    LeaveRequestSerializer,
    user_details,
    GenerateAttendanceRecordsSerializer,
    FetchLeaveRequestSerializer,
    UpdateUserSerializer,
    EditUserSerializer,
    AcceptRejectLeaveRequestSerializer
)
from .models import attendance, users, leave_requests
from datetime import datetime
from datetime import datetime, timedelta, timezone
from .permissions import (IsAdmin, IsManager, 
                          IsEmployee,IsAdminOrManager,
                          IsManagerorEmployee,IsAdminorEmployee)
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.db.models import F, ExpressionWrapper, fields
from datetime import timedelta, date
from django.utils.timezone import make_aware
from django.utils import timezone
import pytz

ist = pytz.timezone('Asia/Kolkata')  # IST timezone
def assign_role(user, role):
    """
    Assign a role dynamically to a user.
    """
    user.role = role
    user.save()
    return user

#everyone can access
@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TokenValidityCheckView(APIView):
   

    def get(self, request):
        """
        Check if the JWT token is expired or valid.
        """
        auth = JWTAuthentication()

        # Try to authenticate the request token
        try:
            # JWT Authentication will decode and validate the token
            res = auth.authenticate(request)
            if(res is None):
                raise AuthenticationFailed()
            # If token is valid, the user will be authenticated, and we proceed
            return Response({"isAuthenticated": True})

        except AuthenticationFailed as e:
            # Handle the case where the token is invalid or expired
            return Response({"isAuthenticated": False}, status=401)

#employee only access-- admin , manger, employee
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clock_in_out(request):
        user = request.user  # Get logged-in user from token
        try:
            # Fetch employee_id from users model
            employee = users.objects.get(email=user.email)
            employee_id = employee.employee_id

            # Check if there's already an open attendance entry
            open_entry = attendance.objects.filter(employee__employee_id=employee_id, status='Open').first()

            if 'action' not in request.data:
                return Response({"error": "Action (clock_in/clock_out) is required"}, status=status.HTTP_400_BAD_REQUEST)

            action = request.data['action']

            if action == 'clock_in':
                if open_entry:
                    return Response({"error": "clocked in already"}, status=status.HTTP_400_BAD_REQUEST)

                # Create new clock-in entry
                attendance_entry = attendance.objects.create(
                    employee_id=employee_id,
                    date=now().date(),
                    clock_in_time=now(),
                    status='Open',
                )
                return Response({"message": "Clock-in successful","isClockedIn": True, "entry_id": attendance_entry.attendance_id}, status=status.HTTP_201_CREATED)

            elif action == 'clock_out':
                if not open_entry:
                    return Response({"error": "No clockout sessions!"}, status=status.HTTP_400_BAD_REQUEST)

                # Update the clock-out time and calculate total hours
                clock_in_time = open_entry.clock_in_time
                clock_out_time = now()
                total_hours = (clock_out_time - clock_in_time).total_seconds() / 3600.0  # Hours as float
                open_entry.clock_out_time = clock_out_time
                open_entry.status = 'Closed'
                open_entry.total_hours = total_hours if open_entry.total_hours is None else open_entry.total_hours + total_hours
                open_entry.save()

                return Response({"message": "Clock-out successful","isClockedIn": False, "entry_id": open_entry.attendance_id, "total_hours": open_entry.total_hours}, status=status.HTTP_200_OK)

            else:
                return Response({"error": "Invalid action. Use 'clock_in' or 'clock_out'."}, status=status.HTTP_400_BAD_REQUEST)

        except users.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
def check_attendance_status(request):
    try:
      
        user = request.user
        
        
        current_attendance = attendance.objects.filter(employee=user, status='Open').first()

        if current_attendance:
           
            return Response({
                'isClockedIn': True,
                'entry_id': current_attendance.attendance_id,
                'clock_in_time': current_attendance.clock_in_time,
            })
        else:
       
            return Response({
                'isClockedIn': False,
            })

    except Exception as e:
        # In case of error
        return Response({'error': str(e)}, status=400)
    
#admin only access   
class AddUserView(APIView):
    permission_classes = [IsAdmin]
    def post(self, request):
        serializer = AddUserSerializer(data=request.data)
        try:
            # Your logic here
            serializer = AddUserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            # Custom error message when permission is denied
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)

#access -- everyone
class FetchAttendanceView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request):
        user = request.user  
        try:
            records = attendance.objects.filter(employee=user)

            # If no records are found, return an appropriate message
            if not records.exists():
                return Response({"message": "No attendance records found for this employee."}, status=status.HTTP_404_NOT_FOUND)

            # Serialize the data
            serializer = AttendanceSerializer(records, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated ,IsAdminorEmployee])
#employee , admin
def create_leave_request(request):
    user = request.user  

    # Validate required fields in the request body
    required_fields = ['leave_type', 'start_date', 'end_date', 'status']
    for field in required_fields:
        if field not in request.data:
            return Response({"error": f"{field} is required"}, status=status.HTTP_400_BAD_REQUEST)

    leave_type = request.data['leave_type']
    start_date = request.data['start_date']
    end_date = request.data['end_date']
    status_value = request.data['status']  

    # Parse the dates to datetime objects
    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format, use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the employee based on the logged-in user's email
        employee = users.objects.get(email=user.email)
        employee_id = employee.employee_id

        # Create a new leave request
        leave_request = leave_requests.objects.create(
            employee_id=employee_id,
            leave_type=leave_type,
            start_date=start_date,
            end_date=end_date,
            status=status_value  
        )

        # Return the response with success message and employee ID
        return Response({
            "message": "Leave request created successfully",
            "employee_id": employee_id,
        }, status=status.HTTP_201_CREATED)

    except users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  

class FetchLeaveRequestsView(APIView):
    #admin,employee
    permission_classes = [IsAuthenticated, IsAdminorEmployee]

    def get(self, request, *args, **kwargs):
        # Get the employee_id from the authenticated user's token
        employee_id = request.user.employee_id 

        # Fetch leave requests for the authenticated employee
        requests = leave_requests.objects.filter(employee_id=employee_id)

        if not requests.exists():
            return Response(
                {"message": "No leave requests found for this employee."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the data
        serializer = FetchLeaveRequestSerializer(requests, many=True)
        return Response(
            {"employee_id": employee_id, "Leave Requests": serializer.data},
            status=status.HTTP_200_OK
        )



class UpdateUserDetailsView(APIView):
    #everyone
    permission_classes = [IsAuthenticated]
    def patch(self, request, *args, **kwargs):
        employee_id = request.user.employee_id   #

        if not employee_id:
            return Response({"error": "Employee ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the user by employee_id
            user = users.objects.get(employee_id=employee_id)

            # Serialize the data
            serializer = UpdateUserSerializer(user, data=request.data, partial=True)  # partial=True for partial updates
            if serializer.is_valid():
                serializer.save()  
                return Response({"message": "User details updated successfully!", "data": serializer.data}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except users.DoesNotExist:
            return Response({"error": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)
        
        
        
        #fetch all request, fetch all attendance record, accept or reject leave req ---> manager

class EditUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]  # Optional; remove if no authentication is needed for now

    def patch(self, request, *args, **kwargs):
        try:
            # Extract employee_id from the request data
            employee_id = request.data.get('employee_id')

            if not employee_id:
                return Response({"error": "Employee ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch the user by employee_id
            user = users.objects.get(employee_id=employee_id)

            # Check if a new password is provided, hash it
            raw_password = request.data.get('password')
            if raw_password:
                hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                request.data['password'] = hashed_password  # Replace raw password with hashed password in the request data

            # Serialize the data
            serializer = EditUserSerializer(user, data=request.data, partial=True)  # partial=True allows updating specific fields
            if serializer.is_valid():
                serializer.save()  # Save the updated user
                return Response(
                    {"message": "User details updated successfully!", "data": serializer.data},
                    status=status.HTTP_200_OK
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except users.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager] 
    def get(self, request, *args, **kwargs):
        try:
            # Fetch all users from the users table
            user_list = users.objects.all()

            # Serialize the data
            serializer = user_details(user_list, many=True)

            # Return the serialized data
            return Response(
                {"message": "User list fetched successfully!", "data": serializer.data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin] 
    def delete(self, request, *args, **kwargs):
        # Get the employee_id from the request data
        employee_id = request.data.get('employee_id')

        if not employee_id:
            return Response(
                {"error": "Employee ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch the user by employee_id
            user = users.objects.get(employee_id=employee_id)
            
            # Delete the user
            user.delete()
            
            return Response(
                {"message": f"User with employee_id {employee_id} has been deleted successfully!"},
                status=status.HTTP_200_OK
            )
        except users.DoesNotExist:
            return Response(
                {"error": f"No user found with employee_id {employee_id}."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        


class FetchAllLeaveRequestsView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request, *args, **kwargs):
        # Fetch leave requests for all employees (no employee_id filter)
        requests = leave_requests.objects.all()

        if not requests.exists():
            return Response(
                {"message": "No leave requests found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the data
        serializer = FetchLeaveRequestSerializer(requests, many=True)
        return Response(
            {"Leave Requests": serializer.data},
            status=status.HTTP_200_OK
        )

class FetchAllAttendanceRecordsView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request, *args, **kwargs):
        try:
            # Fetch all attendance records
            attendance_records = attendance.objects.all()

            if not attendance_records.exists():
                return Response(
                    {"message": "No attendance records found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize the data
            serializer = AttendanceSerializer(attendance_records, many=True)
            return Response(
                {"message": "Attendance records fetched successfully!", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        



class AcceptRejectLeaveRequestView(APIView):
    permission_classes = [IsAuthenticated, IsManager]

    def patch(self, request, *args, **kwargs):
        serializer = AcceptRejectLeaveRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                leave_request = serializer.update_status()
                return Response(
                    {"message": f"Leave request has been {leave_request.status} successfully."},
                    status=status.HTTP_200_OK
                )
            except serializers.ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



STANDARD_WORKING_HOURS = 8  # Define your standard working hours per day


def get_total_working_days(year, month):
    today = date.today()
    start_date = date(year, month, 1)
    try:
        # Handle the transition to the next month
        end_date = min(today, date(year, month + 1, 1) - timedelta(days=1))
    except ValueError:
        # Handle December transitioning to January of the next year
        end_date = min(today, date(year + 1, 1, 1) - timedelta(days=1))

    total_days = (end_date - start_date).days + 1
    weekdays = sum(
        1 for day in range(total_days)
        if (start_date + timedelta(days=day)).weekday() < 5
    )
    return weekdays


def calculate_days_present(records):
    return len(set(record.date for record in records))


def calculate_daily_hours(records):
    daily_hours = {}

    for record in records:
        # Convert times to IST
        clock_in = record.clock_in_time.astimezone(ist)
        clock_out = record.clock_out_time.astimezone(ist) if record.clock_out_time else clock_in

        # If same day
        if clock_in.date() == clock_out.date():
            work_hours = (clock_out - clock_in).total_seconds() / 3600
            date = clock_in.date()
            daily_hours[date] = daily_hours.get(date, 0) + work_hours
        else:
            # Handle multi-day shifts
            current_time = clock_in
            while current_time.date() <= clock_out.date():
                if current_time.date() == clock_in.date():
                    # First day: from clock in to midnight
                    end_of_day = current_time.replace(hour=23, minute=59, second=59)
                    hours = (end_of_day - current_time).total_seconds() / 3600
                elif current_time.date() == clock_out.date():
                    # Last day: from midnight to clock out
                    start_of_day = current_time.replace(hour=0, minute=0, second=0)
                    hours = (clock_out - start_of_day).total_seconds() / 3600
                else:
                    # Full day in between
                    hours = 24.0

                date = current_time.date()
                daily_hours[date] = daily_hours.get(date, 0) + hours
                
                # Move to next day
                current_time = (current_time + timedelta(days=1)).replace(hour=0, minute=0, second=0)

    return daily_hours

def calculate_overtime(daily_hours):
    total_overtime = 0
    for day, hours in daily_hours.items():
        # Round hours to 2 decimal places for more accurate comparison
        hours = round(hours, 2)
        if hours > STANDARD_WORKING_HOURS:
            overtime = hours - STANDARD_WORKING_HOURS
            total_overtime += overtime
    
    return round(total_overtime, 2)

def get_unique_days(records):
    unique_days = set()
    for record in records:
        # Only add the clock-in date as a working day
        clock_in = record.clock_in_time.astimezone(ist)
        unique_days.add(clock_in.date())
    return unique_days
@api_view(['GET'])
@permission_classes([IsAuthenticated ,IsManager])
def generate_report(request, month):

    year = date.today().year
    current_month = date.today().month

    if not 1 <= month <= 12:
        return JsonResponse({'error': 'Invalid month'}, status=400)
    if month > current_month:
        return JsonResponse({'error': 'Selected month cannot be in the future'}, status=400)

    total_working_days = get_total_working_days(year, month)

    # Get distinct employee IDs from attendance records
    employee_ids = attendance.objects.values_list('employee', flat=True).distinct()
    # print(employee_ids)

    report = []
    for employee_id in employee_ids:
        # Fetch the employee object
        try:
            employee = users.objects.get(employee_id=employee_id)
            # print(employee)
        except users.DoesNotExist:
            continue
        start_of_month = datetime(year, month, 1, tzinfo=ist)
        end_of_month = (start_of_month + timedelta(days=31)).replace(day=1) - timedelta(seconds=1)
        


        # Fetch attendance records for the employee
        records = attendance.objects.filter(
        employee_id=employee_id,
        clock_in_time__gte=start_of_month,
        clock_in_time__lte=end_of_month
        )

     
      
    # Calculate unique days
        unique_days = get_unique_days(records)

        # Calculate daily hours
        daily_hours = calculate_daily_hours(records)

        # Calculate total overtime
        total_overtime = calculate_overtime(daily_hours)
        print(employee.position)
        report.append({
            'employee_id': employee.employee_id,
            'employee_name': employee.username,
            'position:':employee.position,
            'total_days': total_working_days,
            'days_present': len(unique_days),
            'days_absent': total_working_days - len(unique_days),
            'total_overtime_hours': total_overtime,
        })

    return JsonResponse({'report': report}, status=200)