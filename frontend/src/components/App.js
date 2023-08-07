import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [authorizationEmail, setAuthorizationEmail] = React.useState('');

  const navigate = useNavigate();

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [isSuccessRegistration, setIsSuccessRegistration] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({
    name: "",
    about: "",
    avatar: "",
    _id: "",
    cohort: "",
  });
  const [cards, setCards] = React.useState([]);
  

  React.useEffect(() => {

    if (isLoggedIn) {
      api
      .getInitialCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
    }
   
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (isLoggedIn) {
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
    }
  }, [isLoggedIn]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

    const handleInfoTooltip = () => {
    setIsInfoTooltipOpen(!isInfoTooltipOpen);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleCardDelete(cardId) {
    api
      .deleteCard(cardId)
      .then(() => {
        setCards((cards) => cards.filter((card) => card._id !== cardId));
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  const handleUpdateUser = (newUserInfo) => {
    api
      .setUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
  };

  const handleUpdateAvatar = (newData) => {
    api
      .setUserAvatar(newData)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
  };

  const handleAddPlaceSubmit = (newData) => {
    api
      .addCard(newData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  };

   // Выход 
   const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
    navigate('/sign-in');
  };

  const handleRegistration = (data) => {
    return auth
    .register(data)
    .then(() => {
      setIsSuccessRegistration(true);
      handleInfoTooltip();
      navigate('/sign-in');
    })
    .catch((err) => {
      console.log(err);
      setIsSuccessRegistration(false);
      handleInfoTooltip();
    });
  };

  const handleAuthorization = (data) => {
    return auth
      .authorize(data)
      .then((data) => {
        setIsLoggedIn(true);
        localStorage.setItem('jwt', data.token);
        checkToken();
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        handleInfoTooltip();
      });
  };

  const checkToken = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    auth
      .getContent(jwt)
      .then((data) => {
        setAuthorizationEmail(data.email);
        setIsLoggedIn(true);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    checkToken();
  }, []);

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header isLoggedIn={isLoggedIn} userEmail={authorizationEmail} onSignOut={handleSignOut}/>
        <Routes>
          <Route path="/"
            element = {
              <ProtectedRoute
                // path="/"
                component={Main}
                isLoggedIn={isLoggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                />
            }                
              />

          <Route path="/sign-in" element={<Login onLogin={handleAuthorization}/>} />
          <Route path="/sign-up" element={<Register onRegister={handleRegistration} />} />
          <Route path="*" element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />} />
        </Routes>
        {isLoggedIn && <Footer />}

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onclose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} isSuccess={isSuccessRegistration} />

        <div className="popup popup_type_delete">
          <div className="popup__container">
            <button type="button" aria-label="Закрыть" className="popup__close"></button>
            <h3 className="popup__title">Вы уверены?</h3>
            <form className="popup__form" action="#" name="form" noValidate>
              <button type="submit" className="popup__submit-button">
                Да
              </button>
            </form>
          </div>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
