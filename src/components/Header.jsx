import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <img
        className={styles.logo}
        src="/logo.png"
        alt="Caricias al Alma — Cosmética y Accesorios"
      />
      <span className={styles.rule} aria-hidden="true" />
    </header>
  )
}
