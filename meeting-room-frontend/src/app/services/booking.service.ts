import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  createBooking(data: any) {
    return this.http.post(
      `${this.apiUrl}/create-booking/`,

      data,
    );
  }

  getMyBookings(user_id: any) {
    return this.http.get(`${this.apiUrl}/my-bookings/${user_id}/`);
  }
}
