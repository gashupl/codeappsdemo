import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ContactsService } from './generated/services/ContactsService';
import type { Contacts } from './generated/models/ContactsModel';

function App() {
  const [count, setCount] = useState(0)
  const [contacts, setContacts] = useState<Contacts[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getData = async () => {
    try {
      setLoading(true)
      setError(null)
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
      setError(errorMessage)
    } finally {
      setLoading(false)
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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={getData} disabled={loading} style={{ marginLeft: '10px' }}>
          {loading ? 'Loading...' : 'Reload Contacts'}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {error}
        </div>
      )}

      {contacts.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3>Contacts ({contacts.length})</h3>
          <ul style={{ textAlign: 'left', maxHeight: '200px', overflow: 'auto' }}>
            {contacts.map((contact, index) => (
              <li key={contact.contactid || index}>
                {contact.fullname || 'No name'} - {contact.emailaddress1 || 'No email'}
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
