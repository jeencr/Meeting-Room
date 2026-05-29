import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  apiUrl = 'http://127.0.0.1:8000/api';

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
