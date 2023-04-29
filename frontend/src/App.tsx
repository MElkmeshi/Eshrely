import HomeScreen from "./Screens/HomeScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductScreen from "./Screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand href="#home">Eshrely</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />}></Route>
              <Route path="/product/:slug" element={<ProductScreen />}></Route>
              <Route path="/cart" element={<div>Cart</div>}></Route>
              <Route path="/signin" element={<div>Sign In</div>}></Route>
              <Route path="/register" element={<div>Register</div>}></Route>
            </Routes>
          </Container>
        </main>
        <footer className="text-center">All Rights</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
