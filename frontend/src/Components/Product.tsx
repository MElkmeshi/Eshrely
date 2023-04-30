import { Link } from "react-router-dom";
import { ProductInterface } from "../types";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { ContextValue, Store } from "../Store";

interface ProductProps {
  product: ProductInterface;
}

function Product({ product }: ProductProps) {
  const context = useContext<ContextValue | null>(Store);
  if (!context) {
    throw new Error("Store context not found");
  }
  const { state, dispatch: ctxDispatch } = context;
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (item: ProductInterface) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity =
      existItem && existItem.quantity ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...item,
        quantity,
      },
    });
  };
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img className="card-img-top" src={product.image} alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
