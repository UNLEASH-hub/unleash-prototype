type Props = {
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}

export function GradientButton({ type = 'button', onClick, disabled, children }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full py-4 text-base font-semibold text-white transition-opacity disabled:opacity-40"
      style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
    >
      {children}
    </button>
  )
}
