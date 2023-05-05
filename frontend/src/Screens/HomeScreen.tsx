import axios from "axios";
import { useEffect, useReducer } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../Components/Product";
import { AppAction, StateProductsPage } from "../types";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";

function Home() {
  const [{ loading, error, products }, dispatch] = useReducer(
    (state: StateProductsPage, action: AppAction) => {
      switch (action.type) {
        case "FETCH_REQUEST":
          return { ...state, loading: true };
        case "FETCH_SUCCESS":
          return { ...state, loading: false, products: action.payload };
        case "FETCH_FAIL":
          return { ...state, loading: false, error: action.payload };
        default:
          return state;
      }
    },
    {
      products: [],
      loading: true,
      error: "",
    } as StateProductsPage
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" } as AppAction);
      try {
        const result = await axios.get("/api/products");
        console.log(result.data);
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
      <Helmet>
        <title>Eshrely</title>
      </Helmet>
      <h1>Latest Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
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
