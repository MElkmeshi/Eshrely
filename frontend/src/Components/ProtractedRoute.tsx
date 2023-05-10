import { Navigate } from "react-router-dom";
import { Store } from "../Store";
import { useContext } from "react";

interface Props {
  children: JSX.Element;
}

export default function ProtractedRoute({ children }: Props) {
  const {
    state: { userInfo },
  } = useContext(Store);
  return userInfo ? children : <Navigate to="/signin" />;
}
