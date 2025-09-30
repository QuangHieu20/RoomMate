import * as yup from 'yup'

export const useValidationSchema = () => {
  const { t, locale } = useI18n()

  // Tạo computed schemas để reactive với locale changes
  const registerSchema = computed(() => yup.object({
    email: yup
      .string()
      .required(t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    phone: yup
      .string()
      .required(t('auth.validation.phoneRequired'))
      .matches(/^[0-9]+$/, t('auth.validation.phoneInvalid'))
      .min(10, t('auth.validation.phoneMin'))
      .max(15, t('auth.validation.phoneMax')),
    fullName: yup
      .string()
      .required(t('auth.validation.nameRequired'))
      .min(2, t('auth.validation.nameMin'))
      .max(50, t('auth.validation.nameMax'))
      .matches(
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƯăâêôư\s]+$/,
        t('auth.validation.nameAlpha')
      ),
    password: yup
      .string()
      .required(t('auth.validation.passwordRequired'))
      .min(6, t('auth.validation.passwordMin'))
      .max(50, t('auth.validation.passwordMax'))
  }))

  const loginSchema = computed(() => yup.object({
    email: yup
      .string()
      .required(t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    password: yup
      .string()
      .required(t('auth.validation.passwordRequired'))
      .min(6, t('auth.validation.passwordMin'))
  }))

  return {
    registerSchema,
    loginSchema
  }
}
