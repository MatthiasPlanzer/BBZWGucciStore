import { Component, ModuleWithProviders, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './products.service';
import { Observer, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  kart: Subscription;
  constructor(public productService: ProductService) {
    this.kart = productService.shoppingKartChange().subscribe(this.refreshGrandTotal.bind(this));
  }
  // products = AppComponent.forRoot()
  grandTotal: Promise<number>;
  title = 'BBZW Gucci Store';
  isMenuCollapsed = true;
  static forRoot(config: ProductService): ModuleWithProviders {
    return {
      ngModule: AppComponent,
      providers: [
        { provide: ProductService, useValue: config }
      ]
    };
  }
  ngOnInit() {
    this.refreshGrandTotal();
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.kart.unsubscribe();
  }
  public refreshGrandTotal() {
    this.grandTotal = this.productService.getGrandTotal();
  }

}
