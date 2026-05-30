// Observa elementos al hacer scroll y les añade la clase .sr-visible
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Selectores que recibirán animación de scroll
const SELECTORS = [
  ".card-perspective",
  ".kpi-card",
  ".chart-card",
  ".glass-card",
  ".admin-tabla-wrapper",
  ".clientes-tabla-wrapper",
  ".anonimo-form",
  ".form-reporte",
  ".cliente-info",
  ".stats-hero",
  ".galeria-header",
  ".page-title",
  ".clientes-header",
  ".admin-header",
].join(", ");

export default function ScrollWatcher() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Pequeño delay para que el DOM del nuevo route esté renderizado
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("sr-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );

      document.querySelectorAll(SELECTORS).forEach((el) => {
        // Solo observar si aún no está visible
        if (!el.classList.contains("sr-visible")) {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
