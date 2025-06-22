import styles from './Footer.module.css'

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.content}>
				<p>TypeTrail - Improve your typing skills</p>
				<div className={styles.links}>
					<a href="#about">About</a>
				</div>
			</div>
		</footer>
	)
}
