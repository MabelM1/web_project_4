import "./index.css"
import { Card } from '../components/Card.js'
import {Section} from '../components/Section.js'
import {PopupWithImage} from '../components/PopupWithImage.js'
import {PopupWithForm} from '../components/PopupWithForm.js'
import { FormValidator } from '../components/FormValidator.js'
import { UserInfo } from '../components/UserInfo.js';
import {Api} from '../components/Api.js';
import { nameInput, aboutInput, profile, editPhoto} from '../utils/constants.js'

let placesCard = null;

const formPopupConfirm = new PopupWithForm('.popup_type_confirm')
const formPopupAdd = new PopupWithForm('.popup_type_add-place')
const formPopupEdit = new PopupWithForm('.popup_type_edit')
const formPopupProfileEdit = new PopupWithForm('.popup_type_profile-picture')

const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-1",
  headers: {
    authorization: "8d98f55e-f3f5-4d31-8928-0111e1b03804",
    "Content-Type": "application/json"
  }
});

const userInfo = new UserInfo({name: ".profile__name",job: ".profile__title",avatar: ".avatar"})
const imagePopup = new PopupWithImage('.popup_type_large-image')

let userId = null;

const fetchInitialData = () => {
  fetchProfile()
  fetchCards()
}

const fetchCards = () => {
  api.getInitialCards()
  .then(data => {
    createSection(data)
  })
  .catch( err => {
    console.log(err)
  })
}

const fetchProfile = () => {
  api.getProfile()
  .then(({_id, name, avatar, about}) => {
    userId = _id
    const obj = {name, avatar, id: _id, job:about}
    userInfo.setUserInfo(obj)
  })
  .catch( err => {
    console.log(err)
  })
}

const createSection = (data) => {
  placesCard = new Section({
      items: data,
      renderer: addCard
    }, ".places")

  placesCard.renderItems()
}

const addCard = (item) => {
  const obj ={...item, userId}

  const card = new Card(obj, "#place-template", (data) => {

    if (data.image && data.text) {

       imagePopup.open(data)

    } else if (data.cardId && data.method === 'put') {

      const res =  api.addLikes(data.cardId)
      .then(value => {
        return value.likes
      })
       return res
     } else if (data.cardId && data.method === 'delete') {
      const res =  api.deleteLikes(data.cardId)
      .then(value => {
        return value.likes
      })
      return res

     } else if (data.method === 'confirm') {
      formPopupConfirm.setSubmitFormCallback(
        inputValues => {
        api.deleteCard(data.cardId)
          .then(res => {
            removeCard(data.cardId)
          })
      })
      formPopupConfirm.open()

    }
  })

  const cardElement = card.generateCard()
  placesCard.addItem(cardElement)
}

const removeCard = (cardId) => {
  const placeListArray = Array.from(document.querySelectorAll(".place"))

  const card = placeListArray.find(place => place.dataset.cardId === cardId)
  card.remove()
}

const handleProfileClick = (e) => {
  if (e.target.classList.contains("button_edit")) {
    const {name, job}  = userInfo.getUserInfo()
     nameInput.value = name;
     aboutInput.value = job;

    formPopupEdit.setSubmitFormCallback(
      (data) => {
        const newObj = {name:data.name , about: data.job}
        api.updateProfileData(newObj)
          .then((res) => {
            const obj = {name: res.name, job:res.about}
            userInfo.setUserInfo(obj)
          })
        }
    )
    formPopupEdit.open()
  } else if (e.target.classList.contains("button_add")) {
    formPopupAdd.setSubmitFormCallback(
      data => {
        const {title:name, link} = data

        api.postCard({name,link})
        .then(res => {
          addCard(res)
        })
      }
    )
    formPopupAdd.open()
  }
}

const handlePhotoUpdateClick = (e) => {
  formPopupProfileEdit.setSubmitFormCallback(
    (data) => {
      api.updateProfileAvatar(data.photo)
      .then(res => {
        userInfo.setUserInfo({avatar: res.avatar})
      })
    }
  )
  formPopupProfileEdit.open()
}

const enableValidation = ({ formSelector, ...rest }) => {
  const forms = Array.from(document.querySelectorAll(formSelector));

  forms.forEach(form => {
    const formValidation = new FormValidator(form, rest)
    formValidation.enableValidation()
  })
}

enableValidation({
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  errorClass: "popup__error_visible",
  inputErrorClass: "popup__input_type_error",
});

profile.addEventListener("click", handleProfileClick);
editPhoto.addEventListener("click", handlePhotoUpdateClick);
window.addEventListener("load", fetchInitialData);





