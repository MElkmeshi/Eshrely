import HomeScreen from "./Screens/HomeScreen";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ProductScreen from "./Screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "react-toastify/dist/ReactToastify.css";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import { ToastContainer, toast } from "react-toastify";
import { LinkContainer } from "react-router-bootstrap";
import { Store } from "./Store";
import { useContext, useState, useEffect } from "react";
import CartScreen from "./Screens/CartScreen";
import SigninScreen from "./Screens/SigninScreen";
import { Button, NavDropdown } from "react-bootstrap";
import ShippingScreen from "./Screens/ShippingScreen";
import SignupScreen from "./Screens/SignupScreen";
import PaymentMethodScreen from "./Screens/PaymentScreen";
import PlaceOrderScreen from "./Screens/PlaceOrderScreen";
import OrderScreen from "./Screens/OrderScreen";
import OrderHistoryScreen from "./Screens/OrderHistoryScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import { getError } from "./utils";
import axios, { AxiosError } from "axios";
import SearchBox from "./Components/SearchBox";
import SearchScreen from "./Screens/SearchScreen";
import ProtractedRoute from "./Components/ProtractedRoute";
import AdminRoute from "./Components/AdminRoute";
import DashboardScreen from "./Screens/DashboardScreen";
import ProductListScreen from "./Screens/ProductListScreen";

function App() {
  const {
    state: { cart, userInfo },
    dispatch: ctxDispatch,
  } = useContext(Store);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        if (err instanceof AxiosError) toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand href="#home">Eshrely</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
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
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/userlist">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{
                    pathname: "/search",
                    search: `?category=${category}`,
                  }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/shipping"
                element={
                  <ProtractedRoute>
                    <ShippingScreen />
                  </ProtractedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtractedRoute>
                    <PaymentMethodScreen />
                  </ProtractedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtractedRoute>
                    <ProfileScreen />
                  </ProtractedRoute>
                }
              />
              <Route
                path="/placeorder"
                element={
                  <ProtractedRoute>
                    <PlaceOrderScreen />
                  </ProtractedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtractedRoute>
                    <OrderScreen />
                  </ProtractedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtractedRoute>
                    <OrderHistoryScreen />
                  </ProtractedRoute>
                }
              />
              {/*Admin Router*/}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="//admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              />
            </Routes>
          </Container>
        </main>
        <footer className="text-center">All Rights</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
