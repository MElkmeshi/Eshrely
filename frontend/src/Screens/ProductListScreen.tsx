import { useReducer, useEffect, useContext } from "react";
import { Product } from "../types/Product";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import axios, { AxiosError } from "axios";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { getError } from "../utils";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";

interface State {
  loading: boolean;
  products: Product[];
  page: number;
  pages: number;
  error: string;
  loadingCreate: boolean;
  loadingDelete: boolean;
  successDelete: boolean;
}
type Action =
  | {
      type:
        | "FETCH_REQUEST"
        | "CREATE_REQUEST"
        | "CREATE_SUCCESS"
        | "CREATE_FAIL"
        | "DELETE_REQUEST"
        | "DELETE_SUCCESS"
        | "DELETE_REST"
        | "DELETE_FAIL";
    }
  | { type: "FETCH_SUCCESS"; payload: State }
  | { type: "FETCH_FAIL"; payload: string };

export default function ProductListScreen() {
  const [
    {
      loading,
      products,
      pages,
      error,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case "FETCH_REQUEST":
          return { ...state, loading: true };
        case "FETCH_SUCCESS":
          return {
            ...state,
            products: action.payload.products,
            page: action.payload.page,
            pages: action.payload.pages,
            loading: false,
          };
        case "FETCH_FAIL":
          return { ...state, loading: false, error: action.payload };
        case "CREATE_REQUEST":
          return { ...state, loadingCreate: true };
        case "CREATE_SUCCESS":
          return { ...state, loadingCreate: false };
        case "CREATE_FAIL":
          return { ...state, loadingCreate: false };
        case "DELETE_REQUEST":
          return { ...state, loadingDelete: true, successDelete: false };
        case "DELETE_SUCCESS":
          return { ...state, loadingDelete: false, successDelete: true };
        case "DELETE_FAIL":
          return { ...state, loadingDelete: false, successDelete: false };
        case "DELETE_REST":
          return { ...state, loadingDelete: false, successDelete: false };
        default:
          return state;
      }
    },
    {
      loading: true,
      products: [],
      page: 0,
      pages: 0,
      error: "",
      loadingCreate: false,
      loadingDelete: false,
      successDelete: false,
    }
  );
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page: number = Number(sp.get("page")) || 1;
  const {
    state: { userInfo },
  } = useContext(Store);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        if (err instanceof AxiosError)
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        else console.log(err);
      }
    };
    if (successDelete) dispatch({ type: "DELETE_REST" });
    else {
      fetchData();
    }
  }, [userInfo, page, successDelete]);
  const createHandler = async () => {
    if (window.confirm("Are you sure to create?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post(
          "/api/products",
          {},
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
          }
        );
        toast.success("product created successfully");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        if (err instanceof AxiosError) toast.error(getError(err));
        else toast.error("Something went wrong");
        dispatch({
          type: "CREATE_FAIL",
        });
      }
    }
  };
  const deleteHandler = async (product: Product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("product deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(getError(err));
          dispatch({
            type: "DELETE_FAIL",
          });
        } else {
          toast.error("Something went wrong");
          console.error(err);
        }
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Create Product
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
