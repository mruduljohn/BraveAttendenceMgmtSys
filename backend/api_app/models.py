# api_app/models.py

from django.db import models

class users(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password_hash = models.TextField()
    user_role = models.CharField(max_length=50, null=True, blank=True)
    position_name = models.CharField(max_length=100, default='Engineer')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email
