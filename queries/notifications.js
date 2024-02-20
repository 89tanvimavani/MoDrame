import axios from 'axios'
import { env } from '../config'
import { _throw } from '../services/error-service'

export const api_get_notifications = async (token, page, itm_per_p) => {
  try {
    const res = await axios.get(`${env.API}/notifications?page=${page}&itm_per_p=${itm_per_p}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_delete_notification = async (token, id) => {
  try {
    const res = await axios.delete(`${env.API}/notification?id=${id}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_grand_prize = async (token) => {
  try {
    const res = await axios.get(`${env.API}/grand-prize`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}