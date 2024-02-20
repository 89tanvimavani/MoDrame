import axios from "axios"
import { _throw } from "../services/error-service"
import { env } from '../config'

export const api_create_drama = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/drama`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_dramas = async (token, page, itm_per_p, reset) => {
  try {
    const res = await axios.get(`${env.API}/dramas?page=${page}&itm_per_p=${itm_per_p}&reshuffle=${reset}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_update_drama = async (token, data) => {
  try {
    const res = await axios.put(`${env.API}/drama`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_user_dramas = async (token, userId, page, itm_per_p, app_open) => {
  try {
    const res = await axios.get(`${env.API}/user-dramas?userId=${userId}&page=${page}&itm_per_p=${itm_per_p}&app_open=${app_open}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_challenge_dramas = async (token, challengeId, page, itm_per_p, app_open) => {
  try {
    const res = await axios.get(`${env.API}/challange/dramas/${challengeId}?page=${page}&itm_per_p=${itm_per_p}&app_open=${app_open}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_drama = async (token, dramaId) => {
  try {
    const res = await axios.get(`${env.API}/drama/${dramaId}`, {
      headers: {
        'Authorization': token
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_post_drama_views = async (token, data) => {
  try {
    const res = await axios.put(`${env.API}/views`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_drama_by_hash_id = async (token, hashId) => {
  try {
    const res = await axios.get(`${env.API}/drama-hash/${hashId}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_winners = async (token) => {
  try {
    const res = await axios.get(`${env.API}/winners`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}