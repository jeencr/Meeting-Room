import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.scss'],
})
export class ManageBookingsComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading = false;
  isUpdating = false;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getAllBookings();
  }

  getAllBookings() {
    this.isLoading = true;
    
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        this.bookings = response;
        this.filteredBookings = [...response];
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load bookings',
          confirmButtonColor: '#667eea',
        });
      },
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBookings = this.bookings.filter(booking => 
      booking.username?.toLowerCase().includes(filterValue) ||
      booking.room_name?.toLowerCase().includes(filterValue) ||
      booking.date?.toLowerCase().includes(filterValue) ||
      booking.status?.toLowerCase().includes(filterValue)
    );
  }

  updateStatus(booking_id: any, status: string) {
    const actionText = status === 'Approved' ? 'approve' : 'reject';
    const confirmColor = status === 'Approved' ? '#48bb78' : '#fc8181';
    
    Swal.fire({
      title: 'Confirm Action',
      text: `Are you sure you want to ${actionText} this booking?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}!`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#718096',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const data = { status: status };
        this.isUpdating = true;

        this.bookingService.updateBookingStatus(booking_id, data).subscribe(
          (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: response.message,
              timer: 2000,
              showConfirmButton: false,
            });
            this.getAllBookings();
            this.isUpdating = false;
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error.error || 'Update failed',
              confirmButtonColor: '#667eea',
            });
            this.isUpdating = false;
          },
        );
      }
    });
  }
}