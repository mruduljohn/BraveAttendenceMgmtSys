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
from django.utils import timezone
from .permissions import (IsAdmin, IsManager, 
                          IsEmployee,IsAdminOrManager,
                          IsManagerorEmployee,IsAdminorEmployee)
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the employee_id from the authenticated user's token
        user = request.user
        # Fetch leave requests for the authenticated employee
        records = leave_requests.objects.filter(employee=user)

        if not records.exists():
            return Response(
                {"message": "No leave requests found ."},
            )

        # Serialize the data
        serializer = FetchLeaveRequestSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK
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
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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
    


from django.db.models import Count, Sum, Q, F, Func

class Cast(Func):
    function = 'CAST'
    template = '%(expressions)s AS NUMERIC'

class GenerateAttendanceRecordsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            # Fetch the month from the URL parameters
            month = kwargs.get('month', None)

            if month:
                try:
                    month = int(month)
                except ValueError:
                    return Response(
                        {"message": "Invalid month parameter."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Filter attendance records based on the month
            if month:
                attendance_records = attendance.objects.filter(date__month=month)
            else:
                attendance_records = attendance.objects.all()

            if not attendance_records.exists():
                return Response(
                    {"message": "No attendance records found for the given month."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Summarize attendance for each employee
            summary = (
                attendance_records.values('employee_id')
                .annotate(
                    employee_name=F('employee_id__username'),  # Fetching the username from the related user model
                    position=F('employee_id__position'),  # Fetching the role from the related user model
                    total_days=Count('attendance_id'),
                    days_present=Count('attendance_id', filter=Q(status='present')),
                    days_absent=Count('attendance_id', filter=Q(status='absent')),
                    total_hours=Func(
                        Func(F('total_hours'), function='CAST', template='(%(expressions)s)::NUMERIC'),
                        function='ROUND',
                        template="ROUND(%(expressions)s, 0)"
                    ),
                )
            )

            return Response(
                {"message": "Attendance summary fetched successfully!", "data": list(summary)},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
