const BASE_URL = 'https://pixabay.com/api/';

const params = {
  key: '21731854-9555693ffc51276047ef57259',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true
};

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const url = `${BASE_URL}?key=${params.key}&q=${this.searchQuery}&image_type=${params.image_type}&orientation=${params.orientation}&safesearch=${params.safesearch}&per_page=40&page=${this.page}`;
    
    return fetch(url)
      .then(response => response.json())
      .then((data) => {
        this.page += 1;
        return data;
      });
  }

  resetPage() {
    this.page = 1;
  }

  get currPage() {
    return this.page;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}