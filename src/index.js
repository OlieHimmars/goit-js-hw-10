import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const search = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const debounced = debounce((e) => {
    onSearch(e);
}, DEBOUNCE_DELAY);

search.addEventListener('input', debounced);

function onSearch(e) {
    e.preventDefault();

    searchCountryAPI(search.value.trim())   //чому не ігноруються пробіли?
        .then(data => {
            if (data.length > 10) {
                Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
                countryInfo.innerHTML = '';
                list.innerHTML = '';
                return;
            }
            else if (data.length === 1) {
                countryInfo.innerHTML = createMarkup(data);
                list.innerHTML = '';
            }
            else{
                list.innerHTML = createListMarkup(data);
                countryInfo.innerHTML = '';
            }
        })
        .catch(err=>console.log(err))
}


function searchCountryAPI(name) {
    const BASE_URL = 'https://restcountries.com/v3.1/name/';
    const options = {
         method: "GET",}
    return fetch(`${BASE_URL}${name}?fields=name,capital,flags,population,languages`, options)
        .then(resp => {
            if (!resp.ok) {
                Notiflix.Notify.failure(`Oops, there is no country with that name`);
                countryInfo.innerHTML = '';
                list.innerHTML = '';
                throw new Error(resp.statusText);
            }
            return resp.json()
        })
};

function createListMarkup(arr) {
    return arr.map(({
        name,
        flags,
    }) =>
        `<li class="country--item">
        <img src="${flags.svg}" alt="flag of ${name}" height="16px">
        <h3 class="country--text">${name.official}</h3>
        </li>`
    ).join('')
};

function createMarkup(arr) {
    return arr.map(({
        name,
        flags,
        capital,
        population,
        languages,
    }) =>
        `<div class="country--name"><img src="${flags.svg}" alt="flag of ${name}" height="32px">
        <h2 class="country--info--text">${name.official}</h2></div>
        <h3>Capital: <span>${capital}</span></h3>
        <h3>Population: <span>${population}</span></h3>
        <h3>Languages: <span>${languages.value}</span></h3>` //як дістати список?
    ).join('')
};