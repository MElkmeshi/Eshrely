import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useState, useContext, useEffect } from "react";
import { Store, ContextValue } from "../Store";
import axios, { AxiosError } from "axios";
import { getError } from "../utils";

interface loginInterface {
  email: string;
  password: string;
}

export default function SigninScreen() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  } as loginInterface);
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const contextValue = useContext<ContextValue | null>(Store);
  if (!contextValue) {
    throw new Error("Store context not found");
  }
  const { state, dispatch: cxtDispatch } = contextValue;
  const { userInfo } = state;
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
        email: login.email,
        password: login.password,
      });
      cxtDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      if (error instanceof AxiosError) toast.error(getError(error));
      else console.log(error);
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h3 className="my-3">Sign In</h3>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            required
            placeholder="Enter email"
            onChange={(e) => {
              setLogin((prevLogin: loginInterface) => ({
                ...prevLogin,
                email: e.target.value,
              }));
            }}
            value={login.email}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Enter Password"
            onChange={(e) => {
              setLogin((prevLogin: loginInterface) => ({
                ...prevLogin,
                password: e.target.value,
              }));
            }}
            value={login.password}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
