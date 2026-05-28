import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  room_id: any;
  date = '';

  start_time = '';

  end_time = '';

  errorMessage = '';

  successMessage = '';

  constructor(
    private route: ActivatedRoute,

    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.room_id = this.route.snapshot.queryParamMap.get('room_id');
  }

  createBooking() {
    const data = {
      room_id: this.room_id,

      user_id: localStorage.getItem('user_id'),

      date: this.date,

      start_time: this.start_time,

      end_time: this.end_time,
    };

    this.bookingService.createBooking(data).subscribe(
      (response: any) => {
        this.successMessage = response.message;

        this.errorMessage = '';
      },

      (error) => {
        this.errorMessage = error.error.error;

        this.successMessage = '';
      },
    );
  }
}
