import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-rooms',
  templateUrl: './manage-rooms.component.html',
  styleUrls: ['./manage-rooms.component.scss'],
})
export class ManageRoomsComponent implements OnInit {
  rooms: any[] = [];
  name = '';
  capacity: any = '';
  location = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isCreating = false;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms() {
    this.isLoading = true;

    this.roomService.getRooms().subscribe(
      (response: any) => {
        this.rooms = response;
        console.log(this.rooms);
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load rooms',
          confirmButtonColor: '#667eea',
        });
      },
    );
  }

  createRoom() {
    if (!this.name || !this.capacity || !this.location) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please fill in all fields',
        confirmButtonColor: '#667eea',
      });
      return;
    }

    const data = {
      name: this.name,
      capacity: this.capacity,
      location: this.location,
    };

    this.isCreating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.roomService.createRoom(data).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Room Created!',
          text: response.message,
          timer: 2000,
          showConfirmButton: false,
        });
        this.successMessage = response.message;
        this.errorMessage = '';
        this.name = '';
        this.capacity = '';
        this.location = '';
        this.isCreating = false;
        this.getRooms();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.error || 'Failed to create room',
          confirmButtonColor: '#667eea',
        });
        this.errorMessage = error.error.error;
        this.successMessage = '';
        this.isCreating = false;
      },
    );
  }
  updateAvailability(room_id: number, is_available: boolean) {
    this.roomService
      .updateRoomAvailability(room_id, is_available)
      .subscribe((response: any) => {
        Swal.fire('Success', response.message, 'success');
      });
  }
}
