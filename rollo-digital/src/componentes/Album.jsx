import React, { useState } from "react";
import Rollo from "./Rollo.jsx";
import "./Album.css";

export default function Album() {
  const [albums, setAlbums] = useState([
    {
      name: "Vacaciones",
      images: [
        "/Imagenes/Burro.webp",
        "/Imagenes/MonaLisa.webp",
        "/Imagenes/tinkerbell.webp"
      ]
    },
    { name: "Familia", images: [] }
  ]);

  const [currentAlbum, setCurrentAlbum] = useState(0);

  // Agregar un nuevo álbum
  const handleAddAlbum = () => {
    const name = prompt("Nombre del álbum:");
    if (name) {
      setAlbums([...albums, { name, images: [] }]);
      setCurrentAlbum(albums.length);
    }
  };

  // Eliminar un álbum
  const handleDeleteAlbum = (index) => {
    setAlbums(albs => {
      const newAlbums = [...albs];
      newAlbums.splice(index, 1);

      // Ajustar currentAlbum si se eliminó el actual o el último
      if (currentAlbum >= newAlbums.length) {
        setCurrentAlbum(newAlbums.length - 1);
      }

      return newAlbums;
    });
  };

  return (
    <div className="album-container">
      {/* Barra lateral */}
      <div className="sidebar">
        <h2>Mis Álbumes</h2>
        <ul>
          {albums.map((a, i) => (
            <li key={i} className={i === currentAlbum ? "active" : ""}>
              <div className="album-name" onClick={() => setCurrentAlbum(i)}>
                {a.name}
              </div>
              <button
                className="delete-album"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAlbum(i);
                }}
              >
                🗑
              </button>
            </li>
          ))}
          <li className="add-album" onClick={handleAddAlbum}>
            Nuevo Álbum
          </li>
        </ul>
      </div>

      {/* Rollo principal */}
      <div className="main-rollo">
        {albums.length > 0 ? (
          <Rollo
            images={albums[currentAlbum].images}
            setAlbums={setAlbums}
            currentAlbum={currentAlbum}
          />
        ) : (
          <p>No hay álbumes disponibles.</p>
        )}
      </div>
    </div>
  );
}
