import React, { useState, useEffect, useRef } from "react";
import "./Rollo.css";

export default function Rollo() {
  // Álbumes
  const [albums, setAlbums] = useState([
    { name: "Vacaciones", images: [
      "https://pbs.twimg.com/media/D91nrqJX4AUgbjQ?format=jpg&name=large",
      "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2021/06/sirenita-2376873.jpg?tf=3840x685.jpg",
      "https://cdn.shopify.com/s/files/1/0469/3927/5428/files/Screenshot_2024-08-19_at_14.36.56.png?v=1724071042"
    ] },
    { name: "Familia", images: [] }
  ]);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [images, setImages] = useState(albums[0].images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoMode, setVideoMode] = useState(false);
  const videoRef = useRef(null);

  // Actualizar imágenes al cambiar de álbum
  useEffect(() => {
    setImages(albums[currentAlbumIndex].images);
    setCurrentIndex(0);
  }, [currentAlbumIndex, albums]);

  // Video automático
  useEffect(() => {
    if(videoMode) {
      videoRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
    } else {
      clearInterval(videoRef.current);
    }
    return () => clearInterval(videoRef.current);
  }, [videoMode, images]);

  const prevImage = () => setCurrentIndex(i => i > 0 ? i - 1 : i);
  const nextImage = () => setCurrentIndex(i => i < images.length - 1 ? i + 1 : i);

  // Agregar imagen
  const handleAddImage = e => {
    const files = Array.from(e.target.files);
    if(files.length === 0) return;
    const urls = files.map(f => URL.createObjectURL(f));
    const newAlbums = [...albums];
    newAlbums[currentAlbumIndex].images.push(...urls);
    setAlbums(newAlbums);
    e.target.value = '';
  };

  // Eliminar imagen
  const handleDelete = () => {
    if(images.length === 0) return;
    const newAlbums = [...albums];
    newAlbums[currentAlbumIndex].images.splice(currentIndex, 1);
    setAlbums(newAlbums);
    if(currentIndex >= newAlbums[currentAlbumIndex].images.length)
      setCurrentIndex(newAlbums[currentAlbumIndex].images.length -1);
  };

  // Agregar álbum
  const handleAddAlbum = () => {
    const name = prompt("Nombre del álbum:");
    if(name) {
      setAlbums([...albums, { name, images: [] }]);
      setCurrentAlbumIndex(albums.length); // Seleccionar nuevo álbum
    }
  };

  return (
    <div className="rollo-container">
      {/* Sidebar Álbumes */}
      <div className="album-container">
        <ul>
          {albums.map((alb, i) => (
            <li key={i} className={i===currentAlbumIndex ? "active album" : "album"}
                onClick={() => setCurrentAlbumIndex(i)}>
              {alb.name}
            </li>
          ))}
          <li className="add-album" onClick={handleAddAlbum}>+ Álbum</li>
        </ul>
      </div>

      {/* Galería */}
      <div className="gallery-container">
        {!videoMode && currentIndex > 0 &&
          <button className="arrow arrow-left" onClick={prevImage}>
            &#10094;
          </button>
        }
        {!videoMode && currentIndex < images.length -1 &&
          <button className="arrow arrow-right" onClick={nextImage}>
            &#10095;
          </button>
        }

        {images.length > 0 &&
          <div className="main-image" style={{backgroundImage: `url(${images[currentIndex]})`}}></div>
        }
        {images.length === 0 &&
          <div className="empty-message">No hay imágenes en este álbum.</div>
        }

        {/* Botones */}
        {!videoMode &&
          <>
            <button className="btn-add" title="Agregar imágenes" onClick={() => document.getElementById("fileInput").click()}>+</button>
            <button className="btn-delete" title="Eliminar imagen" onClick={handleDelete}>🗑</button>
            <button className="btn-video" title="Ver en video" onClick={() => setVideoMode(true)}>▶</button>
          </>
        }

        {videoMode &&
          <button className="btn-video" title="Pausar video" onClick={() => setVideoMode(false)}>⏸</button>
        }

        {/* Candado */}
        <div className="lock-icon">🔒</div>
      </div>

      <input type="file" id="fileInput" multiple accept="image/*" onChange={handleAddImage} style={{display:'none'}}/>
    </div>
  );
}
