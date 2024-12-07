import axios from 'axios'

export const createOrder = {
  createOrder: async (amountTokens: number, amountDollars: number) => {
    try {
      await axios.post('http://localhost:3000/orders', {
        amountTokens,
        amountDollars
      })
    } catch (error) {
      console.error('Ошибка при создании заказа:', error)
      throw error
    }
  }
}