from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from rest_framework.views import APIView
from .serializers import AddUserSerializer
from .serializers import LoginSerializer
from .serializers import AttendanceSerializer
from .models import attendance, users, leave_requests
from datetime import datetime
from .serializers import user_details
from .serializers import FetchLeaveRequestSerializer
from .serializers import UpdateUserSerializer
from .serializers import EditUserSerializer
from .serializers import AcceptRejectLeaveRequestSerializer
import bcrypt

@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    
class AddUserView(APIView):
    def post(self, request):
        serializer = AddUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
@permission_classes([IsAuthenticated])
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
        

class EditUserView(APIView):
    permission_classes = [IsAuthenticated]  # Optional; remove if no authentication is needed for now

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
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]

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
