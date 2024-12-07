import { useState } from 'react'

import { observer } from 'mobx-react-lite'

import { useOrderStore } from '../../stores/orderStore'

import OrderItem from '../OrderItem/OrderItem'

import styles from './OrderList.module.css'

const OrderList = observer(() => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [sortDesc, setSortDesc] = useState(true)

  const orderStore = useOrderStore()

  const filteredOrders = () => {
    let orders
    switch (filter) {
      case 'pending':
        orders = orderStore.pendingOrders
        break;
      case 'completed':
        orders = orderStore.completedOrders
        break;
      default:
        orders = orderStore.orders
    }
    
    return orders.slice().sort((a, b) => {
      const comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return sortDesc ? comparison : -comparison
    })
  }

  return (
    <div className={styles.container}>      
      <div className={styles.orderList}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <button 
              className={styles.sortBtn}
              onClick={() => setSortDesc(!sortDesc)}
            >
              {sortDesc ? '↓ Сначала новые' : '↑ Сначала старые'}
            </button>
          </div>
          <div className={styles.filters}>
            <button 
              className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              Все
            </button>
            <button 
              className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
              onClick={() => setFilter('pending')}
            >
              Активные
            </button>
            <button 
              className={`${styles.filterBtn} ${filter === 'completed' ? styles.active : ''}`}
              onClick={() => setFilter('completed')}
            >
              Завершенные
            </button>
          </div>
        </div>
        {filteredOrders().map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
})

export default OrderList