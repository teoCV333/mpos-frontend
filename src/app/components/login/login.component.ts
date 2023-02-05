import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
    ) { }

    loading: boolean = false;

    //Forms
public loginForm: FormGroup = this.fb.group({
  username: [
    "",
    [Validators.required]
  ],
  password: [
    "",
    [Validators.required]
  ]
})

ngOnInit(): void {
  localStorage.clear()
}

validField(field: any) {
  return this.loginForm.controls[field].errors &&
    this.loginForm.controls[field].touched;
}

login() {
  const user: any = {
    username: this.loginForm.value.username,
    password: this.loginForm.value.password
  }
  this.userService.logIn(user).subscribe({
    next: (data: any) => {
      if(data.status == 200) {
        this.loading = true;
        this.userService.getUser(user.username).subscribe(
        (res: any) => {
            //LOCALSTORAGE FOR ROOT
            console.log(res.data);
           if(res.data.role.name === 'root') {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('role', data.data.role.name);
            this.router.navigate([`dashboard`]);  
            this.loading = false;
          }
          //LOCALSTORAGE FOR USER
          if(res.data.role.name === 'user') {
          
            localStorage.setItem('token', data.data.token);              
            localStorage.setItem('role', data.data.role.name);
            this.router.navigate([`dashboard`]);
            this.loading = false;
          }
          },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            text: 'Contraseña y/o usuario incorrectos',
            timer: 3000
          });
        }
      ) 
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Contraseña y/o usuario incorrectos',
          timer: 3000
        });
      }
    }
  })
}

}