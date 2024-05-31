import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) { }


  login(userInfo: {email: string, password: string}): Observable<string | boolean> {
    if (userInfo.email === 'Kluev@gmail.com' && userInfo.password === 'ddd') {
      return of(true)
    }
    return throwError(() => new Error('Failed Login'))
  }


}
