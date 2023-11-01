import { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  errorMessage,
  className,
  name,
  register,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name) : {}
  return (
    <div className={className}>
      <input
        // name='email'
        className={classNameInput}
        {...registerResult}
        {...rest}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
