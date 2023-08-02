import React, { useContext } from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Main = ({ onEditAvatar, onEditProfile, onAddPlace, onCardClick, cards, onCardLike, onCardDelete }) => {
  const currentUser = useContext(CurrentUserContext);
  const { name, about, avatar } = currentUser;

  return (
    <>
      <main>
        <section className="profile">
          <div className="profile__card">
            <img className="profile__avatar" src={avatar} alt="Картинка аватарка" />
            <button className="profile__avatar-button" onClick={onEditAvatar}></button>
            <div className="profile__info">
              <h1 className="profile__name">{name}</h1>
              <button type="button" aria-label="Редактировать" className="profile__edit-button" onClick={onEditProfile}></button>
              <p className="profile__description">{about}</p>
            </div>
          </div>
          <button type="button" aria-label="Добавить" className="profile__add-button" onClick={onAddPlace}></button>
        </section>

        <section className="elements">
          {cards.map((card) => {
            return <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />;
          })}
        </section>
      </main>
    </>
  );
};

export default Main;
