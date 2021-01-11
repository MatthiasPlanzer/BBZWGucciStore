export interface IShoppingKartItem {
  count: number;
  productId: number;
  product?: IProduct;
}
export interface IFormValidationResponse {
  invalid: Array<string>;
}
export interface IProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  discontPrice: number;
}
