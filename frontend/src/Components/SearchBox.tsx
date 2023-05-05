import { useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  return (
    <Form
      className="d-flex me-auto"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(query ? `/search?query=${query}` : "/search");
      }}
    >
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
