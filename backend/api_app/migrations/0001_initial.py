# Generated by Django 5.1.4 on 2025-01-09 12:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='users',
            fields=[
                ('employee_id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password_hash', models.TextField()),
                ('role', models.CharField(blank=True, max_length=50, null=True)),
                ('position', models.CharField(default='Engineer', max_length=100)),
                ('department', models.CharField(default='Unknown', max_length=100)),
                ('joined_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='leave_requests',
            fields=[
                ('leave_id', models.AutoField(primary_key=True, serialize=False)),
                ('leave_type', models.CharField(max_length=50)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('status', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('employee', models.ForeignKey(db_column='employee_id', on_delete=django.db.models.deletion.CASCADE, to='api_app.users')),
            ],
        ),
        migrations.CreateModel(
            name='attendance',
            fields=[
                ('attendance_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('clock_in_time', models.DateTimeField()),
                ('clock_out_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='Open', max_length=10)),
                ('total_hours', models.FloatField(blank=True, null=True)),
                ('employee', models.ForeignKey(db_column='employee_id', on_delete=django.db.models.deletion.CASCADE, to='api_app.users')),
            ],
        ),
    ]
