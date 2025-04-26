import axios from "axios";
import React, { useState } from "react";

//Takes 2 values in props: 
    //The function that closes this component (Defined in App.tsx)
    //The data-testid attribute (for a better-practice testing example)
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
}

//Modeling the mail object we'll send to the Backend
interface Mail {
    sender: string;
    recipient: string;
    subject: string;
    body: string;
  }

export const Compose: React.FC<Props> = ({ onClose, ...testId }) => {

    //defining state for mail, with a default value for sender (me@snailmail.com)
    const [mailToSend, setMailToSend] = useState<Mail>(
        {
            sender: 'me@snailmail.com',
            recipient: '',
            subject: '',
            body: '',
        })

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        //Storing the name and value attributes from the changed element for ease of use
        const name = event.target.name //name is an attribute we set on the input boxes
        const value = event.target.value //value is the actual value in the input at the time

        //"Take whatever input was changed, and set the matching state field to the value of that input"
        //[name] can be either of the 3 inputs in the Compose component. This ugly code lends flexibility. 
        //This syntax becomes way more necessary when we have a ton of input fields
        setMailToSend((mailToSend) => ({...mailToSend, [name]:value}))

    }

    const sendEmail = async () => {

        //If recipient is empty, don't send anything and yell at the user (yes we should validate every field)
        if(mailToSend.recipient.trim() === ""){
            alert("Recipient cannot be empty!")
        } else {
            try{

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailToSend.recipient)) {
                    throw new Error("Recipient doesn't appear to be a valid email address");
                }

                const response = await axios.post("http://localhost:8080/mail", mailToSend)
                console.log(response.data)
                alert("sent mail to: " + response.data.recipient)
                onClose()
            } catch (e) {

                if(e instanceof Error){
                    alert(e.message)
                } else {
                    alert("Some unknown error occurred!")
                }
            }
        }

    }

    return (
        //Container for compose email card - throw it to the bottom right and put a shadow on it 
        //Also, note the data attribute at the end. This helps our 5th test recognize the Component.
        <div className="card shadow position-fixed bottom-0 end-0 m-5 w-25" {...testId}>

            <h6 className="border-bottom position-absolute start-0 top-0 m-2">Compose Email</h6>
            <button onClick={onClose} className="btn-close position-absolute end-0 top-0 m-1"></button>

            {/* Very HTML-ish philosophy for cards. Header and Body section */}
            <div className="mt-3">
                <input className="border-bottom form-control border-0 shadow-none" 
                placeholder="Recipient" name="recipient" onChange={handleInputChange}/>
            </div>

            <div>
                <input className="border-bottom form-control border-0 shadow-none" 
                placeholder="Subject" name="subject" onChange={handleInputChange}/>
            </div>

            <div className="card-body">
                <textarea rows={6} className="form-control border-0 shadow-none w-100" 
                placeholder="Write your message here..." name="body" onChange={handleInputChange}/>
            </div>

            <button className="btn btn-sm btn-outline-primary mt-3 mx-auto d-block" onClick={sendEmail}>Send</button>

        </div>
        
    );
};