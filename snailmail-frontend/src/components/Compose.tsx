import React, { useState } from "react";

//TODO: state object for mailToSend

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

export const Compose: React.FC<Props> = ({ onClose, ...id }) => {

    //defining state for mail, with a default value for sender (me@snailmail.com)
    const [mailToSend, setMailToSend] = useState<Mail>(
        {
            sender: 'me@snailmail.com',
            recipient: 'default@snailmail.com',
            subject: '',
            body: '',
        })

    const sendEmail = () => {

        console.log("sent mail to: " + mailToSend.recipient)

        alert("sent mail to: " + mailToSend.recipient)
        onClose()
    }

    return (
        //Container for compose email card - throw it to the bottom right and put a shadow on it 
        //Also, note the data attribute at the end. This helps our 5th test recognize the Component.
        <div className="card shadow position-fixed bottom-0 end-0 m-5 w-25" {...id}>

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