import { Link } from "react-router-dom";
import { ProductInterface } from "../types";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "./Rating";

interface ProductProps {
  product: ProductInterface;
}

function Product({ product }: ProductProps) {
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
        <Button> Add to cart</Button>
      </Card.Body>
    </Card>
  );
}
export default Product;
