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

  getAllBookings() {
    return this.http.get(`${this.apiUrl}/all-bookings/`);
  }

  updateBookingStatus(booking_id: any, data: any) {
    return this.http.patch(
      `${this.apiUrl}/update-booking-status/${booking_id}/`,

      data,
    );
  }

  getDashboardStats() {
    return this.http.get(`${this.apiUrl}/dashboard-stats/`);
  }

  getBookedSlots(room_id: any, date: any) {
    return this.http.get(
      `${this.apiUrl}/booked-slots/?room_id=${room_id}&date=${date}`,
    );
  }
}
