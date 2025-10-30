import React, { useState } from "react";
import Rollo from "./Rollo.jsx";
import "./Album.css";

export default function Album() {
  const [albums, setAlbums] = useState([
    {
      id: "all-images",
      name: "Todas las imágenes",
      images: [
        "/Imagenes/Burro.webp",
        "/Imagenes/MonaLisa.webp",
        "/Imagenes/tinkerbell.webp"
      ],
      isDefault: true
    },
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

  // Función para agregar imágenes que actualiza ambos álbumes
  const addImagesToAlbums = (files, targetAlbumIndex = null) => {
    setAlbums(prevAlbums => {
      const newAlbums = [...prevAlbums];
      const allImagesAlbum = newAlbums.find(album => album.id === "all-images");
      
      // Procesar cada archivo
      files.forEach(file => {
        const imageData = {
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // Agregar a "Todas las imágenes" (si no existe)
        const existingInAll = allImagesAlbum.images.some(img => 
          img.name === file.name && img.size === file.size
        );
        if (!existingInAll) {
          allImagesAlbum.images.push(imageData);
        }

        // Si es un álbum específico (y no es "Todas las imágenes"), agregar allí también
        if (targetAlbumIndex !== null && targetAlbumIndex >= 0) {
          const targetAlbum = newAlbums[targetAlbumIndex];
          if (!targetAlbum.id || targetAlbum.id !== "all-images") {
            const existingInTarget = targetAlbum.images.some(img => 
              img.name === file.name && img.size === file.size
            );
            if (!existingInTarget) {
              targetAlbum.images.push({
                ...imageData,
                id: imageData.id
              });
            }
          }
        }
      });

      return newAlbums;
    });
  };

  // Eliminar imagen de un álbum específico
  const handleDeleteImage = (albumIndex, imageIndex) => {
    setAlbums(prevAlbums => {
      const newAlbums = [...prevAlbums];
      const album = newAlbums[albumIndex];
      const deletedImage = album.images[imageIndex];
      
      // Eliminar la imagen del álbum actual
      album.images.splice(imageIndex, 1);
      
      // Si NO es el álbum "Todas las imágenes", también eliminarla de allí
      if (!album.id || album.id !== "all-images") {
        const allImagesAlbum = newAlbums.find(a => a.id === "all-images");
        if (allImagesAlbum) {
          const indexInAll = allImagesAlbum.images.findIndex(
            img => img.id === deletedImage.id || img.name === deletedImage.name
          );
          if (indexInAll !== -1) {
            allImagesAlbum.images.splice(indexInAll, 1);
          }
        }
      } else {
        // Si ES "Todas las imágenes", eliminar de todos los álbumes
        newAlbums.forEach(otherAlbum => {
          if (!otherAlbum.id || otherAlbum.id !== "all-images") {
            const indexInOther = otherAlbum.images.findIndex(
              img => img.id === deletedImage.id || img.name === deletedImage.name
            );
            if (indexInOther !== -1) {
              otherAlbum.images.splice(indexInOther, 1);
            }
          }
        });
      }
      
      return newAlbums;
    });
  };

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
    const albumToDelete = albums[index];
    
    // Prevenir eliminar el álbum por defecto
    if (albumToDelete.id === "all-images") {
      alert("No se puede eliminar el álbum 'Todas las imágenes'");
      return;
    }

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
          {albums.map((album, i) => (
            <li 
              key={i} 
              className={i === currentAlbum ? "active" : ""}
              data-default={album.isDefault}
            >
              <div className="album-name" onClick={() => setCurrentAlbum(i)}>
                {album.name}
                {album.id === "all-images" && (
                  <span className="album-badge"></span>
                )}
              </div>
              {(!album.id || album.id !== "all-images") && (
                <button
                  className="delete-album"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAlbum(i);
                  }}
                >
                  🗑
                </button>
              )}
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
            currentAlbumIndex={currentAlbum}
            albums={albums}
            setAlbums={setAlbums}
            onAddImages={(files) => addImagesToAlbums(files, currentAlbum)}
            onDeleteImage={(imageIndex) => handleDeleteImage(currentAlbum, imageIndex)}
          />
        ) : (
          <p>No hay álbumes disponibles.</p>
        )}
      </div>
    </div>
  );
}