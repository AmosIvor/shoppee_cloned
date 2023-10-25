import { UseFormGetValues, type RegisterOptions } from 'react-hook-form'
import * as yup from 'yup'

type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email la bat buoc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email khong dung dinh dang'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 5-160 ki tu'
    },
    minLength: {
      value: 5,
      message: 'Do dai tu 5-160 ki tu'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password la bat buoc'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 6-160 ki tu'
    },
    minLength: {
      value: 6,
      message: 'Do dai tu 6-160 ki tu'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhap lai password la bat buoc'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 6-160 ki tu'
    },
    minLength: {
      value: 6,
      message: 'Do dai tu 6-160 ki tu'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Nhap lai password khong khop'
        : undefined
  }
})

export const schema = yup.object({
  email: yup
    .string()
    .required('Email la bat buoc')
    .email('Email khong dung dinh dang')
    .min(5, 'Do dai tu 5-160')
    .max(160, 'Do dai tu 5-160'),
  password: yup.string().required('Password la bat buoc').min(6, 'Do dai tu 6-160').max(6, 'Do dai tu 6-160'),
  confirm_password: yup
    .string()
    .required('Nhap lai password la bat buoc')
    .min(6, 'Do dai tu 6-160')
    .max(6, 'Do dai tu 6-160')
    .oneOf([yup.ref('password')], 'Nhap lai password khong khop')
})

const loginSchema = schema.omit(['confirm_password'])
export type LoginSchema = yup.InferType<typeof schema>

export type Schema = yup.InferType<typeof schema>
