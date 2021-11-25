import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {

    let response;

    try {
      response = await axios.get(BASE_URL, {
        params: {
          key: '21731854-9555693ffc51276047ef57259',
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: this.page
        }
      });
      this.page += 1;
      // console.log(response);
    } catch (error) {
      console.log(error);
    }

    return response.data;
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