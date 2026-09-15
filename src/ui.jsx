/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
export function Modal({ title, onClose, children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const d = ref.current;
    d.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={"dialog " + className}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
    >
      <div className="dialog-head">
        <span className="eyebrow">{title}</span>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Section({ id, number, label, title, description, children }) {
  return (
    <section id={id} className="section shell">
      <div className="section-label">
        <span>{number}</span>
        {label}
      </div>
      <div className="section-heading">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}
export function Tag({ children }) {
  return <span className="tag">{children}</span>;
}
export const go = (id) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
  history.replaceState(null, "", "#" + id);
};
