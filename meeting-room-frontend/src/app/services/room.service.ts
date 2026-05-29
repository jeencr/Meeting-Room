import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  apiUrl = 'https://meeting-room-15d5.onrender.com/api';

  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get(`${this.apiUrl}/rooms/`);
  }

  createRoom(data: any) {
    return this.http.post(`${this.apiUrl}/create-room/`, data);
  }

  updateRoomAvailability(room_id: number, is_available: boolean) {
    return this.http.patch(
      `${this.apiUrl}/update-room-availability/${room_id}/`,

      {
        is_available: is_available,
      },
    );
  }
}
