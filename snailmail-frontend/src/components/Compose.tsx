import React, { useState } from "react";

//TODO: state object for mailToSend

//Takes props of the function that closes this component (Defined in App.tsx)
interface Props {
  onClose: () => void;
}

//Modeling the mail object we'll send to the Backend
interface Mail {
    sender: string;
    recipient: string;
    subject: string;
    body: string;
  }

export const Compose: React.FC<Props> = ({ onClose }) => {

    //defining state for mail, with a default value for sender (me@snailmail.com)
    const [mailToSend, setMailToSend] = useState<Mail>(
        {
            sender: 'me@snailmail.com',
            recipient: '',
            subject: '',
            body: '',
        })

    const composeEmail = () => {

        setMailToSend({
            sender: 'me@snailmail.com',
            recipient: 'gal@snailmail.com',
            subject: 'I liek turtle',
            body: 'turtles turles turtlessssss',
        })

    }

    const sendEmail = () => {
        alert("sent mail to: " + mailToSend.recipient)
        onClose()
    }

    return (
        //Container for compose email card - throw it to the bottom right and put a shadow on it 
        <div className="card shadow position-fixed bottom-0 end-0 m-5 w-25">

            <h6 className="border-bottom position-absolute start-0 top-0 m-2">Compose Email</h6>
            <button onClick={onClose} className="btn-close position-absolute end-0 top-0 m-1"></button>

            {/* Very HTML-ish philosophy for cards. Header and Body section */}
            <div className="mt-3">
                <input className="border-bottom form-control border-0 shadow-none" placeholder="Recipient"/>
            </div>

            <div className="card-body">
                <textarea rows={6} className="form-control border-0 shadow-none w-100" placeholder="Write your message here..."/>
            </div>

            <button className="btn btn-sm btn-outline-primary mt-3 mx-auto d-block" onClick={sendEmail}>Send</button>

        </div>
        
    );
};