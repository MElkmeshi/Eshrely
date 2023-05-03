import { createContext, useReducer, ReactNode } from "react";
import { ProductInterface } from "./types";
// Define the state type
interface LoginInterface {
  email: string;
  isAdmin: boolean;
  name: string;
  token: string;
  _id: string;
}
interface ShippingInterface {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
interface Action1 {
  type: "CART_ADD_ITEM" | "CART_REMOVE_ITEM";
  payload: ProductInterface;
}
interface Action2 {
  type: "USER_SIGNIN";
  payload: LoginInterface;
}
interface Action3 {
  type: "USER_SIGNOUT";
}
interface Action4 {
  type: "SAVE_SHIPPING_ADDRESS";
  payload: ShippingInterface;
}
interface Action5 {
  type: "SAVE_PAYMENT_METHOD";
  payload: string;
}
type Action = Action1 | Action2 | Action3 | Action4 | Action5;

interface State {
  userInfo: LoginInterface | null;
  cart: {
    cartItems: ProductInterface[];
    shippingAddress: ShippingInterface | null;
    paymentMethod: string | null;
    totalPrice?: number;
    taxPrice?: number;
    shippingPrice?: number;
    itemsPrice?: number;
  };
}
export interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}
const thelocalcart = localStorage.getItem("cartItems");
const thelocaluser = localStorage.getItem("userInfo");
const thelocalshipping = localStorage.getItem("shippingAddress");
const thelocalpayment = localStorage.getItem("paymentMethod");
export const Store = createContext<ContextValue | null>(null);
const initialState: State = {
  userInfo: thelocaluser ? JSON.parse(thelocaluser) : null,
  cart: {
    cartItems: thelocalcart ? JSON.parse(thelocalcart) : [],
    shippingAddress: thelocalshipping ? JSON.parse(thelocalshipping) : {},
    paymentMethod: thelocalpayment ? thelocalpayment : null,
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload as ProductInterface;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload as LoginInterface };
    case "USER_SIGNOUT":
      return {
        cart: { cartItems: [], shippingAddress: null, paymentMethod: null },
        userInfo: null,
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case "SAVE_PAYMENT_METHOD": {
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    }
    default:
      return state;
  }
}
interface Props {
  children: ReactNode;
}
export function StoreProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value: ContextValue = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
