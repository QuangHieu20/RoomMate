import { setLocale } from '@vee-validate/i18n'

export const useValidationLocale = () => {
  const { locale } = useI18n()
  
  // Watch for locale changes and sync with vee-validate
  watch(locale, (newLocale) => {
    setLocale(newLocale)
  })
  
  return {
    locale
  }
}