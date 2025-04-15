import { useState } from 'react'
import './App.css'
import { Compose } from './components/Compose'
import { Inbox } from './components/Inbox'
import 'bootstrap/dist/css/bootstrap.css'

function App() {

  const [showComposeCard, setShowComposeCard] = useState<boolean>(false)

  const onClose = (()=>{setShowComposeCard(!showComposeCard)})

  return (
    <>

      {/* Simple Top Navbar */}
      <nav className="navbar border-bottom justify-content-center mb-5">
        <h2 className="font-monospace">🐌 SnailMail 🐌</h2>
      </nav>

      <Inbox/>

      {showComposeCard ? <Compose onClose={onClose}/> : ""}
      {!showComposeCard ? <button className="btn btn-sm btn-outline-primary" onClick={onClose}>compose email</button> : ""}
    </>
  )
}

export default App
