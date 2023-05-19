import axios, { AxiosError } from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { Order } from "../types/Order";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

interface OrderState {
  loading: boolean;
  error: string;
  order: Order;
  loadingDeliver: boolean;
  successDeliver: boolean;
  loadingPay: boolean;
  successPay: boolean;
}

type Action =
  | {
      type:
        | "FETCH_REQUEST"
        | "DELIVER_REQUEST"
        | "DELIVER_SUCCESS"
        | "DELIVER_RESET"
        | "DELIVER_FAIL"
        | "PAY_REQUEST"
        | "PAY_SUCCESS"
        | "PAY_RESET"
        | "PAY_FAIL";
    }
  | {
      type: "FETCH_SUCCESS";
      payload: Order;
    }
  | {
      type: "FETCH_FAIL";
      payload: string;
    };

export default function OrderScreen() {
  const {
    state: { userInfo },
  } = useContext(Store);
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      loadingDeliver,
      successDeliver,
      loadingPay,
      successPay,
    },
    dispatch,
  ] = useReducer(
    (state: OrderState, action: Action) => {
      switch (action.type) {
        case "FETCH_REQUEST":
          return { ...state, loading: true };
        case "FETCH_FAIL":
          return { ...state, loading: false, error: action.payload };
        case "FETCH_SUCCESS":
          return { ...state, loading: false, order: action.payload };
        case "DELIVER_REQUEST":
          return { ...state, loadingDeliver: true };
        case "DELIVER_SUCCESS":
          return { ...state, loadingDeliver: false, successDeliver: true };
        case "DELIVER_RESET":
          return { ...state, loadingDeliver: false, successDeliver: false };
        case "DELIVER_FAIL":
          return { ...state, loadingDeliver: false };
        case "PAY_REQUEST":
          return { ...state, loadingPay: true };
        case "PAY_SUCCESS":
          return { ...state, loadingPay: false, successPay: true };
        case "PAY_RESET":
          return { ...state, loadingPay: false, successPay: false };
        case "PAY_FAIL":
          return { ...state, loadingPay: false };
        default:
          return state;
      }
    },
    {
      loading: true,
      order: {} as Order,
      error: "",
      loadingDeliver: false,
      successDeliver: false,
      loadingPay: false,
      successPay: false,
    } as OrderState
  );

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${(userInfo || { token: "" }).token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        if (err instanceof AxiosError) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        } else {
          console.log(err);
        }
      }
    };

    if (!userInfo) {
      return navigate("/login");
    }
    if (
      !order._id ||
      successDeliver ||
      successPay ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    }
  }, [order, userInfo, orderId, successDeliver, navigate, successPay]);
  const deliverHandler = async () => {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      await axios.put(
        `/api/orders/${orderId}/deliver`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS" });
      toast.success("Order delivered successfully");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(getError(err));
      } else {
        console.log(err);
      }
      dispatch({ type: "DELIVER_FAIL" });
    }
  };
  const payHandler = async () => {
    try {
      dispatch({ type: "PAY_REQUEST" });
      await axios.put(
        `/api/orders/${orderId}/pay`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      dispatch({ type: "PAY_SUCCESS" });
      toast.success("Order paid successfully");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(getError(err));
      } else {
        console.log(err);
      }
      dispatch({ type: "PAY_FAIL" });
    }
  };
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt.toString()}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt.toString()}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
              {userInfo?.isAdmin && !order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  {loadingPay && <LoadingBox></LoadingBox>}
                  <div className="d-grid">
                    <Button type="button" onClick={payHandler}>
                      Pay Order
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  <div className="d-grid">
                    <Button type="button" onClick={deliverHandler}>
                      Deliver Order
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
