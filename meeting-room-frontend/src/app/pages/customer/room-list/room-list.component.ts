import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  rooms: any[] = [];
  isLoading = false;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms() {
    this.isLoading = true;
    
    this.roomService.getRooms().subscribe(
      (response: any) => {
        this.rooms = response;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      },
    );
  }
}