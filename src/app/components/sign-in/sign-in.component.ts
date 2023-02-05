import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  loading: boolean = false;
  body: any;

  //Forms
public userForm: FormGroup = this.fb.group({
  username: [
    "",
    [Validators.required]
  ],
  completeName: [
    "",
    [Validators.required]
  ],
  password: [
    "",
    [Validators.required]
  ],
  confirmPassword: [
    "",
    [Validators.required]
  ]
})

  constructor
  (private fb: FormBuilder, 
    private userService: UserService,
    private router: Router,
    ) { }

    validField(field: any) {
      return this.userForm.controls[field].errors && this.userForm.controls[field].touched;
    }

    signIn() {
      const password = this.userForm.value.password;
      const confirmPassword = this.userForm.value.confirmPassword;
      this.body = '';
      if(password == confirmPassword) {
        this.loading = true;
        this.body = {
          username: this.userForm.value.username,
          password: password,
          completeName: this.userForm.value.completeName,
          roleId: 2
        };
        console.log(this.body);
          this.userService.signIn(this.body).subscribe(
            (res: any) => {
              console.log(res);
              if(res.status === 400) {
                Swal.fire({
                  text: 'Ya existe una cuenta registrada con este email',
                  icon: 'error',
                  timer: 20000,
                });            
                this.loading = false;
              }
              else {
              Swal.fire({
                title: 'Cuenta creada con exito',
                text: 'Se envió un email de confirmación a el correo electronico que ingreso',
                icon: 'success',
                timer: 20000,
              });
              this.userForm.reset();
              this.router.navigate(['/login'])
              }
  
             
            },
            (error: any) => {
              Swal.fire({
                icon: 'error',
                text: 'ha ocurrido un error, comuniquese con el administrador',
                timer: 3000
              });
              this.loading = false;
            }
          )
      }
      else{
        Swal.fire({
          icon: 'error',
          text: 'Las contraseñas no coinciden',
          timer: 3000
        });
      }
      
    }

}
