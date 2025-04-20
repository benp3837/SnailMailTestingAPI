import { useState } from 'react'
import './App.css'
import { Compose } from './components/Compose'
import { Inbox } from './components/Inbox'
import 'bootstrap/dist/css/bootstrap.css'

function App() {

  const [showComposeCard, setShowComposeCard] = useState<boolean>(false)

  const showComposeToggle = (()=>{setShowComposeCard(!showComposeCard)})

  return (
    <>

      {/* Simple Top Navbar */}
      <nav className="navbar border-bottom justify-content-center mb-5">
        <h2 className="font-monospace">🐌 SnailMail 🐌</h2>
      </nav>

      <Inbox/>

      {/* if showComposeCard is truthy, show the Compose component, 
      otherwise show the "compose email button"
      Also, notice the data attribute in the Compose component! It'll help us write our tests*/}
      {showComposeCard ? <Compose data-testid="compose-component" onClose={showComposeToggle}/> : ""}
      
      {!showComposeCard ? <button className="btn btn-sm btn-outline-primary" onClick={showComposeToggle}>Compose Email</button> : ""}
    </>
  )
}

export default App
