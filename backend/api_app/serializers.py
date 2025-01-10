# api_app/serializers.py

from rest_framework import serializers
from django.contrib.auth.hashers import check_password
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
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
class AddUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['username', 'email', 'password', 'role', 'position', 'department', 'joined_date']

    def validate_email(self, value):
        # Check if the email already exists
        if users.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # Hash the password before saving
        raw_password = validated_data.pop('password')  # Extract the raw password
        hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        validated_data['password'] = hashed_password  # Replace with hashed password

        # Create the user with the hashed password
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

    class Meta:
        model = leave_requests
        fields = ['leave_type', 'start_date', 'end_date', 'status']




class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['username', 'department', 'role', 'position']  # Only the fields we want to allow updating


