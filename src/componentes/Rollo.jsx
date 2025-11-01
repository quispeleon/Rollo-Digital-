import React, { useState, useEffect, useRef } from "react";
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
  const [presentationMode, setPresentationMode] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [showAlbumSelector, setShowAlbumSelector] = useState(false);
  const rolloContainerRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images, currentAlbumIndex]);

  // Función para activar pantalla completa
  const enterFullscreen = async () => {
    const element = rolloContainerRef.current;
    if (!element) return;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      setFullscreenMode(true);
    } catch (error) {
      console.error('Error al activar pantalla completa:', error);
      setFullscreenMode(true); // Fallback
    }
  };

  // Función para salir de pantalla completa
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.error('Error al salir de pantalla completa:', error);
    }
    setFullscreenMode(false);
  };

  // Detectar cambios en pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.msFullscreenElement;
      
      if (!isFullscreen) {
        setFullscreenMode(false);
        // Si estaba en presentación pero salió de fullscreen, mantener presentación
        // setPresentationMode(false); // Opcional: salir también de presentación
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Video automático para modo presentación
  useEffect(() => {
    if (!presentationMode || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(i => (i < images.length - 1 ? i + 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [presentationMode, images]);

  const prevImage = () =>
    setCurrentIndex(i => (i > 0 ? i - 1 : images.length - 1));

  const nextImage = () =>
    setCurrentIndex(i => (i < images.length - 1 ? i + 1 : 0));

  // Navegación con teclado en modo presentación
  useEffect(() => {
    if (!presentationMode) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') {
        if (fullscreenMode) {
          exitFullscreen();
        } else {
          stopPresentation();
        }
      }
      if (e.key === ' ') {
        // Espacio para pausar/reanudar o salir
        if (fullscreenMode) {
          exitFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode, fullscreenMode, images]);

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

  const startPresentation = (fullscreen = false) => {
    setPresentationMode(true);
    if (fullscreen) {
      enterFullscreen();
    }
  };

  const stopPresentation = () => {
    setPresentationMode(false);
    if (fullscreenMode) {
      exitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (fullscreenMode) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const currentAlbum = albums?.[currentAlbumIndex];
  const isAllImagesAlbum = currentAlbum?.id === "all-images";

  return (
    <div 
      className={`rollo-container ${presentationMode ? 'presentation-mode' : ''} ${fullscreenMode ? 'fullscreen-mode' : ''}`}
      ref={rolloContainerRef}
    >
      {images.length > 0 ? (
        <div className="main-image-container">
          <div
            className="main-image"
            style={{
              backgroundImage: `url(${images[currentIndex]?.url || images[currentIndex]})`
            }}
            onClick={presentationMode ? nextImage : undefined}
          ></div>
          
          {/* Overlay normal (solo cuando no está en presentación) */}
          {!presentationMode && (
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
                    ⚠️ Si se elimina una imagen se eliminara de "Todas las imagenes"
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Indicador de modo presentación */}
          {presentationMode && (
            <div className="presentation-mode-overlay">
              <div className="presentation-info">
                <span className="presentation-counter">
                  {currentIndex + 1} / {images.length}
                </span>
                <span className="presentation-hint">
                  ← → para navegar • {fullscreenMode ? 'ESC' : 'Click fuera'} para salir • Click para avanzar
                </span>
                {presentationMode && !fullscreenMode && (
                  <button 
                    className="enter-fullscreen-btn"
                    onClick={toggleFullscreen}
                    title="Pantalla completa"
                  >
                    ⛶
                  </button>
                )}
              </div>
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

      {/* CONTROLES NORMALES (ocultos en presentationMode) */}
      {!presentationMode && (
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
              <button id="delete-image" onClick={handleDeleteImage}>
                🗑
              </button>
            )}
            {images.length > 1 && (
              <div className="presentation-buttons">
                <button 
                  onClick={() => startPresentation(false)} 
                  title="Modo Presentación Normal"
                >
                  🎬
                </button>
                <button 
                  onClick={() => startPresentation(true)} 
                  title="Modo Presentación Pantalla Completa"
                >
                  ⛶
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* BOTÓN PARA SALIR DE MODO PRESENTACIÓN */}
      {presentationMode && (
        <button className="stop-presentation-btn" onClick={stopPresentation}>
          {fullscreenMode ? 'Salir de Pantalla Completa' : 'Salir de Presentación'}
        </button>
      )}

      <input
        type="file"
        id="fileInput"
        multiple
        accept="image/*"
        onChange={handleAddImage}
        style={{ display: "none" }}
      />

      {/* THUMBNAILS (ocultos en presentationMode) */}
      {images.length > 0 && !presentationMode && (
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