import Alert from "react-bootstrap/Alert";
type Props = {
  variant?: string;
  children: string | JSX.Element | JSX.Element[];
};
export default function MessageBox({ variant, children }: Props) {
  return <Alert variant={"danger"}>{children}</Alert>;
}
