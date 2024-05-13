import styles from './About.module.css'

function About() {
    return (
        <article className={styles.disclaimer}>
            <h2>About</h2>
            <p>
                This is the first prototype of a school project. The goal of this app is to create
                todos and get experience from completing them!
            </p>
            <p>
                If you do decide to try this app and want to leave some feedback you can reach me on
                victor.hedegran@gmail.com. Any feedback is valuable!
            </p>
        </article>
    )
}

export default About
