from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register ),
    path('login/', views.login),
    path('create-room/', views.create_room ),
    path('rooms/', views.room_list ),
    path('create-booking/', views.create_booking ),
    path('my-bookings/<int:user_id>/', views.my_bookings),
    path('all-bookings/', views.all_bookings),
    path('update-booking-status/<int:booking_id>/', views.update_booking_status),
    path('dashboard-stats/', views.dashboard_stats),
    path('booked-slots/', views.booked_slots),
    path('update-room-availability/<int:room_id>/', views.update_room_availability),
    path('health/', views.health),
]