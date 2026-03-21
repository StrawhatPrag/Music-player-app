import React from "react";
import { ImCross } from "react-icons/im";
import "../../css/common/Modal.css";

const Modal = ({ children, onClose }) => {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative" }}
      >
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          <ImCross />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
