import { createContext, useContext } from 'react'

import { makeAutoObservable } from 'mobx'

import { socketService } from '../services/socketService'

export interface Order {
  id: string
  amountTokens: number
  amountDollars: number
  status: 'Pending' | 'Processing' | 'Completed'
  createdAt: string
}

export class OrderStore {
  orders: Order[] = []
  
  constructor() {
    makeAutoObservable(this)
    socketService.subscribeToOrders(
      this.handleNewOrder,
      this.handleOrderUpdate
    )
  }

  handleNewOrder = (order: Order) => {
    this.orders.push(order)
  }

  handleOrderUpdate = (updatedOrder: Order) => {
    const orderIndex = this.orders.findIndex(o => o.id === updatedOrder.id)
    if (orderIndex !== -1) this.orders[orderIndex] = updatedOrder
  }

  createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const order: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    }
    this.orders.push(order)
  }

  updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = this.orders.find(o => o.id === orderId)
    if (order) order.status = status
  }

  getOrders = () => {
    return this.orders
  }

  get sortedOrders() {
    return this.orders.slice().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  get pendingOrders() {
    return this.orders
      .filter(order => order.status === 'Pending' || order.status === 'Processing')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  get completedOrders() {
    return this.orders
      .filter(order => order.status === 'Completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}

export const orderStore = new OrderStore()
export const OrderStoreContext = createContext<OrderStore>(orderStore)
export const useOrderStore = () => useContext(OrderStoreContext)