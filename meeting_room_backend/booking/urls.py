from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('create-room/', views.create_room ),
    path('rooms/', views.room_list ),
]