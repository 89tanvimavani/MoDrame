import axios from 'axios'
import { env } from '../config'
import { _throw } from '../services/error-service'

export const api_update_settings = async (token, data) => {
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

export const api_content_report = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/report`, data, {
      headers: {
        'Authorization': token
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_block_user = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/block`, data, {
      headers: {
        'Authorization': token
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_check_version = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/supported-version`, data, {
      headers: {
        'Authorization': token
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}