import { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import { Product } from "../types/Product";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getError } from "../utils";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { toast } from "react-toastify";

interface State {
  loading: boolean;
  loadingUpdate: boolean;
  error: string;
  loadingUpload: boolean;
  errorUpload: string;
}
type Action =
  | {
      type:
        | "FETCH_REQUEST"
        | "FETCH_SUCCESS"
        | "UPDATE_REQUEST"
        | "UPDATE_SUCCESS"
        | "UPLOAD_REQUEST"
        | "UPLOAD_SUCCESS";
    }
  | { type: "FETCH_FAIL" | "UPDATE_FAIL" | "UPLOAD_FAIL"; payload: string };

export default function ProductEditScreen() {
  const { id: productId } = useParams();
  const {
    state: { userInfo },
  } = useContext(Store);
  const [product, setProduct] = useState<Product>({
    _id: "",
    name: "",
    slug: "",
    category: "",
    image: "",
    price: 0,
    brand: "",
    countInStock: 0,
    description: "",
    rating: 0,
    numReviews: 0,
  });
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(
      (state: State, action: Action) => {
        switch (action.type) {
          case "FETCH_REQUEST":
            return { ...state, loading: true };
          case "FETCH_SUCCESS":
            return {
              ...state,
              loading: false,
            };
          case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
          case "UPDATE_REQUEST":
            return { ...state, loadingUpdate: true };
          case "UPDATE_SUCCESS":
            return { ...state, loadingUpdate: false };
          case "UPDATE_FAIL":
            return { ...state, loadingUpdate: false, error: action.payload };
          case "UPLOAD_REQUEST":
            return { ...state, loadingUpload: true, errorUpload: "" };
          case "UPLOAD_SUCCESS":
            return {
              ...state,
              loadingUpload: false,
              errorUpload: "",
            };
          case "UPLOAD_FAIL":
            return {
              ...state,
              loadingUpload: false,
              errorUpload: action.payload,
            };

          default:
            return state;
        }
      },
      {
        loading: true,
        loadingUpdate: false,
        error: "",
        loadingUpload: false,
        errorUpload: "",
      }
    );
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS" });
        setProduct(data);
      } catch (err) {
        if (err instanceof AxiosError)
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        else console.error(err);
      }
    };
    fetchData();
  }, [productId, userInfo]);
  const navigate = useNavigate();
  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/products/${productId}`, product, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      if (err instanceof AxiosError) {
        dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
        toast.error(getError(err));
      } else console.error(err);
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={SubmitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={product.name}
              onChange={(e) =>
                setProduct((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={product.slug}
              onChange={(e) =>
                setProduct((p) => ({ ...p, slug: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={product.price}
              onChange={(e) =>
                setProduct((p) => ({ ...p, price: Number(e.target.value) }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={product.image}
              onChange={(e) =>
                setProduct((p) => ({ ...p, image: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload File</Form.Label>
            <Form.Control
              type="file"
              onChange={async (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files !== null) {
                  const file = target.files[0];
                  const bodyFormData = new FormData();
                  bodyFormData.append("file", file);
                  try {
                    dispatch({ type: "UPLOAD_REQUEST" });
                    const { data } = await axios.post(
                      "/api/upload",
                      bodyFormData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                          authorization: `Bearer ${userInfo?.token}`,
                        },
                      }
                    );
                    dispatch({ type: "UPLOAD_SUCCESS" });

                    toast.success("Image uploaded successfully");
                    setProduct((p) => ({ ...p, image: data.url }));
                  } catch (err) {
                    if (err instanceof AxiosError) {
                      toast.error(getError(err));
                      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
                    } else console.error(err);
                  }
                } else {
                  toast.error("Please select an image file");
                  return;
                }
              }}
            />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={product.category}
              onChange={(e) =>
                setProduct((p) => ({ ...p, category: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={product.brand}
              onChange={(e) =>
                setProduct((p) => ({ ...p, brand: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={product.countInStock}
              onChange={(e) =>
                setProduct((p) => ({
                  ...p,
                  countInStock: Number(e.target.value),
                }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={product.description}
              onChange={(e) =>
                setProduct((p) => ({ ...p, description: e.target.value }))
              }
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}{" "}
          </div>
        </Form>
      )}
    </Container>
  );
}
