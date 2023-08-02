import React from "react";
import success from "../images/success.svg"
import unsuccess from "../images/unsuccess.svg"

const InfoTooltip = (props) => {
  return (
    <div className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button type="button" className="popup__close" onClick={props.onClose}></button>
        <img src={props.isSuccess ? success : unsuccess} alt={props.isSuccess ? 'True' : 'False'} className="popup__signup-icon"></img>
        <h3 className="popup__signup-title">{props.isSuccess ? 'Вы успешно зарегистрировались!': 'Что-то пошло не так! Попробуйте ещё раз.'}</h3>
      </div>
    </div>
  );
};

export default InfoTooltip;