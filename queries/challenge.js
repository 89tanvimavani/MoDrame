import axios from 'axios'
import { env } from '../config'
import { _throw } from '../services/error-service'

export const api_get_challenges = async (token) => {
  try {
    const res = await axios.get(`${env.API}/challenges`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_my_challenges = async (token) => {
  try {
    const res = await axios.get(`${env.API}/my-challenges`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_challenge = async (token, id) => {
  try {
    const res = await axios.get(`${env.API}/challenge/${id}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_create_challenge = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/challenge`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_update_challenge = async (token, data) => {
  try {
    const res = await axios.put(`${env.API}/challenge`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}