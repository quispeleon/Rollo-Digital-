import React from "react";
import "./Header.css";

function Header() {
   return (
    <header className="header">
      <div className="header-content">
        <h1>Rollo Digital</h1>
        <nav>
          <ul>
            <li><a href="#albums">Álbumes</a></li>
            <li><a href="#about">Acerca</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
