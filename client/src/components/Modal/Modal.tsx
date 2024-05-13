import styles from './Modal.module.css'

interface ModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    // eslint-disable-next-line react/require-default-props
    onCancel?: () => void
}

function Modal(props: ModalProps) {
    const { isOpen, title, message, onConfirm, onCancel } = props

    if (!isOpen) return null

    return (
        <div className={styles.modal_overlay}>
            <div className={styles.modal_content}>
                <h2>{title}</h2>
                <p>{message}</p>
                <button
                    className={styles.button}
                    style={{ backgroundColor: 'yellowgreen' }}
                    type="button"
                    aria-label="Confirm"
                    onClick={onConfirm}
                >
                    Confirm
                </button>
                {onCancel && (
                    <button
                        className={styles.button}
                        style={{ backgroundColor: 'red', marginLeft: '1rem' }}
                        type="button"
                        aria-label="Cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    )
}

export default Modal
