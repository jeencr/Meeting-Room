import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import Swal from 'sweetalert2';

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
  bookedSlots: any[] = [];
  isLoading = false;
  isCreating = false;
  todayDate: string;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
  ) {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.room_id = this.route.snapshot.queryParamMap.get('room_id');
  }

  createBooking() {
    if (!this.date || !this.start_time || !this.end_time) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please select date, start time and end time',
        confirmButtonColor: '#667eea',
      });
      return;
    }

    if (this.start_time >= this.end_time) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Time',
        text: 'End time must be after start time',
        confirmButtonColor: '#667eea',
      });
      return;
    }

    const data = {
      room_id: this.room_id,
      user_id: localStorage.getItem('user_id'),
      date: this.date,
      start_time: this.start_time,
      end_time: this.end_time,
    };

    this.isCreating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.bookingService.createBooking(data).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Booking Created!',
          text: response.message,
          timer: 2000,
          showConfirmButton: false,
        });
        this.successMessage = response.message;
        this.errorMessage = '';
        this.isCreating = false;
        this.getBookedSlots();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: error.error.error || 'Could not create booking',
          confirmButtonColor: '#667eea',
        });
        this.errorMessage = error.error.error;
        this.successMessage = '';
        this.isCreating = false;
      },
    );
  }

  getBookedSlots() {
    if (this.date) {
      this.isLoading = true;
      this.bookedSlots = [];
      
      this.bookingService
        .getBookedSlots(this.room_id, this.date)
        .subscribe(
          (response: any) => {
            this.bookedSlots = response;
            this.isLoading = false;
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          },
        );
    }
  }
}