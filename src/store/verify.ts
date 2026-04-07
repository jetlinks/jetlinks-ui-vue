import { defineStore } from 'pinia'

const VERIFY_CACHE_KEY = 'jetlinks_verify_cache'

export interface VerifyCache {
  key: string
  token: string
}

export const useVerifyStore = defineStore('verify', {
  state: (): { cache: VerifyCache | null } => ({
    cache: null
  }),
  actions: {
    setCache(key: string, token: string) {
      this.cache = { key, token }
      try {
        localStorage.setItem(VERIFY_CACHE_KEY, JSON.stringify(this.cache))
      } catch {
        // ignore
      }
    },
    getCache(): VerifyCache | null {
      if (this.cache) return this.cache
      try {
        const raw = localStorage.getItem(VERIFY_CACHE_KEY)
        if (raw) {
          this.cache = JSON.parse(raw) as VerifyCache
          return this.cache
        }
      } catch {
        // ignore
      }
      return null
    },
    clearCache() {
      this.cache = null
      try {
        localStorage.removeItem(VERIFY_CACHE_KEY)
      } catch {
        // ignore
      }
    }
  }
})
