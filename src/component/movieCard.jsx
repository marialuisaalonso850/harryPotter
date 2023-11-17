import React, { useState } from 'react';

const MovieCard = ({ product, onAddProductToCart }) => {
  const [customQuantity, setCustomQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setCustomQuantity(newQuantity);
  };

  return (
    <div className="movie-card">
      <img src={`https://image.tmdb.org/t/p/w185${product.poster_path}`} alt={product.title} />
      <h2>{product.title}</h2>
      <br />
      <p>Precio: $50</p>
      <p>Cantidad disponible: {product.availableQuantity}</p>
      <input
        type="number"
        placeholder="Cantidad personalizada"
        value={customQuantity}
        onChange={handleQuantityChange}
      />
      <br />
      <br />
      <button onClick={() => onAddProductToCart(customQuantity)} className="post">
        Agregar al carrito
      </button>
    </div>
  );
};

export default MovieCard;

