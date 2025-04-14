import axios from "axios"
import { useEffect, useState } from "react"

//This will help us model the incoming Mail data
interface Mail {
  mailId: number
  sender: string
  recipient: string
  subject: string
}

export const Inbox: React.FC = () => {

  //Store the Mail[] with useState
  const [inbox, setInbox] = useState<Mail[]>([])

  //Get the mail from the API on component render
  useEffect(() => {
    getInbox()
  }, [])

  const getInbox = async () => {
    try {

      //Send a GET request to the API to get all inbox emails
      const response = await axios.get("http://localhost:8080/mail")

      //Set the returned data in our useState
      setInbox(response.data)

    } catch {
      alert("Something went wrong trying to fetch mail")
    }
  }

  return (

    <div className="container m-5">

        <h3 className="font-monospace">Inbox</h3>

        {inbox.length === 0 ? (
          <div className="alert alert-primary text-center">No mail yet. You're all caught up!</div>
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
