import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  product$ = this.productService.getProductByID(+this.route.snapshot.params.id);
  constructor(private route: ActivatedRoute, public productService: ProductService) {
  }
  ngOnInit() {
    console.log(this.route.snapshot.params.id);
    this.route.paramMap.subscribe(() => {
    });
  }
}
