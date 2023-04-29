import { useParams } from "react-router-dom";

function Product() {
  const { slug } = useParams();
  return <div>{slug}</div>;
}
export default Product;
