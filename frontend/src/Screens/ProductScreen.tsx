import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useReducer, useContext } from "react";
import { AppActionOneProductPage, StateOneProductPage } from "../types";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Rating from "../Components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { getError } from "../utils";
import { Store, ContextValue } from "../Store";

function Product() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [{ loading, error, product }, dispatch] = useReducer(
    (state: StateOneProductPage, action: AppActionOneProductPage) => {
      switch (action.type) {
        case "FETCH_REQUEST":
          return { ...state, loading: true };
        case "FETCH_SUCCESS":
          return { ...state, product: action.payload, loading: false };
        case "FETCH_FAIL":
          return { ...state, loading: false, error: action.payload };
        default:
          return state;
      }
    },
    {
      product: {},
      loading: true,
      error: "",
    } as StateOneProductPage
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" } as AppActionOneProductPage);
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data,
        } as AppActionOneProductPage);
      } catch (err: unknown) {
        if (axios.isAxiosError(err))
          dispatch({
            type: "FETCH_FAIL",
            payload: getError(err),
          } as AppActionOneProductPage);
      }
    };
    fetchData();
  }, [slug]);

  const contextValue = useContext<ContextValue | null>(Store);
  if (!contextValue) {
    throw new Error("Store context not found");
  }
  const { state, dispatch: cxtDispatch } = contextValue;
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity =
      existItem && existItem.quantity ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    cxtDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Row>
      <Col md={6}>
        <img className="img-large" src={product.image} alt={product.name}></img>
      </Col>
      <Col md={3}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <h1>{product.name}</h1>
          </ListGroup.Item>
          <ListGroup.Item>
            <Rating
              rating={product.rating}
              numReviews={product.numReviews}
            ></Rating>
          </ListGroup.Item>
          <ListGroup.Item>Pirce : ${product.price}</ListGroup.Item>
          <ListGroup.Item>
            Description:
            <p>{product.description}</p>
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>${product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg="success">In Stock</Badge>
                    ) : (
                      <Badge bg="danger">Unavailable</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button onClick={addToCartHandler} variant="primary">
                      Add to Cart
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Product;
