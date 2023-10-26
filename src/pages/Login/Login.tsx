import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { loginAccount } from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { ResponseApi } from 'src/types/utils.type'
import { LoginSchema, loginSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = LoginSchema

export default function Login() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: FormData) => loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (error) => {
        // console.log(error)
        if (isAxiosUnprocessableEntityError<ResponseApi<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Dang nhap</div>
              <Input
                className='mt-8'
                type='email'
                name='email'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                className='mt-2'
                type='password'
                name='password'
                placeholder='Password'
                register={register}
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                >
                  Dang nhap
                </button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Ban chua co tai khoan?</span>
                <Link className='ml-1 text-red-400' to='/register'>
                  Dang ky
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
