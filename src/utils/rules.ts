import { NoUndefinedField } from './../types/utils.type'
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
  password: yup.string().required('Password la bat buoc').min(6, 'Do dai tu 6-160').max(160, 'Do dai tu 6-160'),
  confirm_password: yup
    .string()
    .required('Nhap lai password la bat buoc')
    .min(6, 'Do dai tu 6-160')
    .max(160, 'Do dai tu 6-160')
    .oneOf([yup.ref('password')], 'Nhap lai password khong khop'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: function (value) {
      const price_min = value
      const { price_max } = this.parent as { price_min: string; price_max: string }
      if (price_min !== '' && price_max !== '') {
        return Number(price_max) >= Number(price_min)
      }
      return price_min !== '' || price_max !== ''
    }
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: function (value) {
      const price_max = value
      const { price_min } = this.parent as { price_min: string; price_max: string }
      if (price_min !== '' && price_max !== '') {
        return Number(price_max) >= Number(price_min)
      }
      return price_min !== '' || price_max !== ''
    }
  }),
  name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})

export const registerSchema = schema.pick(['email', 'password', 'confirm_password'])
export type RegisterSchema = yup.InferType<typeof registerSchema>

export const loginSchema = schema.pick(['email', 'password'])
export type LoginSchema = yup.InferType<typeof loginSchema>

export const priceSchema = schema.pick(['price_min', 'price_max'])
export type PriceSchema = NoUndefinedField<yup.InferType<typeof priceSchema>>

export const nameSchema = schema.pick(['name'])
export type NameSchema = yup.InferType<typeof nameSchema>

export type Schema = yup.InferType<typeof schema>

// user schema
export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 kí tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 kí tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: schema.fields['confirm_password']
})

export type UserSchema = yup.InferType<typeof userSchema>
