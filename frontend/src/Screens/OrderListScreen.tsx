import { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import axios, { AxiosError } from "axios";
import { Order } from "../types/Order";
import { getError } from "../utils";
import MessageBox from "../Components/MessageBox";
import LoadingBox from "../Components/LoadingBox";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface State {
  loading: boolean;
  error: string;
  orders: Order[];
  loadingDelete: boolean;
  successDelete: boolean;
}

type Action =
  | {
      type:
        | "FETCH_REQUEST"
        | "DELETE_REQUEST"
        | "DELETE_SUCCESS"
        | "DELETE_FAIL"
        | "DELETE_RESET";
    }
  | {
      type: "FETCH_SUCCESS";
      payload: Order[];
    }
  | {
      type: "FETCH_FAIL";
      payload: string;
    };

export default function OrderListScreen() {
  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useContext(Store);
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(
      (state: State, action: Action) => {
        switch (action.type) {
          case "FETCH_REQUEST":
            return { ...state, loading: true };
          case "FETCH_SUCCESS":
            return { ...state, loading: false, orders: action.payload };
          case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
          case "DELETE_REQUEST":
            return { ...state, loadingDelete: true };
          case "DELETE_SUCCESS":
            return { ...state, loadingDelete: false, successDelete: true };
          case "DELETE_FAIL":
            return { ...state, loadingDelete: false };
          case "DELETE_RESET":
            return { ...state, successDelete: false, loadingDelete: false };
          default:
            return state;
        }
      },
      {
        loading: true,
        orders: [],
        error: "",
        loadingDelete: false,
        successDelete: false,
      }
    );
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders`, {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        if (err instanceof AxiosError) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        } else {
          console.error(err);
        }
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order: Order) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("order deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(getError(err));
        }
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                <td>{order.user ? order.user.name : "DELETED USER"}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
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
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
