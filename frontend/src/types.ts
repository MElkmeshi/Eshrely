import { Product } from "./types/Product";

export interface ProductInterface {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  countInStock: number;
  brand: string;
  rating: number;
  numReviews: number;
  description: string;
}
interface FetchRequestAction {
  type: "FETCH_REQUEST";
}
interface FetchSuccessAction {
  type: "FETCH_SUCCESS";
  payload: ProductInterface[];
}
interface FetchFailAction {
  type: "FETCH_FAIL";
  payload: string;
}
export type AppAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailAction;

export interface StateProductsPage {
  products: ProductInterface[];
  loading: boolean;
  error: string;
}
export interface StateOneProductPage {
  product: Product;
  loading: boolean;
  error: string;
}

interface FetchSuccessActionOneProductPage {
  type: "FETCH_SUCCESS";
  payload: Product;
}
export type AppActionOneProductPage =
  | FetchSuccessActionOneProductPage
  | FetchFailAction
  | FetchRequestAction;
