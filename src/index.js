import fetchImage from './js/axiosFetchImg';
import renderGallery from './js/galleryMarkup';
import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryRef = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');

let gallery = new SimpleLightbox('.gallery a');
let query = '';
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', onFormSearch);

function onFormSearch(evt) {
  evt.preventDefault();
  page = 1;
  const query = evt.target.searchQuery.value.trim().toLowerCase();
  galleryRef.innerHTML = '';
  console.log(query);

  if (!query) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }

  fetchImage(query, page, perPage)
    .then(({ data }) => {
      if (!data.totalHits) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(data.hits);
        gallery.refresh();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

// function addListMarkup(markup = '') {
//   galleryRef.insertAdjacentHTML('beforeend', markup);
// }

// searchForm.addEventListener('submit', onFormSearch);

// async function onFormSearch(evt) {
//   evt.preventDefault();

//   const query = evt.target.searchQuery.value.trim().toLowerCase();
//  galleryRef.innerHTML = '';
//   console.log(query);

//   if (!query) {
//     alertInputEmpty();
//     return;
//   }

//   try {
//     page = 1;
//     const data = await fetchImage(query, page, perPage);
//     console.log(data);
//     if (!data.totalHits) {
//      galleryRef.innerHTML = '';
//       alertInputEmpty();
//       return;
//     } else {
//       Notify.success(`Hooray! We found ${data.totalHits} images.`);
//       const markup = renderGallery(data);
//       function addListMarkup(markup) {
//       }
//     }
//   } catch (error) {}
// }

// function addListMarkup(markup = '') {
//  galleryRef.insertAdjacentHTML('beforeend', markup);
// }

// function alertInputEmpty() {
//   Notify.failure(
//     `Sorry, there are no images matching your search query. Please try again.`
//   );
// }
