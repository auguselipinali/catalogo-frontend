import styles from './SiteFooter.module.css'

// Firma del desarrollador (difusión). El número es FIJO y del desarrollador,
// distinto de VITE_WHATSAPP_NUMERO (que es el del comercio para los pedidos).
const DEV_WHATSAPP = 'https://wa.me/5492644170265'

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span className={styles.name}>Hecho por Augusto Elipinali</span>
      <span className={styles.sep} aria-hidden="true">
        ·
      </span>
      <span className={styles.role}>
        Desarrollo de software y catálogos web para comercios
      </span>
      <span className={styles.sep} aria-hidden="true">
        ·
      </span>
      <a
        className={styles.link}
        href={DEV_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
      >
        Contactar por WhatsApp
      </a>
    </footer>
  )
}
