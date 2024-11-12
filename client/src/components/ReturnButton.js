import React from 'react';
import { IoMdArrowBack } from "react-icons/io";

function ReturnButton({ backToHome }) {
  return (
    <div>
      <button className='back-button' onClick={backToHome}>
      <IoMdArrowBack style={{ color: 'white', fontSize: '24px' }}/>
     </button>
    </div>
  );
}

export default ReturnButton;
