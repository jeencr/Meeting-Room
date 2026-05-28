import json
from django.http import JsonResponse
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt

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
        rooms = Room.objects.filter(is_available=True)
        room_data = []
        for room in rooms:
            room_data.append({
                'id': room.id,
                'name': room.name,
                'capacity': room.capacity,
                'location': room.location,
            })

        return JsonResponse(room_data,safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)