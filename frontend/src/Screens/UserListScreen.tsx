import { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import axios, { AxiosError } from "axios";
import { getError } from "../utils";
import MessageBox from "../Components/MessageBox";
import LoadingBox from "../Components/LoadingBox";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../types/User";

interface State {
  loading: boolean;
  error: string;
  users: User[];
  loadingDelete: boolean;
  successDelete: boolean;
}

type Action =
  | {
      type:
        | "FETCH_REQUEST"
        | "DELETE_REQUEST"
        | "DELETE_SUCCESS"
        | "DELETE_FAIL"
        | "DELETE_RESET";
    }
  | {
      type: "FETCH_SUCCESS";
      payload: User[];
    }
  | {
      type: "FETCH_FAIL";
      payload: string;
    };

export default function UserListScreen() {
  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useContext(Store);
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(
      (state: State, action: Action) => {
        switch (action.type) {
          case "FETCH_REQUEST":
            return { ...state, loading: true };
          case "FETCH_SUCCESS":
            return { ...state, loading: false, users: action.payload };
          case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
          case "DELETE_REQUEST":
            return { ...state, loadingDelete: true };
          case "DELETE_SUCCESS":
            return { ...state, loadingDelete: false, successDelete: true };
          case "DELETE_FAIL":
            return { ...state, loadingDelete: false };
          case "DELETE_RESET":
            return { ...state, successDelete: false, loadingDelete: false };
          default:
            return state;
        }
      },
      {
        loading: true,
        users: [],
        error: "",
        loadingDelete: false,
        successDelete: false,
      }
    );
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users`, {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        if (err instanceof AxiosError) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        } else {
          console.error(err);
        }
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user: User) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("user deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(getError(err));
        }
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>Admin</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "YES" : "NO"}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/admin/user/${user._id}`);
                    }}
                  >
                    Details
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
