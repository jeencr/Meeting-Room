import json
from django.http import JsonResponse
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

from .models import *


@csrf_exempt
def register(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            if not first_name:
                return JsonResponse({'error': 'First name is required'}, status=400)

            if not last_name:
                return JsonResponse({'error': 'Last name is required'}, status=400)
            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)
            if not email:
                return JsonResponse({'error': 'Email is required'}, status=400)
            if not password:
                return JsonResponse({'error': 'Password is required'}, status=400)
            

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)

            
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)

            # Password length
            if len(password) < 6:
                return JsonResponse({'error': 'Password must be at least 6 characters'}, status=400)


            user = User.objects.create_user(first_name=first_name,last_name=last_name,username=username,
                                            email=email,password=password)


            customer_group = Group.objects.get( name='Customer')
            user.groups.add(customer_group)
            return JsonResponse({'message': 'User registered successfully'}, status=201)
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Group.DoesNotExist:
        return JsonResponse({'error': 'Customer group does not exist'}, status=500)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def login(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)
            if not password:
                return JsonResponse({'error': 'Password is required'}, status=400)

        

            user = authenticate(username=username,password=password)
            if user is not None:
                group = user.groups.first()
            
                return JsonResponse({'message': 'Login successful','user_id': user.id,                                     
                                     'username': user.username, 'group': group.name if group else None})

            return JsonResponse({'error': 'Invalid username or password'}, status=401)
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
def create_room(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            name = data.get('name')
            capacity = data.get('capacity')
            location = data.get('location')
            if not name or not capacity or not location:
                return JsonResponse({'error': 'All fields are required'}, status=400)
            if Room.objects.filter(name=name).exists():
                return JsonResponse({'error': 'Room already exists'}, status=400)
            room = Room.objects.create(name=name,capacity=capacity,location=location)

            return JsonResponse({'message': 'Room created successfully','room_id': room.id})
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


def room_list(request):
    try:
        # rooms = Room.objects.filter(is_available=True)
        rooms = Room.objects.all()
        room_data = []
        for room in rooms:
            room_data.append({
                'id': room.id,
                'name': room.name,
                'capacity': room.capacity,
                'location': room.location,
                'is_available': room.is_available
            })

        return JsonResponse(room_data,safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
def create_booking(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            room_id = data.get('room_id')
            user_id = data.get('user_id')
            date = data.get('date')
            start_time = data.get('start_time')
            end_time = data.get('end_time')

            if not room_id or not user_id or not date or not start_time or not end_time:
                return JsonResponse({'error': 'All fields are required'}, status=400)
            try:
                room = Room.objects.get(id=room_id)
            except Room.DoesNotExist:
                return JsonResponse({'error': 'Room does not exist'}, status=404)

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User does not exist'}, status=404)

            
            booking_date = datetime.strptime(date,'%Y-%m-%d').date()
            today = datetime.today().date()

            if booking_date < today:
                return JsonResponse({'error': 'Past dates are not allowed'}, status=400)

            start = datetime.strptime(start_time,'%H:%M').time()
            end = datetime.strptime(end_time,'%H:%M').time()
            if end <= start:
                return JsonResponse({'error': 'End time must be greater than start time'}, status=400)

            overlapping_bookings = Booking.objects.filter(room=room,date=booking_date,start_time__lt=end,end_time__gt=start,status__in=['Pending', 'Approved'])
            if overlapping_bookings.exists():
                return JsonResponse({'error': 'Room already booked for this time slot'}, status=400)

            booking = Booking.objects.create(room=room,user=user,date=booking_date,start_time=start,end_time=end)

            return JsonResponse({'message': 'Booking created successfully','booking_id': booking.id})

        return JsonResponse({'error': 'Invalid request method'}, status=405)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


def my_bookings(request, user_id):
    try:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=404)

        bookings = Booking.objects.filter(user=user).order_by('-created_at')
        booking_data = []
        for booking in bookings:
            booking_data.append({'booking_id': booking.id,'room_name': booking.room.name,
                                 'date': booking.date,'start_time': booking.start_time,
                                 'end_time': booking.end_time,'status': booking.status
                                 
                                 })

        return JsonResponse(booking_data,safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def all_bookings(request):
    try:
        bookings = Booking.objects.all().order_by('-created_at')
        booking_data = []
        for booking in bookings:
            booking_data.append({
                'booking_id': booking.id,
                'username': booking.user.username,
                'room_name': booking.room.name,
                'date': booking.date,
                'start_time': booking.start_time,
                'end_time': booking.end_time,
                'status': booking.status
            })
        return JsonResponse(booking_data,safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
def update_booking_status(request, booking_id):
    try:
        if request.method == 'PATCH':
            data = json.loads(request.body)
            status = data.get('status')
            if not status:
                return JsonResponse({'error': 'Status is required'}, status=400)
            
            if status not in ['Approved', 'Rejected']:
                return JsonResponse({'error': 'Invalid status'}, status=400)

            try:
                booking = Booking.objects.get(id=booking_id)
            except Booking.DoesNotExist:
                return JsonResponse({'error': 'Booking does not exist'}, status=404)

            booking.status = status
            booking.save()
            return JsonResponse({'message': 'Booking status updated successfully'})

        return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def dashboard_stats(request):
    try:
        total_rooms = Room.objects.count()
        total_bookings = Booking.objects.count()
        pending_bookings = Booking.objects.filter(status='Pending').count()

        return JsonResponse({'total_rooms': total_rooms,'total_bookings': total_bookings,
                             'pending_bookings': pending_bookings})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


def booked_slots(request):
    try:
        room_id = request.GET.get('room_id')
        date = request.GET.get('date')

        if not room_id or not date:
            return JsonResponse({'error': 'Room and date required'}, status=400)

        bookings = Booking.objects.filter(room_id=room_id,date=date,status__in=['Pending','Approved'])
        slot_data = []
        for booking in bookings:
            slot_data.append({
                'start_time': booking.start_time,
                'end_time': booking.end_time,
                'status': booking.status
            })

        return JsonResponse(slot_data,safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    



@csrf_exempt
def update_room_availability(request, room_id):
    try:
        if request.method == 'PATCH':
            data = json.loads(request.body)
            is_available = data.get('is_available')
            room = Room.objects.get(id=room_id)
            room.is_available = is_available
            room.save()
            return JsonResponse({'message': 'Room updated successfully'})

        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
    except Room.DoesNotExist:
        return JsonResponse({'error': 'Room not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


def health(request):
    return JsonResponse({'status': 'ok'})