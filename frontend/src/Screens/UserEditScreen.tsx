import axios, { AxiosError } from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../Components/LoadingBox";
import { User } from "../types/User";
import MessageBox from "../Components/MessageBox";
interface State {
  loading: boolean;
  error: string;
  loadingUpdate: boolean;
}

type Action =
  | {
      type:
        | "FETCH_REQUEST"
        | "FETCH_SUCCESS"
        | "UPDATE_REQUEST"
        | "UPDATE_SUCCESS"
        | "UPDATE_FAIL";
    }
  | {
      type: "FETCH_FAIL";
      payload: string;
    };

export default function UserEditScreen() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case "FETCH_REQUEST":
          return { ...state, loading: true };
        case "FETCH_SUCCESS":
          return { ...state, loading: false };
        case "FETCH_FAIL":
          return { ...state, loading: false, error: action.payload };
        case "UPDATE_REQUEST":
          return { ...state, loadingUpdate: true };
        case "UPDATE_SUCCESS":
          return { ...state, loadingUpdate: false };
        case "UPDATE_FAIL":
          return { ...state, loadingUpdate: false };
        default:
          return state;
      }
    },
    {
      loading: true,
      error: "",
      loadingUpdate: false,
    }
  );

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [user, setUser] = useState({} as User);
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setUser(data);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        if (err instanceof AxiosError) {
          dispatch({
            type: "FETCH_FAIL",
            payload: getError(err),
          });
        } else {
          console.error(err);
        }
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/users/${userId}`, user, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("User updated successfully");
      navigate("/admin/userlist");
    } catch (error) {
      if (error instanceof AxiosError) toast.error(getError(error));
      else console.error(error);
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit User ${userId}</title>
      </Helmet>
      <h1>Edit User {userId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={user.name}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={user.email}
              type="email"
              onChange={(e) =>
                setUser((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={user.isAdmin}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, isAdmin: e.target.checked }))
            }
          />

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
