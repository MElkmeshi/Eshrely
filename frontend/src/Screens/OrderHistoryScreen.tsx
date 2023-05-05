import { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ContextValue, Store } from "../Store";
import { getError } from "../utils";
import MessageBox from "../Components/MessageBox";
import LoadingBox from "../Components/LoadingBox";
import { Button } from "react-bootstrap";

interface Order {
  _id: string;
  orderItems: {
    _id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  user: string;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  createdAt: Date;
}

interface OrderHistoryState {
  loading: boolean;
  error: string;
  orders: Order[];
}

interface Action1 {
  type: "FETCH_REQUEST";
}
interface Action2 {
  type: "FETCH_SUCCESS";
  payload: Order[];
}
interface Action3 {
  type: "FETCH_FAIL";
  payload: string;
}
type Action = Action1 | Action2 | Action3;

export default function OrderHistoryScreen() {
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(
    (state: OrderHistoryState, action: Action) => {
      switch (action.type) {
        case "FETCH_REQUEST":
          return { ...state, loading: true };
        case "FETCH_FAIL":
          return { ...state, loading: false, error: action.payload };
        case "FETCH_SUCCESS":
          return { ...state, loading: false, orders: action.payload };
        default:
          return state;
      }
    },
    {
      loading: true,
      orders: [] as Order[],
      error: "",
    } as OrderHistoryState
  );
  const contextValue = useContext<ContextValue | null>(Store);
  if (!contextValue) throw new Error("Store context not found");
  const { state } = contextValue;
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          {
            headers: {
              Authorization: `Bearer ${(userInfo || { token: "" }).token}`,
            },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        if (error instanceof AxiosError) {
          dispatch({
            type: "FETCH_FAIL",
            payload: getError(error),
          });
        } else {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.toString().substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid
                    ? order.paidAt.toString().substring(0, 10)
                    : "No"}
                </td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.toString().substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
