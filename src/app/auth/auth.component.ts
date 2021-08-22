import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { AuthService } from './auth.service';
import { INJ_TOKEN } from './storage';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent{
  isLoginMode = false;
  isBeingWorked = false;
  username: string = "";


  constructor(private authService: AuthService, 
              private router: Router) { }


  async onAuthorize(form: NgForm) {
    console.log(form.value)
    this.username = form.value.username;
    if (!this.isLoginMode) {
      this.isBeingWorked = true;
      this.authService.signUp(form.value.username, form.value.email, form.value.password);
    } else {
      this.authService.signIn(form.value.username, form.value.password);
      this.router.navigate(['/']);
    }

  }

  async onConfirm(form: NgForm) {
    let res;
    try {
      console.log(this.username, +form.value.code)
      Auth.confirmSignUp(this.username, form.value.code);
      //await this.authService.authenticateUser();
      
      
      //let jwt = await Auth.currentSession();
      //console.log(jwt);
      //this.authService.setToken(jwt);
      this.router.navigate(['/']);
    } catch (error) {
      console.log('error confirming sign up', error);
    }

  }

  onSwitchMode() {
    console.log("switch")
    this.isLoginMode = !this.isLoginMode;
  }
}
