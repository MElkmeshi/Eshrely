import HomeScreen from "./Screens/HomeScreen";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ProductScreen from "./Screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "react-toastify/dist/ReactToastify.css";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import { ToastContainer } from "react-toastify";
import { LinkContainer } from "react-router-bootstrap";
import { Store, ContextValue } from "./Store";
import { useContext } from "react";
import CartScreen from "./Screens/CartScreen";
import SigninScreen from "./Screens/SigninScreen";
import { NavDropdown } from "react-bootstrap";
import ShippingScreen from "./Screens/ShippingScreen";

function App() {
  const contextValue = useContext<ContextValue | null>(Store);
  if (!contextValue) throw new Error("Store context not found");
  const { state, dispatch: ctxDispatch } = contextValue;
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("cartItems");
  };
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand href="#home">Eshrely</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce(
                        (a, c) => a + (c.quantity ? c.quantity : 0),
                        0
                      )}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />}></Route>
              <Route path="/product/:slug" element={<ProductScreen />}></Route>
              <Route path="/cart" element={<CartScreen />}></Route>
              <Route path="/signin" element={<SigninScreen />}></Route>
              <Route path="/register" element={<div>Register</div>}></Route>
              <Route path="/shipping" element={<ShippingScreen />}></Route>
            </Routes>
          </Container>
        </main>
        <footer className="text-center">All Rights</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
