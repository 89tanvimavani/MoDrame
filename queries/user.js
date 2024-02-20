import axios from 'axios'
import { env } from '../config'
import { _throw } from '../services/error-service'

export const api_update_onesignalid = async (token, data) => {
  try {
    const res = await axios.put(`${env.API}/user`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_user_stats = async (token, userId) => {
  try {
    const res = await axios.get(`${env.API}/user-stats/${userId}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_winning_dramas = async (token) => {
  try {
    const res = await axios.get(`${env.API}/winning-dramas`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_user = async (token, id) => {
  try {
    const res = await axios.get(`${env.API}/user/${id}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}