import React, { useState, useEffect } from "react";
import "./Rollo.css";

export default function Rollo({ images = [], setAlbums, currentAlbum }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoMode, setVideoMode] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Video automático sin repetir imágenes hasta mostrar todas
  useEffect(() => {
    if (!videoMode || images.length <= 1) return;

    let remaining = images.map((_, i) => i); // índices de imágenes restantes
    let interval = setInterval(() => {
      if (remaining.length === 0) {
        remaining = images.map((_, i) => i); // reinicia ciclo
      }

      const randomIdx = Math.floor(Math.random() * remaining.length);
      const next = remaining[randomIdx];

      setCurrentIndex(next);

      remaining.splice(randomIdx, 1); // eliminar índice ya mostrado
    }, 3000);

    return () => clearInterval(interval);
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

      // Crear un Set con los nombres de los archivos ya existentes
      const existingNames = new Set(
        currentImages.map(img => img.name || img.split("/").pop())
      );

      files.forEach(file => {
        if (!existingNames.has(file.name)) {
          const url = URL.createObjectURL(file);
          currentImages.push({ url, name: file.name });
          existingNames.add(file.name); // prevenir duplicados en la misma carga
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
        // En Rollo.jsx, actualiza la parte del main-image:
        <div className="main-image-container">
          <div
            className="main-image"
            style={{
              backgroundImage: `url(${images[currentIndex]?.url || images[currentIndex]})`
            }}
          ></div>
          <div className="image-overlay">
            <div className="image-info">
              <span className="image-counter">
                {currentIndex + 1} / {images.length}
              </span>
              <span className="image-name">
                {images[currentIndex]?.name || `Imagen ${currentIndex + 1}`}
              </span>
            </div>
          </div>

          {videoMode && (
            <div className="video-mode-overlay">
              Modo Presentación
            </div>
          )}
        </div>
      ) : (
        <p>No hay imágenes en este álbum.</p>
      )}

      {!videoMode && (
        <>
          {images.length > 0 && (
            <>
              <button className="arrow arrow-left" onClick={prevImage}>
                &#10094;
              </button>
              <button className="arrow arrow-right" onClick={nextImage}>
                &#10095;
              </button>
            </>
          )}

          <div className="controls">
            <button onClick={() => document.getElementById("fileInput").click()}>
              +
            </button>
            {images.length > 0 && (
              <>
                <button onClick={handleDeleteImage}>🗑 Imagen</button>
                <button onClick={handleDeleteAlbum}>🗑 Álbum</button>
              </>
            )}
            {images.length > 1 && (
              <button onClick={() => setVideoMode(true)}>▶</button>
            )}
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
              style={{ backgroundImage: `url(${img.url || img})` }}
              onClick={() => setCurrentIndex(i)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

