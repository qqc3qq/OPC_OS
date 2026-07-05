import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Lang = 'zh' | 'en'

interface I18nContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType>(null!)

const cache: Record<Lang, Record<string, string> | null> = { zh: null, en: null }

async function load(lang: Lang): Promise<Record<string, string>> {
  if (cache[lang]) return cache[lang]!
  const mod = await import(`./locales/${lang}.json`)
  cache[lang] = mod.default || mod
  return cache[lang]!
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('ceo-os-lang')
    return (stored === 'zh' || stored === 'en') ? stored : 'zh'
  })
  const [dict, setDict] = useState<Record<string, string>>({})

  useEffect(() => {
    load(lang).then(d => {
      setDict(d)
      localStorage.setItem('ceo-os-lang', lang)
      document.documentElement.lang = lang
    })
  }, [lang])

  function t(key: string, vars?: Record<string, string | number>): string {
    let text = dict[key] || key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
