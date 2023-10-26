import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from 'src/components/Input'
// import { getRules } from 'src/utils/rules'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { registerAccount } from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ResponseApi } from 'src/types/utils.type'

type FormData = Schema

export default function Register() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    getValues,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  // const rules = getRules(getValues)

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        // console.log(data)
      },
      onError: (error) => {
        // console.log(error)
        if (isAxiosUnprocessableEntityError<ResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
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

  // console.log('error', errors)

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Dang ky</div>
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
              <Input
                className='mt-2'
                type='password'
                name='confirm_password'
                placeholder='Confirm password'
                register={register}
                errorMessage={errors.confirm_password?.message}
                autoComplete='on'
              />

              <div className='mt-2'>
                <button className='w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'>
                  Dang ky
                </button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Ban da co tai khoan?</span>
                <Link className='ml-1 text-red-400' to='/login'>
                  Dang nhap
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
