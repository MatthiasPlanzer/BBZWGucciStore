import { Component } from '@angular/core';
import { ProductService } from '../products.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  products = this.productService.getProducts();
  constructor(public productService: ProductService) {
  }
}
