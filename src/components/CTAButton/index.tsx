import styles from './CTAButton.module.css'

interface CTAButtonProps {
    text: string
    onClick?: () => void
    disabled?: boolean
    variant?: 'primary' | 'secondary'
    type?: 'button' | 'submit'
    className?: string
}

function CTAButton({
    text,
    onClick,
    disabled = false,
    variant = 'primary',
    type = 'button',
    className = '',
}: CTAButtonProps) {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    )
}

export default CTAButton
