import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  total_rooms = 0;
  total_bookings = 0;
  pending_bookings = 0;
  isLoading = false;
  hasError = false;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getDashboardStats();
  }

  getDashboardStats() {
    this.isLoading = true;
    this.hasError = false;
    
    this.bookingService.getDashboardStats().subscribe(
      (response: any) => {
        this.total_rooms = response.total_rooms;
        this.total_bookings = response.total_bookings;
        this.pending_bookings = response.pending_bookings;
        this.isLoading = false;
        
        // Optional: Show welcome toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Dashboard loaded',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        this.hasError = true;
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load dashboard data',
          confirmButtonColor: '#667eea',
        });
      },
    );
  }
}