import { useContext, useState } from "react";
import { ContextValue, Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";

interface ProfileState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ProfileScreen() {
  const contextValue = useContext<ContextValue | null>(Store);
  if (!contextValue) throw new Error("Store context not found");
  const { state, dispatch: ctxDispatch } = contextValue;
  const { userInfo } = state;
  if (!userInfo) throw new Error("userInfo not found");
  const [profile, setProfile] = useState({
    name: (userInfo || { name: "" }).name,
    email: (userInfo || { email: "" }).email,
    password: "",
    confirmPassword: "",
  } as ProfileState);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { name, email } = profile;
      const password =
        profile.password === profile.confirmPassword ? profile.password : "";
      if (!password) {
        toast.error("Password and Confirm Password are not matched");
        return;
      }
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${(userInfo || { token: "" }).token}`,
          },
        }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      if (err instanceof AxiosError) toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={profile.name}
            onChange={(e) =>
              setProfile((prevProfile: ProfileState) => ({
                ...prevProfile,
                name: e.target.value,
              }))
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile((prevProfile: ProfileState) => ({
                ...prevProfile,
                email: e.target.value,
              }))
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={profile.password}
            onChange={(e) =>
              setProfile((prevProfile: ProfileState) => ({
                ...prevProfile,
                password: e.target.value,
              }))
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={profile.confirmPassword}
            onChange={(e) =>
              setProfile((prevProfile: ProfileState) => ({
                ...prevProfile,
                confirmPassword: e.target.value,
              }))
            }
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
