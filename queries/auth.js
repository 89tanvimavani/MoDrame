import axios from 'axios'
import { env } from '../config'
import { _throw } from '../services/error-service'


export const api_signup_phone = async (data) => {
  try {
    const res = await axios.post(`${env.API}/signup-phone`, data, {
      headers: {
        'Authorization': env.BASIC_AUTH
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_signup_email = async (data) => {
  try {
    const res = await axios.post(`${env.API}/signup-email`, data, {
      headers: {
        'Authorization': env.BASIC_AUTH
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_login = async (data) => {
  try {
    const res = await axios.post(`${env.API}/login`, data, {
      headers: {
        'Authorization': env.BASIC_AUTH
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_verify = async (data) => {
  try {

    const res = await axios.post(`${env.API}/verify`, data, {
      headers: {
        'Authorization': env.BASIC_AUTH
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_resend = async (data) => {
  try {

    const res = await axios.post(`${env.API}/resend`, data, {
      headers: {
        'Authorization': env.BASIC_AUTH
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_find_handle = async (data) => {
  try {

    const res = await axios.post(`${env.API}/verify-handle`, data, {
      headers: {
        'Authorization': env.BASIC_AUTH
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_verify_phone = async (to) => {
  try {
    const res = await axios.post(`${env.API}/verify-phone`, {phone: to}, {
      headers: {
        'Authorization': env.BASIC_AUTH
      }
    })
    return res.data.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_logout = async (token) => {
  try {
    const res = await axios.post(`${env.API}/logout`, null, {
      headers: {
        'Authorization': token
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_terminate_account = async (token) => {
  try {
    const res = await axios.post(`${env.API}/terminate-account`, null, {
      headers: {
        'Authorization': token
      }
    })

    return res.data
  } catch (err) {
    return _throw(err)
  }
}