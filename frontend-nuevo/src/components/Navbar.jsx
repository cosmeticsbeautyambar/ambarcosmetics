import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold tracking-wider text-pink-600">AMBAR COSMETICS</Link>
      <div className="flex gap-6 font-medium">
        <Link to="/" className="hover:text-pink-600 transition">Inicio</Link>
        <Link to="/catalogo" className="hover:text-pink-600 transition">Catálogo</Link>
        <Link to="/carrito" className="hover:text-pink-600 transition">Carrito🛒</Link>
        <Link to="/admin" className="hover:text-pink-600 transition">Panel Admin</Link>
      </div>
    </nav>
  );
}