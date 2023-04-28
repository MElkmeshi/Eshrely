import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useReducer } from "react";
interface Product {
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  countInStock: number;
  brand: string;
  rating: number;
  numReviews: number;
  description: string;
}

interface FetchRequestAction {
  type: "FETCH_REQUEST";
}
interface FetchSuccessAction {
  type: "FETCH_SUCCESS";
  payload: Product[];
}
interface FetchFailAction {
  type: "FETCH_FAIL";
  payload: string;
}
type AppActions = FetchRequestAction | FetchSuccessAction | FetchFailAction;

interface AppAction {
  type: "FETCH_FAIL" | "FETCH_SUCCESS" | "FETCH_REQUEST";
  payload?: any;
}

interface AppState {
  products: Product[];
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
      dispatch({ type: "FETCH_REQUEST" } as Action);
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
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
          products.map((product) => (
            <div className="product" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="product-info">
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
export default Home;
