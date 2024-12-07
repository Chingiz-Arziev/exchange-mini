import OrderForm from './components/OrderForm/OrderForm'
import OrderList from './components/OrderList/OrderList'
import CurrentRate from './components/CurrentRate/CurrentRate'

import './index.css'

const App = () => {
  return (
    <div className="app">
      <CurrentRate />
      <OrderForm />
      <OrderList />
    </div>
  )
}

export default App