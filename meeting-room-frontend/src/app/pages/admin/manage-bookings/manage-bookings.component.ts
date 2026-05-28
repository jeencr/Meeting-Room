import { Component, OnInit } from '@angular/core';

import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.scss'],
})
export class ManageBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getAllBookings();
  }

  getAllBookings() {
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        this.bookings = response;
      },

      (error) => {
        console.log(error);
      },
    );
  }

  updateStatus(booking_id: any, status: string) {
    const data = {
      status: status,
    };

    this.bookingService.updateBookingStatus(booking_id, data).subscribe(
      (response: any) => {
        alert(response.message);

        this.getAllBookings();
      },

      (error) => {
        alert(error.error.error);
      },
    );
  }
}
