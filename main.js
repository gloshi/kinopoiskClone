const API = "83b1c3b9-f820-45b8-b097-ffb20ad84273";
const url = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const options = {
  method: "GET",
  headers: {
    "X-API-KEY": API,
    "Content-Type": "application/json",
  },
};

const filmsWrapper = document.querySelector(".films");

const loader = document.querySelector(".loader-wrapper");
const btnLoad = document.querySelector(".show-more");

btnLoad.onclick = fetchAndRenderFilms;

let page = 1;

async function fetchData(url, options) {
  const resp = await fetch(url, options);
  const data = await resp.json();
  return data;
}

async function fetchAndRenderFilms() {
  try {
    //показать прелоудер
    loader.classList.remove("none");
    const resp = await fetch(url + `top?page=${page}`, options);
    const data = await resp.json();
    console.log(data);
    if (data.pagesCount > 1) page = page + 1;

    //проверка на дополнительные страницы
    if (data.pagesCount > 1) {
      //отобразить кнопку
      btnLoad.classList.remove("none");
    }

    //hide прелоудер
    loader.classList.add("none");

    renderFilms(data.films);
    if (page > data.pagesCount) {
      //отобразить кнопку
      btnLoad.classList.add("none");
    }
  } catch (error) {
    console.log(error);
  }
}

function renderFilms(films) {
  for (film of films) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = film.filmId;
    //film id

    card.onclick = openFilmDetails;

    const html = `
        <img src="${film.posterUrl}" alt="cover" class="card__img" >
        <h3 class="card__title">${film.nameRu}</h3>
        <p class="card__year">${film.rating}</p>
        <p class="card__rate">Рейтинг: ${film.year}</p>
     `;

    card.insertAdjacentHTML("afterbegin", html);

    // filmsWrapper.insertAdjacentHTML("beforeend", html);
    filmsWrapper.insertAdjacentElement("beforeend", card);
  }
}

async function openFilmDetails(e) {
  //получили id фильма
  const id = e.currentTarget.id;

  //получаем данные по фильму
  const data = await fetchData(url + id, options);
  console.log(data);

  //отобразить детали
  renderFilmData(data);
}

function renderFilmData(film) {
  //проверка на открытый фильм и его удаление
  if (document.querySelector(".container-right"))
    document.querySelector(".container-right").remove();

  // 1. Отрендерить container-right
  const containerRight = document.createElement("div");
  containerRight.classList.add("container-right");
  document.body.insertAdjacentElement("beforeend", containerRight);

  // 2. Кнопка закрытия
  const btnClose = document.createElement("button");
  btnClose.classList.add("btn-close");
  btnClose.innerHTML = '<img src="./img/cross.svg" alt="Close" width="24">';
  containerRight.insertAdjacentElement("afterbegin", btnClose);

  btnClose.onclick = () => {
    containerRight.remove();
  };

  const html = `<div class="film">

  <div class="film__title">${film.nameRu}</div>

  <div class="film__img">
      <img src=${film.posterUrl} alt="${film.coverUrl}">
  </div>

  <div class="film__desc">
      <p class="film__details">Год: ${film.year}</p>
      <p class="film__details">Рейтинг: ${film.ratingImdb}</p>
      <p class="film__details">Продолжительность: ${formatTime(
        film.filmLength
      )}</p>
      <p class="film__details">Страна:${formatCountry(film.countries)}</p>
      <p class="film_text">${film.description}</p>
  </div>
</div>`;

  containerRight.insertAdjacentHTML("beforeend", html);
}

function formatTime(value) {
  let lenght = "";
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (hours > 0) lenght += hours + " ч.";
  if (minutes > 0) lenght += minutes + " мин.";

  return lenght;
}

function formatCountry(countriesArray) {
  let countries = ''

  for (country of countriesArray){
    countries += country.country
    if(countriesArray.indexOf(country) + 1 < countriesArray.lenght) countries += ', '
  }

  return countries
}

fetchAndRenderFilms();
