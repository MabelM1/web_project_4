const popupContainer = Array.from(document.querySelectorAll('.popup'));
//Edit popup
const editPopup = document.querySelector('.popup_type_edit');
const editForm = editPopup.querySelector('.popup__form');

//Add place popup
const addPlacePopup = document.querySelector('.popup_type_add-place');
const addPlaceForm = addPlacePopup.querySelector('.popup__form');
const addPlaceCaption = addPlacePopup.querySelector('.popup__name');
const addPlaceImageLink = addPlacePopup.querySelector('.popup__about');

// Large Image popup
const largeImagePopup = document.querySelector('.popup_type_large-image');
const largeImage = largeImagePopup.querySelector('.popup__image');
const largeImageTitle = largeImagePopup.querySelector('.popup__image-title');

//Form data
const nameInput = editForm.querySelector('.popup__name');
const aboutInput = editForm.querySelector('.popup__about');

//DOM Elements
const profile=  document.querySelector('.profile');
const profileName =  document.querySelector('.profile__name');
const profileTitle =  document.querySelector('.profile__title');
const placeContainer = document.querySelector('.places');
const cardTemplate = document.querySelector("#place-template").content

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://code.s3.yandex.net/web-code/yosemite.jpg"
  },
  {
    name: "Lake Louise",
    link: "https://code.s3.yandex.net/web-code/lake-louise.jpg"
  },
  {
    name: "Bald Mountains",
    link: "https://code.s3.yandex.net/web-code/bald-mountains.jpg"
  },
  {
    name: "Latemar",
    link: "https://code.s3.yandex.net/web-code/latemar.jpg"
  },
  {
    name: "Vanois National Park",
    link: "https://code.s3.yandex.net/web-code/vanois.jpg"
  },
  {
    name: "Lago di Braies",
    link: "https://code.s3.yandex.net/web-code/lago.jpg"
  }
];

const addCard = (card) => {
  const {name,link} = card
  const placeElement =  cardTemplate.cloneNode(true)
  const likeIcon = placeElement.querySelector(".place__icon")
  const deleteIcon = placeElement.querySelector(".place__delete")
  const image =  placeElement.querySelector(".place__image")
  const placeName =   placeElement.querySelector(".place__name")

  placeName.textContent = name;
  image.src = link;
  image.alt = name

 likeIcon.addEventListener('click', () => {
    likeIcon.classList.toggle('place__icon_liked')
  })

  deleteIcon.addEventListener('click', (evt) => {
    const parentElenment = evt.target.parentElement
    parentElenment.remove()
 })

  image.addEventListener('click', () => {
    largeImageTitle.textContent = ''
    largeImage.src= ''
    largeImageTitle.textContent = placeName.textContent
    largeImage.src= image.src

    togglePopUp(largeImagePopup )
  })
  placeContainer.append(placeElement)
}

const togglePopUp = (element) => {
  element.classList.toggle('popup_opened')
}

const editFormSubmitHandler = (evt) => {
  evt.preventDefault();

  profileName.textContent = nameInput.value
  profileTitle.textContent = aboutInput.value
  togglePopUp(editPopup)
}

const formReset = (form) => {
  form.reset()
}

const addPlaceFormSubmitHandler = (evt) => {
  evt.preventDefault();
  const name = addPlaceCaption.value
  const link = addPlaceImageLink.value

  addCard({name,link})
  togglePopUp(addPlacePopup)
  formReset(evt.target)
}

const renderCards = (cardArray) => {
  cardArray.forEach(card => addCard(card))
}

const handleOpen = (e) => {
  if (e.target.classList.contains('button_edit')) {
      nameInput.value = profileName.textContent
      aboutInput.value = profileTitle.textContent
      togglePopUp(editPopup )
  } else if (e.target.classList.contains('button_add')) {
    togglePopUp(addPlacePopup)
  }

}

const handleClose = (e) => {
  e.preventDefault()

  if (e.target.classList.contains('popup__container') ||
      e.target.classList.contains('popup__exit') ) {

    togglePopUp(e.currentTarget)
    form =   e.currentTarget.querySelector('.popup__form')
    if (form) {
      formReset(form)
    }
  }
}

const handlePress = (e) => {
  open =  document.querySelector('.popup_opened')
  if (e.key === 'Escape' && open) {
     togglePopUp(open)
  }
}

//EVENT LISTENERS
const addEventListenerCreator = (element, type, callback) => {
  element.addEventListener(type, callback)
}

addEventListenerCreator(window, 'keydown', handlePress )
addEventListenerCreator(window, 'load', renderCards.bind(null,initialCards) )
addEventListenerCreator(editForm, 'submit', editFormSubmitHandler)
addEventListenerCreator(addPlaceForm, 'submit', addPlaceFormSubmitHandler)

popupContainer.forEach(popup => {
  addEventListenerCreator(popup,'click',handleClose)
})
addEventListenerCreator(profile, 'click', handleOpen )


