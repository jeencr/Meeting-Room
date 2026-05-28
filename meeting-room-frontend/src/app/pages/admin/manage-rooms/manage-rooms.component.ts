import { Component, OnInit } from '@angular/core';

import { RoomService } from 'src/app/services/room.service';

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

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms() {
    this.roomService.getRooms().subscribe(
      (response: any) => {
        this.rooms = response;
      },

      (error) => {
        console.log(error);
      },
    );
  }

  createRoom() {
    const data = {
      name: this.name,

      capacity: this.capacity,

      location: this.location,
    };

    this.roomService.createRoom(data).subscribe(
      (response: any) => {
        this.successMessage = response.message;

        this.errorMessage = '';

        this.name = '';

        this.capacity = '';

        this.location = '';

        this.getRooms();
      },

      (error) => {
        this.errorMessage = error.error.error;

        this.successMessage = '';
      },
    );
  }
}
