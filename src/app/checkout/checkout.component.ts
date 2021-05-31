import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductService } from '../products.service';
import Swal from 'sweetalert2';
import { IFormValidationResponse } from '../../../backend/types';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  submitted: boolean;
  stores = ['Aargau', 'Bern', 'Fribourg', 'Luzern', 'Olten', 'Lausanne', 'Zürich'];
  checkoutForm: FormGroup;
  // checkout;
  constructor(
    private http: HttpClient,
    public productService: ProductService
  ) {

  }
  ngOnInit(): void {
    this.checkoutForm = new FormGroup({
      lastname: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      firstname: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ])
    });
  }
  async onSubmit() {
    if (this.checkoutForm.invalid) {
      this.submitted = true;
      return false;
    }
    const params = new HttpParams()
      .set('firstname', this.checkoutForm.controls.firstname.value)
      .set('lastname', this.checkoutForm.controls.lastname.value)
      .set('email', this.checkoutForm.controls.email.value);
    await this.http.get('/api/checkout', { params }).toPromise().then((rawRes) => {
      const typedRes = rawRes as IFormValidationResponse;
      if (typedRes.invalid && typedRes.invalid.length) {
        let msg = '';
        for (const invProperty of typedRes.invalid) {
          msg += `Der Wert des Feldes ${invProperty} ist ungültig!\n`;
        }
        Swal.fire('Fehler', msg, 'warning');
      } else {
        Swal.fire(
          'Danke für den Einkauf',
          'Die Produkte wurden erfolgreich bestellt, wir benachrigen Sie per Mail, wenn die Produkte verfügbar sind.',
          'success'
        );
      }
    });
    // Process checkout data here
    console.warn('Your order has been submitted', this.checkoutForm);
    this.productService.resetKart();
    this.checkoutForm.reset();
  }

}
