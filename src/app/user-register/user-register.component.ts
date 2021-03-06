import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/model';
import { AuthService } from '../shared/service/auth-service';
import { Validation } from '../shared/utils/validation';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  loading = false;
  submitted = false;
  user!: User;
  form!: FormGroup;
  fieldTextType!: boolean;
  fieldTextTypePWConfirm!: boolean;
  isRegistrationFailed = false;
  errorMessage!: string;
  constructor(
    private acountService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.maxLength(40)]],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required],

    },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
    this.user = new User(0, '', '', '', '', '');

  }


  // getter  to get form-controls from template and to easy access form fields
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  public onSubmit(): void {
    this.submitted = true;
    let user = this.form.value;
    console.log(JSON.stringify(user, null, 2));

    //stop if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.acountService.register(user).subscribe({

      next: (value: any) => {
        console.log(value);
        this.router.navigate(['../login']);
      },
      error: (msg: HttpErrorResponse) => {
        this.isRegistrationFailed = true;
        this.errorMessage = msg.error.message
        this.loading = false;

      }

    });

  }

  public toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }
  public toggleFieldTextTypePwConfitm(): void {
    this.fieldTextTypePWConfirm = !this.fieldTextTypePWConfirm;
  }

}
