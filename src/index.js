import fetchImage from './js/axiosFetchImg';
import renderGallery from './js/galleryMarkup';
import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');

let query = '';
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', onFormSearch);

async function onFormSearch(evt) {
  evt.preventDefault();
  const query = await evt.target.searchQuery.value.trim().toLowerCase();
  gallery.innerHTML = '';
  console.log(query);

  if (!query) {
    alertInputEmpty();
    return;
  }

  try {
    page = 1;
    const data = await fetchImage(query, page, perPage);
    console.log(data);
    if (!data.totalHits) {
      gallery.innerHTML = '';
      alertInputEmpty();
      return;
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      const markup = renderGallery(data);

      gallery.insertAdjacentHTML('beforeend', markup);
    }
  } catch (error) {}
}

function alertInputEmpty() {
  Notify.failure(
    `Sorry, there are no images matching your search query. Please try again.`
  );
}
