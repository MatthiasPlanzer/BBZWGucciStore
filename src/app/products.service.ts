import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IProduct, IShoppingKartItem } from '../../backend/types';

// https://itnext.io/how-to-create-a-service-with-httpclient-and-injectable-in-angular-9-8-e3cc50c24c83
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private static products: Array<IProduct> = [];
  private static shoppingKart: Array<IShoppingKartItem> = [];
  public kartSubject = new Subject<IShoppingKartItem>();
  constructor(private http: HttpClient) { }
  public async getProducts(): Promise<Array<IProduct>> {
    if (!ProductService.products.length) {
      const body: Array<any> = await this.http.get('/assets/products.json', { withCredentials: true }).toPromise() as Array<any>;
      body.forEach((product => {
        ProductService.products.push({
          id: product[0],
          name: product[1],
          description: product[2],
          image: product[3],
          price: product[4],
          discontPrice: product[5]
        } as IProduct);
      }));
    }
    return ProductService.products;
  }
  shoppingKartChange(): Observable<any> {
    return this.kartSubject.asObservable();
  }
  onKartUpdate() {
    this.kartSubject.next();
  }
  public getPrice() {
    let sum: number;
    ProductService.products.forEach(element => {
      sum += element.price;
    });
  }
  public async getProductByID(id: number) {
    for (const kartItem of await this.getProducts()) {
      if (+kartItem.id === +id) {
        return kartItem;
      }
    }
    return null;
  }
  public async getShoppingKart() {
    const kart: Array<IShoppingKartItem> = [];
    const body: Array<any> = await this.http.get('http://localhost:3000/api/shoppingKart', { withCredentials: true })
      .toPromise() as Array<IShoppingKartItem>;
    for (const product of body) {
      product.product = await this.getProductByID(product.productId);
      kart.push(product);
    }
    return kart;
  }
  public async getShoppingKartLength() {
    let count = 0;
    for (const kartItem of (await this.getShoppingKart())) {
      count += kartItem.count;
    }
    return count;
  }
  public getProductTotal(kartItem: IShoppingKartItem): number {
    return kartItem.product.discontPrice * kartItem.count;
  }
  public async getGrandTotal() {
    const kart = await this.getShoppingKart();
    let total = 0;
    for (const kartItem of kart) {
      total += await this.getProductTotal(kartItem);
    }
    return total;
  }
  public async addProduct(newProduct: IProduct) {
    await this.http.get('http://localhost:3000/api/shoppingKart/add/' + newProduct.id, { withCredentials: true }).toPromise();
    this.onKartUpdate();
  }
  public async removeProduct(oldProduct: IProduct) {
    await this.http.get('http://localhost:3000/api/shoppingKart/remove/' + oldProduct.id, { withCredentials: true }).toPromise();
    this.onKartUpdate();
  }
  public async resetKart() {
    await this.http.get('http://localhost:3000/api/shoppingKart/reset', { withCredentials: true }).toPromise();
    this.onKartUpdate();
  }
}
