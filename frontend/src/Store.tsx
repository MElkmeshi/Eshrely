import { createContext, useReducer, ReactNode } from "react";
import { ProductInterface } from "./types";
// Define the state type
interface State {
  cart: {
    cartItems: ProductInterface[];
  };
}
interface Action {
  type: string;
  payload: ProductInterface;
}
export interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}
const thelocalstorge = localStorage.getItem("cartItems");
export const Store = createContext<ContextValue | null>(null);
const initialState: State = {
  cart: {
    cartItems: thelocalstorge ? JSON.parse(thelocalstorge) : [],
  },
};

function reducer(state: State, action: Action): State {
  const newItem: ProductInterface = action.payload;
  const existItem = state.cart.cartItems.find(
    (item) => item._id === newItem._id
  );
  const cartItems = existItem
    ? state.cart.cartItems.map((item) =>
        item._id === existItem._id ? newItem : item
      )
    : [...state.cart.cartItems, newItem];
  switch (action.type) {
    case "CART_ADD_ITEM":
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case "CART_REMOVE_ITEM":
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: state.cart.cartItems.filter(
            (item) => item._id !== action.payload._id
          ),
        },
      };
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
