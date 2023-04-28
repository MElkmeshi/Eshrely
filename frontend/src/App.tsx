import data from "./data";

function App() {
  return (
    <>
      <header style={{ backgroundColor: "black", padding: "1rem" }}>
        <a href="/">Eshrely</a>
      </header>
      <main>
        <h1>Products</h1>
        <div className="products">
          {data.products.map((product) => (
            <div className="product" key={product.slug}>
              <a href={`product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className="product-info">
                <a href={`product/${product.slug}`}>
                  <p>{product.name}</p>
                </a>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
