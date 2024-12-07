import { useState, ChangeEvent } from 'react'

import { observer } from 'mobx-react-lite'

import { useTokenStore } from '../../stores/tokenStore'

import styles from './OrderForm.module.css'

import { createOrder } from '../../services/createOrder'

const OrderForm = observer(() => {
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const [usdAmount, setUsdAmount] = useState<string>('')
  
  const tokenStore = useTokenStore()

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTokenAmount(value)
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && tokenStore.currentRate !== null) {
      setUsdAmount((numValue * tokenStore.currentRate).toFixed(2));
    } else {
      setUsdAmount('')
    }
  };

  const handleUsdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsdAmount(value)
    
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && tokenStore.currentRate !== null) {
      setTokenAmount((numValue / tokenStore.currentRate).toFixed(6))
    } else {
      setTokenAmount('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const tokenVal = parseFloat(tokenAmount)
    const usdVal = parseFloat(usdAmount)
    
    if (!isNaN(tokenVal) && !isNaN(usdVal)) {
      try {
        await createOrder.createOrder(tokenVal, usdVal)
        
        setTokenAmount('')
        setUsdAmount('')
      } catch (error) {
        console.error('Failed to create order:', error)
      }
    }
  }

  return (
    <form className={styles.orderForm} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label>
          <p>Количество токенов:</p>
          <input
            type="number"
            value={tokenAmount}
            onChange={handleTokenChange}
            step="any"
            min="0"
            required
          />
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label>
          <p>Сумма USD:</p>
          <input
            type="number"
            value={usdAmount}
            onChange={handleUsdChange}
            step="any"
            min="0"
            required
          />
        </label>
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={!tokenAmount || !usdAmount}
      >
        Создать ордер
      </button>
    </form>
  )
})

export default OrderForm