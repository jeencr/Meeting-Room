from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User


class Room(models.Model):

    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    location = models.CharField(max_length=200)
    is_available = models.BooleanField(default=True)
    def __str__(self):
        return self.name


class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ]
    room = models.ForeignKey(Room,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.room.name} - {self.date}"