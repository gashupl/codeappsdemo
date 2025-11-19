import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { PaymentService } from './generated/services/PaymentService'
import type { Payment } from './generated/models/PaymentModel'

function App() {
  const [count, setCount] = useState(0)
  const [payments, setPayments] = useState<Payment[]>([])
  const [sqlLoading, setSqlLoading] = useState(false)
  const [sqlError, setSqlError] = useState<string | null>(null)

  const getSqlData = async () => {
    try {
      setSqlLoading(true)
      setSqlError(null)
      const result = await PaymentService.getAll(); 
      if (result.data) {
        console.log('Payments retrieved:', result.data);
        setPayments(result.data)
      } else {
        console.log('No payments found.');
        setPayments([])
      }
    } catch (err) {
        const errorMessage = 'Failed to retrieve payments: ' + (err as Error).message
        console.error(errorMessage, err);
        setSqlError(errorMessage)
    } finally {
        setSqlLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Power SDK + SQL Connection (local)</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={getSqlData} disabled={sqlLoading} style={{ marginLeft: '10px' }}>
          {sqlLoading ? 'Loading...' : 'Load Payments'}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {sqlError && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {sqlError}
        </div>
      )}

      {payments.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3>Payments ({payments.length})</h3>
          <ul style={{ textAlign: 'left', maxHeight: '200px', overflow: 'auto' }}>
            {payments.map((payment, index) => (
              <li key={payment.payment_id|| index}>
                {payment.user_name || 'No name'} - {payment.amount || 'No amount'}
              </li>
            ))}
          </ul>
        </div>
      )}

    </>
  )
}

export default App
