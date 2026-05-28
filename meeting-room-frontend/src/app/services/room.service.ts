import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class RoomService {

  apiUrl = 'http://127.0.0.1:8000/api'


  constructor(
    private http: HttpClient
  ) { }


  getRooms() {

    return this.http.get(

      `${this.apiUrl}/rooms/`
    )
  }
}