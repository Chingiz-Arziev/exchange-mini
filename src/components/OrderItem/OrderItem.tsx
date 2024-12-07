import { observer } from 'mobx-react-lite'

import { Order } from '../../stores/orderStore'

import { formatDate } from '../../utils/dateFormatter'

import styles from './OrderItem.module.css'

interface OrderItemProps {
  order: Order
}

const OrderItem = observer(({ order }: OrderItemProps) => {
  return (
    <div className={styles.orderItem}>
      <div className={styles.orderInfo}>
        <span className={styles.amount}>
          {order.amountTokens} токенов (${order.amountDollars})
        </span>
        <div className={styles.orderDate}>
          {formatDate(order.createdAt)}
        </div>
        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
          {order.status === 'Processing' ? 'В процессе' : 'Завершен'}
        </span>
      </div>
    </div>
  )
})

export default OrderItem
