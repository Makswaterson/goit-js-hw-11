import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '33002321-19e26a2e0d80c5887f70d695a';

export default async function fetchImage(query, page = 1, perPage) {
  try {
    const response = await axios.get(
      `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response;
  } catch (error) {
    throw new Error(console.log(responce.statusText));
  }
}
