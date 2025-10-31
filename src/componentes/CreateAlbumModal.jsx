// components/CreateAlbumModal.jsx
import React, { useState, useEffect } from "react";
import "./CreateAlbumModal.css";

export default function CreateAlbumModal({ isOpen, onClose, onCreate }) {
  const [albumName, setAlbumName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAlbumName("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (albumName.trim()) {
      onCreate(albumName.trim());
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Crear Nuevo Álbum</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label htmlFor="albumName">Nombre del álbum</label>
            <input
              id="albumName"
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Ej: Vacaciones 2024"
              autoFocus
              maxLength={50}
            />
            <div className="char-count">{albumName.length}/50</div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-create"
              disabled={!albumName.trim()}
            >
              <span>✨ Crear Álbum</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}