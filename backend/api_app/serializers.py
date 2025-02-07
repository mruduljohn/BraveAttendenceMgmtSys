from rest_framework import serializers
from django.contrib.auth.hashers import check_password,make_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import users
from .models import attendance
from .models import leave_requests
import bcrypt

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Query the database to check if the email exists
        try:
            user = users.objects.get(email=email)
        except users.DoesNotExist:
            raise serializers.ValidationError("Email doesn't exist")

        # Compare the hashed password with the stored password
        if not self.check_password(password, user.password):
            raise serializers.ValidationError("Invalid password")

        # Generate JWT token for the authenticated user
        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role
        # data['access_token'] = str(refresh.access_token)
        # data['refresh_token'] = str(refresh)

        return {
            'message': 'Login successful!',
            'employee_id': user.employee_id,  # Include the user's ID
            'username': user.username,  # Include the user's username
            'email': user.email,  # Include the user's email
            'role': user.role,  # Include the user's role
            'position': user.position,
            'department': user.department,
            'joined_date': user.joined_date,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        }


    def check_password(self, password, password_hash):
        # Assuming bcrypt hash comparison
        return check_password(password, password_hash)
    
class AddUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['username', 'email', 'password', 'role', 'position', 'department', 'joined_date']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': True},  # Mark username as required
        }

    def validate_email(self, value):
        # Check if the email already exists
        if users.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # Hash the password before saving
         raw_password = validated_data.pop('password')
         hashed_password = make_password(raw_password)  # This handles the bcrypt hashing
         validated_data['password'] = hashed_password 
         return users.objects.create(**validated_data)




class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = attendance
        fields = ['attendance_id','employee_id', 'date', 'status', 'total_hours']



class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = leave_requests
        fields = ['leave_id', 'employee', 'leave_type', 'start_date', 'end_date', 'status', 'created_at', 'updated_at']
        read_only_fields = ['employee']  # Ensure the employee field is read-only in the response

class FetchLeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.username', read_only=True)

    class Meta:
        model = leave_requests
        fields = ['leave_id', 'employee', 'employee_name', 'leave_type', 'start_date', 'end_date', 'status','comment']




class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['username', 'email', 'role', 'position', 'department']
        extra_kwargs = {
            'username': {'required': True},  # Ensure username is always required
        }

class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['employee_id','username', 'email', 'password', 'department', 'role', 'position']  # Only the fields we want to allow updating
        extra_kwargs = {
            'password': {'write_only': True},  # Ensures the password isn't returned in responses
        }

class user_details(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['employee_id','username', 'email', 'role', 'position', 'department', 'joined_date']  # Only the fields we want to return

class FetchAllAttendanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.PrimaryKeyRelatedField(source='employee.id', queryset=users.objects.all())
    employee_name = serializers.CharField(source='users.name')
    class Meta:
        model = attendance  # Replace with the name of your attendance model
        ['leave_id','leave_type', 'start_date', 'end_date', 'status', 'employee_id', 'employee_name']  # Include all fields or specify the required fields



class AcceptRejectLeaveRequestSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField(required=True)
    leave_id = serializers.IntegerField(required=True)
    action = serializers.ChoiceField(choices=["approve", "reject"], required=True)
    comment = serializers.CharField(required=False, allow_blank=True)
    def validate(self, data):
        """
        Validates that the combination of employee_id and leave_id exists.
        """
        employee_id = data.get('employee_id')
        leave_id = data.get('leave_id')

        if not leave_requests.objects.filter(employee_id=employee_id, leave_id=leave_id).exists():
            raise serializers.ValidationError("No matching leave request found for the given employee ID and leave ID.")
        return data

    def update_status(self):
        """
        Updates the status of a specific leave request based on employee_id, leave_id, and action.
        """
        validated_data = self.validated_data
        print(validated_data)
        employee_id = validated_data['employee_id']
        leave_id = validated_data['leave_id']
        action = validated_data['action']
        comment = validated_data.get('comment', '')
        print("comment:", comment)
        # Fetch the specific leave request
        try:
            leave_request = leave_requests.objects.get(employee_id=employee_id, leave_id=leave_id)
            leave_request.status = "Approved" if action == "approve" else "Rejected"
            leave_request.comment = comment
            leave_request.save()
            return leave_request
        except leave_requests.DoesNotExist:
            raise serializers.ValidationError("Leave request not found.")

    
class GenerateAttendanceRecordsSerializer(serializers.ModelSerializer):
    # Fetch username and role from the related user model
    username = serializers.CharField(source='employee_id.username', read_only=True)
    position = serializers.CharField(source='employee_id.position', read_only=True)

    class Meta:
        model = attendance
        fields = ['attendance_id', 'employee_id', 'date', 'status', 'total_hours', 'username', 'position']