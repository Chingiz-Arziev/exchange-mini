import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useTokenStore } from '../../stores/tokenStore'
import { getTokenRate } from '../../services/getTokenRate'
import styles from './CurrentRate.module.css'

const CurrentRate = observer(() => {
  const tokenStore = useTokenStore()
  
  useEffect(() => {
    getTokenRate.subscribe()
    return () => {
      getTokenRate.unsubscribe()
    }
  }, [])
  
  return (
    <div className={styles.wrapper}>
      <p>Текущий курс: ${tokenStore.currentRate ?? 'Загрузка...'}</p>
      <p>Предыдущий курс: ${tokenStore.previousRate || 0}</p>
      <p>
        Изменение:  
        <span style={{ color: tokenStore.rateChange > 0 ? 'green' : tokenStore.rateChange < 0 ? 'red' : 'inherit' }}>
          {tokenStore.rateChange > 0 ? ' +' : ' '}{tokenStore.rateChange}%
        </span>
      </p>
    </div>
  )
})

export default CurrentRate
