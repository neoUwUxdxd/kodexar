import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRICING } from './config.js'

const CurrencyContext = createContext(null)
const KEY = 'kodexar:currency'

export function toCurrency(mxn, currency) {
  return currency === 'USD' ? Math.round(mxn / PRICING.mxnPerUsd) : Math.round(mxn)
}

export function formatMoney(mxn, currency) {
  const value = toCurrency(mxn, currency)
  const locale = currency === 'USD' ? 'en-US' : 'es-MX'
  const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)
  return `$${n} ${currency}`
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY)
      return saved === 'USD' || saved === 'MXN' ? saved : PRICING.defaultCurrency
    } catch {
      return PRICING.defaultCurrency
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, currency)
    } catch {
      /* almacenamiento no disponible */
    }
  }, [currency])

  const value = useMemo(
    () => ({ currency, setCurrency, format: (mxn) => formatMoney(mxn, currency) }),
    [currency],
  )
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
