import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  products = this.productService.getProducts();
  constructor(public productService: ProductService) {

    // console.log(productService.getProducts());
  }

  ngOnInit() {
  }

}
