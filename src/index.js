import './sass/main.scss';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/fontawesome';
import 'bootstrap/dist/css/bootstrap';
import Notiflix from 'notiflix';
import ImagesApiService from './js/fetchImages';
import LoadMoreBtn from './js/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const cardsWrapper = document.querySelector('.gallery');
const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const lightbox = new SimpleLightbox('.gallery .photo-card a');

const renderCards = (wrapper, object) => {
  object.forEach(element => {
    wrapper.insertAdjacentHTML('beforeend', `<div class="photo-card">
            <a href="${element.largeImageURL}"><img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" /></a>
            <div class="info">
                <p class="info-item">
                <b>Likes</b>
                ${element.likes}
                </p>
                <p class="info-item">
                <b>Views</b>
                ${element.views}
                </p>
                <p class="info-item">
                <b>Comments</b>
                ${element.comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>
                ${element.downloads}
                </p>
            </div>
        </div>`);
  });
};

const clearInnerHtml = wrapper => {
  wrapper.innerHTML = '';
};

const fetchImagesHandler = () => {
  loadMoreBtn.disable();
  imagesApiService.fetchImages().then(result => {
    // console.log(result);

    if (result.hits.length === 0) {
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.hide();
      return;
    }

    if (imagesApiService.currPage === 2) {
      Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
    }

    if (result.hits.length < 40) {
      Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
      loadMoreBtn.hide();
    }
    renderCards(cardsWrapper, result.hits);
    lightbox.refresh();
    loadMoreBtn.enable();
  }).then(data => {
    if (imagesApiService.currPage > 2) {
      const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  });
};

const searchHandler = e => {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (imagesApiService.query === '') {
    Notiflix.Notify.info('Please enter something.');
    return;
  }

  loadMoreBtn.show();
  imagesApiService.resetPage();
  clearInnerHtml(cardsWrapper);
  fetchImagesHandler();
};



form.addEventListener('submit', searchHandler);
loadMoreBtn.refs.button.addEventListener('click', fetchImagesHandler);