import { Component } from '@angular/core';
import { ProductService } from '../products.service';
import { Subscription } from 'rxjs';
import { IShoppingKartItem } from '../../../backend/types';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent {
  shoppingKart: Promise<IShoppingKartItem[]>;
  shoppingKartLength: Promise<number>;
  grandTotal: Promise<number>;
  kartSubscription: Subscription;
  constructor(public productService: ProductService) {
    this.kartSubscription = productService.shoppingKartChange().subscribe(this.refreshGrandTotal.bind(this));
    this.refreshGrandTotal();
  }
  public refreshGrandTotal() {
    this.grandTotal = this.productService.getGrandTotal();
    this.shoppingKart = this.productService.getShoppingKart();
    this.shoppingKartLength = this.productService.getShoppingKartLength();
  }
}
