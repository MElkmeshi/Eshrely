import Home from "./Components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./Components/Product";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";

function App() {
  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand href="#home">Eshrely</Navbar.Brand>
          </LinkContainer>
        </Container>
      </Navbar>
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/product/:slug" element={<Product />}></Route>
          <Route path="/cart" element={<div>Cart</div>}></Route>
          <Route path="/signin" element={<div>Sign In</div>}></Route>
          <Route path="/register" element={<div>Register</div>}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
