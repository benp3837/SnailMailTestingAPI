import axios from "axios"
import { useEffect, useState } from "react"

//This will help us model the incoming Mail data. Think of Interfaces in TS like custom data types
interface Mail {
  sender: string
  recipient: string
  subject: string
  body: string
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

      console.log(response.data)

    } catch {
      alert("Something went wrong trying to fetch mail")
    }
  }

  return (

    <div className="container">

        <h3 className="font-monospace">Inbox</h3>

        {inbox.length === 0 ? (
          <div className="alert alert-primary text-center">No mail yet. You're all caught up!</div>
        ) : (
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>Subject</th>
                <th>Sender</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {/* For every element (which we'll call "mail") in the inbox, render a new table row */}
              {inbox.map((mail) => (
                <tr>
                  <td>{mail.subject}</td>
                  <td>{mail.sender}</td>
                  <td>{mail.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
   
  )
}
