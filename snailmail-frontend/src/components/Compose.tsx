import React from "react";

//TODO: state object for mailToSend

//Takes props of the function that closes this component (Defined in App.tsx)
interface Props {
  onClose: () => void;
}

export const Compose: React.FC<Props> = ({ onClose }) => {

    const sendEmail = () => {
        alert("sent mail lol")
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