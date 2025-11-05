import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ContactsService } from './generated/services/ContactsService';
import { SQLServerService } from './generated/services/SQLServerService';
import type { Contacts } from './generated/models/ContactsModel';
import type { SqlItem } from './generated/models/SQLServerModel';

// Define Payment interface based on your SQL table structure
interface PaymentItem {
  payment_id?: number;
  amount?: number;
  user_name?: string;
}

function App() {
  const [dvCount, setDvCount] = useState(0)
  const [contacts, setContacts] = useState<Contacts[]>([])
  const [dvLoading, setDvLoading] = useState(false)
  const [dvError, setDvError] = useState<string | null>(null)

    // SQL Server state
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [sqlLoading, setSqlLoading] = useState(false)
  const [sqlError, setSqlError] = useState<string | null>(null)

  const getData = async () => {
    await getDataverseData(); 
    await getSqlServerData(); 
  }

  const getDataverseData = async () => {
    try {
      setDvLoading(true)
      setDvError(null)
      const result = await ContactsService.getAll(); 
      if (result.data) {
        console.log('Contacts retrieved:', result.data);
        setContacts(result.data)
      } else {
        console.log('No contacts found.');
        setContacts([])
      }
    } catch (err) {
        const errorMessage = 'Failed to retrieve contacts: ' + (err as Error).message
        console.error(errorMessage, err);
        setDvError(errorMessage)
    } finally {
        setDvLoading(false)
    }
  }

  const getSqlServerData = async () => {
    try {
      setSqlLoading(true)
      setSqlError(null)
      console.log('Starting SQL Server data retrieval...')
      
      // Using your SQL Server connection parameters
      const server = 'sql-codeappdemo.database.windows.net'
      const database = 'db-codeappdemo'
      const table = '[dbo].[Payment]'
      
      console.log(`Connecting to: ${server}, Database: ${database}, Table: ${table}`)
      
      // Call the SQL Server service to get items
      const result = await SQLServerService.GetItems_V2(server, database, table);
      
      console.log('SQL Server API response:', result)
      
      if (result.data && result.data.value) {
        console.log('Payment records retrieved:', result.data.value.length)
        
        // Map SqlItem to PaymentItem
        const paymentData: PaymentItem[] = result.data.value.map((item: SqlItem) => ({
          payment_id: item.dynamicProperties?.payment_id as number,
          amount: item.dynamicProperties?.amount as number,
          user_name: item.dynamicProperties?.user_name as string,
        }))
        
        setPayments(paymentData)
        console.log('Mapped payment data:', paymentData)
      } else {
        console.log('No payment records found')
        setPayments([])
      }
    } catch (err) {
      const errorMessage = 'Failed to retrieve payment data: ' + (err as Error).message
      console.error('SQL Server Error:', errorMessage, err)
      setSqlError(errorMessage)
    } finally {
      setSqlLoading(false)
    }
  }

  // Use useEffect to call getData when component mounts
  useEffect(() => {
    getData()
  }, [])

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
      <h1>Vite + React</h1>
      
      <div className="card">
        <button onClick={() => setDvCount((dvCount) => dvCount + 1)}>
          count is {dvCount}
        </button>
        <button onClick={getDataverseData} disabled={dvLoading} style={{ marginLeft: '10px' }}>
          {dvLoading ? 'Loading...' : 'Reload Contacts'}
        </button>
        <button onClick={getSqlServerData} disabled={sqlLoading} style={{ marginLeft: '10px' }}>
          {dvLoading ? 'Loading...' : 'Reload Payments'}
        </button>
      </div>

      {dvError && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {dvError}
        </div>
      )}

      {sqlError && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {sqlError}
        </div>
      )}

      {contacts.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3>Dataverse Contacts ({contacts.length})</h3>
          <ul style={{ textAlign: 'left', maxHeight: '200px', overflow: 'auto' }}>
            {contacts.map((contact, index) => (
              <li key={contact.contactid || index}>
                {contact.fullname || 'No name'} - {contact.emailaddress1 || 'No email'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {payments.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3>SQL Payments ({payments.length})</h3>
          <ul style={{ textAlign: 'left', maxHeight: '200px', overflow: 'auto' }}>
            {payments.map((payment, index) => (
              <li key={payment.payment_id || index}>
                {payment.payment_id || 'No data'} - {payment.amount || 'No data'} - {payment.user_name || 'No data'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
