import { useState, useContext, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { ContextValue, Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../Components/CheckoutSteps";

interface ShippingInterface {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function ShippingScreen() {
  const navigate = useNavigate();

  const contextValue = useContext<ContextValue | null>(Store);
  if (!contextValue) throw new Error("Store context not found");
  const { state, dispatch: ctxDispatch } = contextValue;
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [shipping, setShipping] = useState(
    shippingAddress || {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    }
  );
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [navigate, userInfo]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: shipping,
    });
    localStorage.setItem("shippingAddress", JSON.stringify(shipping));
    navigate("/payment");
  };
  return (
    <>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="small-container container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={shipping.fullName}
              onChange={(e) => {
                setShipping((prevLogin: ShippingInterface) => ({
                  ...prevLogin,
                  fullName: e.target.value,
                }));
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={shipping.address}
              onChange={(e) => {
                setShipping((prevLogin: ShippingInterface) => ({
                  ...prevLogin,
                  address: e.target.value,
                }));
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={shipping.city}
              onChange={(e) => {
                setShipping((prevLogin: ShippingInterface) => ({
                  ...prevLogin,
                  city: e.target.value,
                }));
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={shipping.postalCode}
              onChange={(e) => {
                setShipping((prevLogin: ShippingInterface) => ({
                  ...prevLogin,
                  postalCode: e.target.value,
                }));
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={shipping.country}
              onChange={(e) => {
                setShipping((prevLogin: ShippingInterface) => ({
                  ...prevLogin,
                  country: e.target.value,
                }));
              }}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
