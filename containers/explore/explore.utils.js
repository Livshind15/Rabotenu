import config from "../../config/config";
import axios from "axios";


export const getBooksByByQuery = async ([query]) => {
    const { data } = await axios.post(`${config.firebase}/books/find/`, { query: query });
    return (data || []).map((book, index) => {
      return { ...book, key: index }
    });
  }
  
  export const getBookTree = async (booksIds) => {
    const data = await Promise.all(booksIds.map(bookId => {
        return axios.get(`${config.firebase}/books/tree/${bookId}`).then(res => res.data);
    }))
    return data || [];
  }
  