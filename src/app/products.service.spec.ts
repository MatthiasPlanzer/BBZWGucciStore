import { TestBed, async } from '@angular/core/testing';
import { ProductService } from './products.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
describe('ProductService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    })
      .compileComponents();
  }));
  it('should be created', () => {
    const service: ProductService = TestBed.get(ProductService);
    expect(service).toBeTruthy();
  });
  it('should stack items', async () => {
    const service: ProductService = TestBed.get(ProductService);
    const products = await service.getProducts();
    await service.resetKart();
    await service.addProduct(products[0]);
    await service.addProduct(products[0]);
    console.log((await service.getShoppingKart()));
    expect((await service.getShoppingKart())[0].count).toEqual(2);
  });
  it('should calculate the total price', async () => {
    const service: ProductService = TestBed.get(ProductService);
    const products = await service.getProducts();
    await service.resetKart();
    await service.addProduct(products[0]);
    await service.addProduct(products[0]);
    expect((await service.getGrandTotal())).toEqual(11398);
  });
});
