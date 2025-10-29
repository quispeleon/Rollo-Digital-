import React, { useState, useEffect, useRef } from "react";
import "./Rollo.css";

export default function Rollo({ images = [], setAlbums, currentAlbum }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoMode, setVideoMode] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (videoMode && images.length > 1) {
      videoRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
    } else {
      clearInterval(videoRef.current);
    }
    return () => clearInterval(videoRef.current);
  }, [videoMode, images]);

  const prevImage = () =>
    setCurrentIndex(i => (i > 0 ? i - 1 : images.length - 1));
  const nextImage = () =>
    setCurrentIndex(i => (i < images.length - 1 ? i + 1 : 0));

  const handleAddImage = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setAlbums(albs => {
      const newAlbums = [...albs];
      const currentImages = newAlbums[currentAlbum].images;
      files.forEach(file => {
        const exists = currentImages.some(img => img.endsWith(file.name));
        if (!exists) {
          currentImages.push(URL.createObjectURL(file));
        }
      });
      return newAlbums;
    });

    e.target.value = "";
  };

  const handleDeleteImage = () => {
    setAlbums(albs => {
      const newAlbums = [...albs];
      newAlbums[currentAlbum].images.splice(currentIndex, 1);
      return newAlbums;
    });
    setCurrentIndex(i => Math.max(0, i - 1));
  };

  // ✅ Nuevo: eliminar todo el álbum
  const handleDeleteAlbum = () => {
    setAlbums(albs => {
      const newAlbums = [...albs];
      newAlbums.splice(currentAlbum, 1);
      return newAlbums;
    });
  };

  return (
    <div className="rollo-container">
      {images.length > 0 ? (
        <div
          className="main-image"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        ></div>
      ) : (
        <p>No hay imágenes en este álbum.</p>
      )}

      {!videoMode && images.length > 0 && (
        <>
          <button className="arrow arrow-left" onClick={prevImage}>
            &#10094;
          </button>
          <button className="arrow arrow-right" onClick={nextImage}>
            &#10095;
          </button>

          <div className="controls">
            <button onClick={() => document.getElementById("fileInput").click()}>
              +
            </button>
            <button onClick={handleDeleteImage}>🗑 Imagen</button>
            <button onClick={handleDeleteAlbum}>🗑 Álbum</button>
            {images.length > 1 && <button onClick={() => setVideoMode(true)}>▶</button>}
          </div>
        </>
      )}

      {videoMode && <button onClick={() => setVideoMode(false)}>⏸</button>}

      <input
        type="file"
        id="fileInput"
        multiple
        accept="image/*"
        onChange={handleAddImage}
        style={{ display: "none" }}
      />

      {images.length > 0 && (
        <div className="thumbnails">
          {images.map((img, i) => (
            <div
              key={i}
              className={`thumb ${i === currentIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
              onClick={() => setCurrentIndex(i)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
