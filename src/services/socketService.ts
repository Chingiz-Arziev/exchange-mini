import { io, Socket } from 'socket.io-client'

import { Order } from '../stores/orderStore'

export class SocketService {
  private socket: Socket
  private isConnected: boolean = false
  private connectionPromise: Promise<void>
  
  constructor() {
    this.socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        this.isConnected = true
        console.log('Socket connected')
        resolve()
      })

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        reject(error)
      })
    })

    this.setupConnectionHandlers()
  }

  private setupConnectionHandlers() {
    this.socket.on('disconnect', () => {
      this.isConnected = false
      console.log('Socket disconnected')
    })
  }

  async waitForConnection() {
    return this.connectionPromise;
  }

  subscribeToOrders(
    onNewOrder: (order: Order) => void,
    onOrderUpdated: (order: Order) => void
  ) {
    this.socket.on('newOrder', onNewOrder)
    this.socket.on('orderUpdated', onOrderUpdated)
  }

  unsubscribeFromOrders() {
    this.socket.off('newOrder')
    this.socket.off('orderUpdated')
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback)
  }

  off(event: string) {
    this.socket.off(event)
  }

  emit(event: string, data?: any) {
    if (!this.isConnected) {
      console.warn('Socket is not connected')
      return
    }
    this.socket.emit(event, data)
  }

  get connectionStatus() {
    return this.isConnected
  }
}

export const socketService = new SocketService()