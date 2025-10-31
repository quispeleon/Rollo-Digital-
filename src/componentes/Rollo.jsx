import React, { useState, useEffect } from "react";
import "./Rollo.css";

export default function Rollo({ 
  images = [], 
  currentAlbumIndex, 
  albums, 
  setAlbums, 
  onAddImages,
  onDeleteImage 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoMode, setVideoMode] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images, currentAlbumIndex]);

  // Video automático
  useEffect(() => {
    if (!videoMode || images.length <= 1) return;

    let remaining = images.map((_, i) => i);
    let interval = setInterval(() => {
      if (remaining.length === 0) {
        remaining = images.map((_, i) => i);
      }

      const randomIdx = Math.floor(Math.random() * remaining.length);
      const next = remaining[randomIdx];
      setCurrentIndex(next);
      remaining.splice(randomIdx, 1);
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

    onAddImages(files);
    e.target.value = "";
  };

  const handleDeleteImage = () => {
    if (images.length === 0) return;
    
    const currentAlbum = albums?.[currentAlbumIndex];
    const imageName = images[currentIndex]?.name || `Imagen ${currentIndex + 1}`;
    
    let message;
    if (currentAlbum?.id === "all-images") {
      message = `¿Eliminar "${imageName}" de TODOS los álbumes? Esta acción no se puede deshacer.`;
    } else {
      message = `¿Eliminar "${imageName}" del álbum "${currentAlbum?.name}"? También se eliminará de "Todas las imágenes".`;
    }
    
    const confirmDelete = window.confirm(message);
    if (confirmDelete) {
      onDeleteImage(currentIndex);
      setCurrentIndex(i => Math.max(0, i - 1));
    }
  };

  const currentAlbum = albums?.[currentAlbumIndex];
  const isAllImagesAlbum = currentAlbum?.id === "all-images";

  return (
    <div className="rollo-container">
      {images.length > 0 ? (
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
              {isAllImagesAlbum && images[currentIndex] && (
                <span className="album-source">
                  En {albums.filter(a => 
                    (!a.id || a.id !== "all-images") && a.images.some(img => 
                      img.name === images[currentIndex]?.name
                    )
                  ).length} álbum(s)
                </span>
              )}
              {!isAllImagesAlbum && images[currentIndex] && (
                <span className="delete-info">
                  ⚠️ Se eliminará de todos los álbumes
                </span>
              )}
            </div>
          </div>
          
          {videoMode && (
            <div className="video-mode-overlay">
              Modo Presentación
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📷</div>
          <h3>No hay imágenes en este álbum</h3>
          <p>Agrega algunas imágenes para comenzar</p>
          {currentAlbum?.id !== "all-images" && (
            <p className="empty-note">
              💡 Las imágenes que agregues también aparecerán en "Todas las imágenes"
            </p>
          )}
        </div>
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
              <button
              id="delete-image"
              onClick={handleDeleteImage}>🗑</button>
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
        <div className="thumbnails-container">
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
        </div>
      )}
    </div>
  );
}