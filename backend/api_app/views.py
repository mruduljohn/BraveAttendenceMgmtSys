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
from .serializers import LeaveRequestSerializer
from .serializers import FetchLeaveRequestSerializer
from .serializers import UpdateUserSerializer

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
    def get(self, request, employee_id):
        # Filter attendance records by employee_id
        records = attendance.objects.filter(employee_id=employee_id)

        # If no records are found, return an appropriate message
        if not records.exists():
            return Response({"message": "No attendance records found for this employee."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the data
        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


# views.py
class CreateLeaveRequestView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        # Validate and process the request data
        serializer = LeaveRequestSerializer(data=data)
        if serializer.is_valid():
            # Save the leave request
            serializer.save()
            return Response(
                {"message": "Leave request created successfully!", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )

        # Return validation errors if any
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# views.py
class FetchLeaveRequestsView(APIView):
    def get(self, request, *args, **kwargs):
        employee_id = request.query_params.get('employee_id')  # Get the employee_id from query params

        if not employee_id:
            return Response(
                {"error": "Employee ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch leave requests for the given employee_id
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
    def patch(self, request, *args, **kwargs):
        employee_id = request.data.get('employee_id')  # Get employee_id from the request

        if not employee_id:
            return Response({"error": "Employee ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the user by employee_id
            user = users.objects.get(employee_id=employee_id)

            # Serialize the data
            serializer = UpdateUserSerializer(user, data=request.data, partial=True)  # partial=True for partial updates
            if serializer.is_valid():
                serializer.save()  # Save the updated user
                return Response({"message": "User details updated successfully!", "data": serializer.data}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except users.DoesNotExist:
            return Response({"error": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)