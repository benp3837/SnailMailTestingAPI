import axios from "axios"
import { useEffect, useState } from "react"

interface Mail {
  mailId: number
  sender: string
  recipient: string
  subject: string
}

export const Inbox: React.FC = () => {
  const [inbox, setInbox] = useState<Mail[]>([])

  useEffect(() => {
    getInbox()
  }, [])

  const getInbox = async () => {
    try {
      // const response = await axios.get("http://localhost:8080/mail")
      // setInbox(response.data)

      // Dummy data reflecting Java class fields
      const dummyInbox: Mail[] = [
        {
          mailId: 1,
          sender: "alice@example.com",
          recipient: "you@example.com",
          subject: "Welcome to SnailMail!"
        },
        {
          mailId: 2,
          sender: "billing@company.com",
          recipient: "you@example.com",
          subject: "Your invoice is ready"
        },
        {
          mailId: 3,
          sender: "friend@party.com",
          recipient: "you@example.com",
          subject: "Party this weekend?"
        },
        {
          mailId: 4,
          sender: "boss@work.com",
          recipient: "you@example.com",
          subject: "Don't forget Monday's meeting"
        }
      ]

      setInbox(dummyInbox)
    } catch {
      alert("Something went wrong trying to fetch mail")
    }
  }

  return (
    <div className="container py-4">

      {/* Simple Header */}
      <div className="border-bottom mr-5 py-2">
        <h1 className="text-start font-monospace">
          🐌 SnailMail
        </h1>
      </div>

      <h2 className="my-4 font-monospace">Inbox</h2>

      {inbox.length === 0 ? (
        <div className="alert alert-info text-center">No mail yet. You're all caught up!</div>
      ) : (
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>Subject</th>
              <th>Sender</th>
              <th>Recipient</th>
            </tr>
          </thead>
          <tbody>
            {inbox.map((mail) => (
              <tr key={mail.mailId}>
                <td>{mail.subject}</td>
                <td>{mail.sender}</td>
                <td>{mail.recipient}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
