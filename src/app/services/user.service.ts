import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User } from '../interfaces/User';


  const apiUrl = environment.API_URI;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signIn(body: any): Observable<any>{
    console.log(body);
    return this.http.post(`http://localhost:3000/api/user/`, body)
  }

  logIn(body: User): Observable<string>{
    return this.http.post<string>(`http://localhost:3000/api/user/login`, body)
  }

  getUser(username: string) {
    return this.http.get(`http://localhost:3000/api/user/by-username/${username}`)

  }

}
