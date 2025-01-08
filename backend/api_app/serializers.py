from rest_framework import serializers
from .models import users
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
            raise serializers.ValidationError("Invalid email or password")

        # Compare the hashed password (adjust depending on the hashing method used in frontend)
        if not self.check_password(password, user.password_hash):
            raise serializers.ValidationError("Invalid email or password")

        return data

    def check_password(self, password, password_hash):
        # Assuming bcrypt hash comparison (if you're using a different hashing method, replace this logic)
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
