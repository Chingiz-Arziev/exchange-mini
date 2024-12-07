import { socketService } from './socketService'
import { tokenStore } from '../stores/tokenStore'

export const getTokenRate = {
  subscribe: async () => {
    try {
      await socketService.waitForConnection()
      getTokenRate.unsubscribe()
      
      socketService.emit('getCurrentRate');
      
      socketService.on('tokenRate', (rate: string) => {
        try {
          const numericRate = Number(rate)
          if (isNaN(numericRate)) {
            throw new Error('Invalid rate received')
          }
          tokenStore.setCurrentRate(numericRate)
        } catch (error) {
          console.error('Error processing token rate:', error)
        }
      })
    } catch (error) {
      console.error('Failed to subscribe to token rate:', error)
    }
  },

  unsubscribe: () => {
    socketService.off('tokenRate')
  }
}