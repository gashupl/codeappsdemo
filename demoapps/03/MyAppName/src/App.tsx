import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ContactsService } from './generated/services/ContactsService'
import type { Contacts } from './generated/models/ContactsModel'

function App() {
  const [count, setCount] = useState(0)
  const [contacts, setContacts] = useState<Contacts[]>([])
  const [dvLoading, setDvLoading] = useState(false)
  const [dvError, setDvError] = useState<string | null>(null)

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
  
  // useEffect(() => {
  //   getData()
  // }, [])

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
      <h1>Power SDK Dataverse Connection (local)</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={getDataverseData} disabled={dvLoading} style={{ marginLeft: '10px' }}>
          {dvLoading ? 'Loading...' : 'Load Contacts'}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      {dvError && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {dvError}
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

    </>
  )
}

export default App
