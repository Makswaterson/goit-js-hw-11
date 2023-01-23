import fetchImage from './js/axiosFetchImg';
import renderGallery from './js/galleryMarkup';
import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryRef = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

let gallery = new SimpleLightbox('.gallery a');
let query = '';
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', onFormSearch);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onFormSearch(evt) {
  evt.preventDefault();
  page = 1;
  const query = evt.target.searchQuery.value.trim().toLowerCase();
  galleryRef.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

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
      if (data.totalHits > perPage) {
        loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onLoadMoreBtn() {
  page += 1;
  fetchImage(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      gallery.refresh();
      smoothScroll();
      const totalPages = Math.ceil(data.totalHits / perPage);
      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
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
