import React from 'react'

export default function VSCode({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      height="22" width="22"
    >
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-5.53-4.46L0 5.828l5.44 5.302L0 16.432l1.515 1.131 5.53-4.46 9.46 8.63a1.494 1.494 0 0 0 1.705.29l4.94-2.377A1.5 1.498 0 0 0 24 18.318V4.927a1.498 1.498 0 0 0-.85-1.34zM18 18.064l-8.039-6.39L18 5.304v12.76z" />
    </svg>
  )
}
