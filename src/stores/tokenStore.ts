import { createContext, useContext } from 'react'

import { makeAutoObservable } from 'mobx'

interface TokenState {
  currentRate: number | null
  previousRate: number | null
  lastUpdate: Date | null
}

class TokenStore implements TokenState {
  currentRate: number | null = null
  previousRate: number | null = null
  lastUpdate: Date | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setCurrentRate = (rate: number) => {
    if (rate <= 0) throw new Error('Rate must be positive')
    this.previousRate = this.currentRate
    this.currentRate = rate
    this.lastUpdate = new Date()
  }

  get rateChange(): number {
    if (!this.currentRate || !this.previousRate) return 0
    return Number(((this.currentRate - this.previousRate) / this.previousRate * 100).toFixed(2))
  }

  get hasRate(): boolean {
    return this.currentRate !== null
  }
}

export const tokenStore = new TokenStore()
export const TokenStoreContext = createContext<TokenStore>(tokenStore)
export const useTokenStore = () => useContext(TokenStoreContext)