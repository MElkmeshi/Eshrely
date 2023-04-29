import axios from "axios";
import { useEffect, useReducer } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../Components/Product";
import { ProductInterface } from "../types";

interface FetchRequestAction {
  type: "FETCH_REQUEST";
}
interface FetchSuccessAction {
  type: "FETCH_SUCCESS";
  payload: ProductInterface[];
}
interface FetchFailAction {
  type: "FETCH_FAIL";
  payload: string;
}
type AppAction = FetchRequestAction | FetchSuccessAction | FetchFailAction;

interface AppState {
  products: ProductInterface[];
  loading: boolean;
  error: string;
}

const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Home() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  } as AppState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" } as AppAction);
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data } as AppAction);
      } catch (err: unknown) {
        if (axios.isAxiosError(err))
          dispatch({ type: "FETCH_FAIL", payload: err.message } as AppAction);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={8} md={4} lg={3}>
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}
export default Home;
