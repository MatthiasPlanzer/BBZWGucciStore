import { Component } from '@angular/core';
import { ProductService } from '../products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './details.component.html',
})
export class DetailsComponent {
  product$ = this.productService.getProductByID(+this.route.snapshot.params.id);
  constructor(private route: ActivatedRoute, public productService: ProductService) {}
}
