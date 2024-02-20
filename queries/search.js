import axios from 'axios'
import { env } from '../config'
import { _throw } from '../services/error-service'


export const api_search = async (token, query) => {
  try {
    const res = await axios.get(`${env.API}/search-users/` + query, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}