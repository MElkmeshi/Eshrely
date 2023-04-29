import Alert from "react-bootstrap/Alert";
import { ReactNode } from "react";

type Props = {
  variant?: string;
  children: ReactNode;
};

export default function MessageBox({ variant, children }: Props) {
  return <Alert variant={variant || "info"}>{children}</Alert>;
}
