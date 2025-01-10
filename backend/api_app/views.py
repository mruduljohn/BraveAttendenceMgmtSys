from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from rest_framework.views import APIView
from .serializers import (
    AddUserSerializer,
    LoginSerializer,
    AttendanceSerializer,
    LeaveRequestSerializer,
    FetchLeaveRequestSerializer,
    UpdateUserSerializer,
)
from .models import attendance, users, leave_requests
from datetime import datetime
from .permissions import IsAdmin, IsManager, IsEmployee,IsAdminOrManager,IsManagerorEmployee
from django.shortcuts import get_object_or_404

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

#employee only access-- admin , manger, admin
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsManagerorEmployee])
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
                    return Response({"error": "You already have an open session. Please clock out first."}, status=status.HTTP_400_BAD_REQUEST)

                # Create new clock-in entry
                attendance_entry = attendance.objects.create(
                    employee_id=employee_id,
                    date=now().date(),
                    clock_in_time=now(),
                    status='Open',
                )
                return Response({"message": "Clock-in successful", "entry_id": attendance_entry.attendance_id}, status=status.HTTP_201_CREATED)

            elif action == 'clock_out':
                if not open_entry:
                    return Response({"error": "No open session found to clock out."}, status=status.HTTP_400_BAD_REQUEST)

                # Update the clock-out time and calculate total hours
                clock_in_time = open_entry.clock_in_time
                clock_out_time = now()
                total_hours = (clock_out_time - clock_in_time).total_seconds() / 3600.0  # Hours as float
                open_entry.clock_out_time = clock_out_time
                open_entry.status = 'Closed'
                open_entry.total_hours = total_hours if open_entry.total_hours is None else open_entry.total_hours + total_hours
                open_entry.save()

                return Response({"message": "Clock-out successful", "entry_id": open_entry.attendance_id, "total_hours": open_entry.total_hours}, status=status.HTTP_200_OK)

            else:
                return Response({"error": "Invalid action. Use 'clock_in' or 'clock_out'."}, status=status.HTTP_400_BAD_REQUEST)

        except users.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

#employee only access -- everyone
class FetchAttendanceView(APIView):
    @permission_classes([IsAuthenticated,IsEmployee])
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
@permission_classes([IsAuthenticated ,IsEmployee])
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
        
        
        #edit, delete ,userlist --> admin
        #fetch all request, fetch all attendance record, accept or reject leave req ---> manager