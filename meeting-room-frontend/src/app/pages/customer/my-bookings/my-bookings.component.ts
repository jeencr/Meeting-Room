import { Component, OnInit } from '@angular/core';

import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getMyBookings();
  }

  getMyBookings() {
    const user_id = localStorage.getItem('user_id');

    this.bookingService.getMyBookings(user_id).subscribe(
      (response: any) => {
        this.bookings = response;
      },

      (error) => {
        console.log(error);
      },
    );
  }
}
