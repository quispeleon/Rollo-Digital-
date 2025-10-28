// src/components/Header.jsx
import React from "react";
import "./Header.css"; // estilos específicos del header

function Header() {
  return (
    <header className="header">
      <h1>Rollo Digital</h1>
      <nav>
        <ul>
          <li><a href="#albums">Álbumes</a></li>
          <li><a href="#about">Acerca</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
