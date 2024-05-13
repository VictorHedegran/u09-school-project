import { useEffect, useState } from 'react'
import styles from './InstallBanner.module.css' // Assuming you'll use the same CSS as before

function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()

            deferredPrompt.userChoice.then((choice: any) => {
                if (choice.outcome === 'accepted') {
                    console.log('User accepted the install prompt')
                } else {
                    console.log('User dismissed the install prompt')
                }
                setDeferredPrompt(null) // Clear the saved prompt event
            })
        }
    }

    return (
        <div
            id="installBanner"
            className={styles.install_banner}
            style={{ display: deferredPrompt ? 'block' : 'none' }}
        >
            <p>Do you want to install this app?</p>
            <button type="button" aria-label="install app" onClick={handleInstall}>
                Install
            </button>
            <button type="button" aria-label="not now" onClick={() => setDeferredPrompt(null)}>
                Not Now
            </button>
        </div>
    )
}

export default InstallBanner
