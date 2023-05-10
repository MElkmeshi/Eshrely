import { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";
import MessageBox from "../Components/MessageBox";
import LoadingBox from "../Components/LoadingBox";
import { Button } from "react-bootstrap";
import { Order } from "../types/Order";

interface OrderHistoryState {
  loading: boolean;
  error: string;
  orders: Order[];
}

type Action =
  | {
      type: "FETCH_REQUEST";
    }
  | {
      type: "FETCH_SUCCESS";
      payload: Order[];
    }
  | {
      type: "FETCH_FAIL";
      payload: string;
    };

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
  const {
    state: { userInfo },
  } = useContext(Store);

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
