import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AvailableQuantityContext } from '../AvailableQuantityContext';

export const Productos = ({ allProducts, setAllProducts, total, setTotal }) => {
  const { availableQuantity, setAvailableQuantity } = useContext(AvailableQuantityContext);
  const [movies, setMovies] = useState([]);
  const defaultPrice = 10;

  useEffect(() => {
    async function fetchMovies() {
      try {
        const movieResponse = await axios.get(
          'https://api.themoviedb.org/3/search/movie',
          {
            params: {
              api_key: 'd738c5cc1dcf80efed561b5a678ed8cb',
              query: 'Harry Potter',
              language: 'es',
            },
          }
        );

        const moviesWithQuantity = movieResponse.data.results.map((movie) => ({
          ...movie,
          availableQuantity: 15,
          quantity: 1,
          originalQuantity: 100,
        }));

        setMovies(moviesWithQuantity);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    }

    fetchMovies();
  }, []); // Sin dependencias para que solo se ejecute una vez al montar el componente

  const onAddProductToCart = (movie) => {
    const storedQuantity = parseInt(localStorage.getItem(`quantity_${movie.id}`), 10);
    const nuevaCantidadTotal = availableQuantity - (storedQuantity || 1);

    if (nuevaCantidadTotal < 0) {
      alert('No puedes agregar más de este producto al carrito');
      return;
    }

    if (nuevaCantidadTotal === 0) {
      alert('Producto agotado');
    }

    setAvailableQuantity(nuevaCantidadTotal);

    const updatedMovies = movies.map((m) =>
      m.id === movie.id
        ? { ...m, availableQuantity: nuevaCantidadTotal, quantity: storedQuantity || 1 }
        : m
    );
    setMovies(updatedMovies);

    const existingProduct = allProducts.find((item) => item.id === movie.id);

    if (existingProduct) {
      const updatedProducts = allProducts.map((item) =>
        item.id === movie.id
          ? { ...item, quantity: item.quantity + (storedQuantity || 1) }
          : item
      );
      setAllProducts(updatedProducts);
    } else {
      const newProduct = {
        id: movie.id,
        nameProduct: movie.title,
        description: movie.overview,
        price: defaultPrice,
        quantity: storedQuantity || 1,
      };
      setAllProducts([...allProducts, newProduct]);
    }

    setTotal(total + defaultPrice * (storedQuantity || 1));

    // Guarda la nueva cantidad en localStorage
    localStorage.setItem(`quantity_${movie.id}`, (storedQuantity || 1).toString());
  };

  const onEmptyCart = () => {
    setAllProducts([]);
    setTotal(0);

    // Restablecer las tarjetas a su estado inicial
    const resetMovies = movies.map((movie) => ({
      ...movie,
      availableQuantity: movie.originalQuantity,
      quantity: 1,
    }));
    setMovies(resetMovies);

    // Eliminar solo la entrada de cantidad correspondiente a cada tarjeta en localStorage
    movies.forEach((movie) => {
      localStorage.removeItem(`quantity_${movie.id}`);
    });
  };

  return (
    <div className="App">
      <main>
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <br />
              <p>Precio: $50</p>
              <p>Cantidad disponible: {movie.availableQuantity}</p>
              <input
                type="number"
                placeholder="Cantidad personalizada"
                value={movie.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;

                  if (newQuantity > movie.availableQuantity) {
                    alert('No puedes agregar más de este producto al carrito');
                    return;
                  }

                  const updatedMovies = movies.map((m) =>
                    m.id === movie.id ? { ...m, quantity: newQuantity } : m
                  );

                  setMovies(updatedMovies);
                  // Guarda la nueva cantidad en localStorage
                  localStorage.setItem(`quantity_${movie.id}`, newQuantity.toString());
                }}
              />
              <br />
              <br />
              <button onClick={() => onAddProductToCart(movie)} className="post">
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </main>
      <button onClick={onEmptyCart}>Vaciar Carrito</button>
    </div>
  );
};

export default Productos;