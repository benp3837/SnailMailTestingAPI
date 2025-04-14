import './App.css'
import { Inbox } from './components/Inbox'
import 'bootstrap/dist/css/bootstrap.css'

function App() {

  return (
    <>

      {/* Simple Top Navbar */}
      <nav className="navbar border-bottom justify-content-center mb-5">
        <h2 className="font-monospace">🐌 SnailMail 🐌</h2>
      </nav>

      <Inbox/>
    </>
  )
}

export default App
