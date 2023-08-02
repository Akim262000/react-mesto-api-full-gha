import { useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm";

const AddPlacePopup = ({ isOpen, onclose, onAddPlace }) => {
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddPlace({
      name: description,
      link: image,
    });
  };

  useEffect(() => {
    setImage("");
    setDescription("");
  }, [isOpen]);

  return (
    <PopupWithForm name="new-card" title="Новое место" isOpen={isOpen} onClose={onclose} onSubmit={handleSubmit} buttonText={"Создать"}>
      <fieldset className="popup__form" name="form">
        <input
          className="popup__input popup__input_type_title"
          type="text"
          id="title"
          name="name"
          minLength="2"
          maxLength="30"
          placeholder="Название"
          required
          onChange={handleDescriptionChange}
          value={description}
        />
        <span className="popup__input-error popup__input-error_type_title"></span>
        <input
          className="popup__input popup__input_type_image"
          type="url"
          id="link"
          name="link"
          placeholder="Ссылка на картинку"
          required
          onChange={handleImageChange}
          value={image}
        />
        <span className="popup__input-error popup__input-error_type_image"></span>
      </fieldset>
    </PopupWithForm>
  );
};

export default AddPlacePopup;
