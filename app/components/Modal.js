"use client";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
        <button className="btn" style={{ marginTop: "15px" }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
