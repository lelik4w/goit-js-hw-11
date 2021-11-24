import './sass/main.scss';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/fontawesome';
import 'bootstrap/dist/css/bootstrap';
import Notiflix from 'notiflix';
import ImagesApiService from './js/fetchImages';
import LoadMoreBtn from './js/load-more-btn';

const form = document.querySelector('#search-form');
const cardsWrapper = document.querySelector('.gallery');
const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

// Notiflix.Notify.success('Sol lucet omnibus');
// Notiflix.Notify.failure('Qui timide rogat docet negare');
// Notiflix.Notify.warning('Memento te hominem esse');
// Notiflix.Notify.info('Cogito ergo sum');

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
        // console.log(result.hits.length);

        if(imagesApiService.currPage === 2) {
            Notiflix.Notify.info(`Hooray! We found ${result.totalHits} images.`);
        }

        if(result.hits.length < 40) {
            Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
            loadMoreBtn.hide();
        }

        if(result.hits.length === 0) {
            Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.', () => {
                loadMoreBtn.hide();
            }, {
                closeButton: true
            });
            return;
        }
        renderCards(cardsWrapper, result.hits);
        loadMoreBtn.enable();
    });
};

const searchHandler = e => {
    e.preventDefault();

    imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
    
    if(imagesApiService.query === '') {
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