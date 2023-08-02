import React, { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

const EditProfilePopup = ({ isOpen, onClose, onUpdateUser }) => {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdateUser({
      username: name,
      job: description,
    });
  };

  return (
    <PopupWithForm name="edit" title="Редактировать профиль" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} buttonText={"Сохранить"}>
      <fieldset className="popup__form" name="form">
        <input
          className="popup__input popup__input_type_name"
          type="text"
          id="name"
          name="username"
          minLength="2"
          maxLength="40"
          placeholder="Имя"
          required
          value={name}
          onChange={handleNameChange}
        />
        <span className="popup__input-error popup__input-error_type_name"></span>
        <input
          className="popup__input popup__input_type_description"
          type="text"
          id="job"
          name="job"
          minLength="2"
          maxLength="200"
          placeholder="Описание"
          required
          value={description}
          onChange={handleDescriptionChange}
        />
        <span className="popup__input-error popup__input-error_type_description"></span>
      </fieldset>
    </PopupWithForm>
  );
};

export default EditProfilePopup;
