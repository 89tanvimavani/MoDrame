import axios from 'axios'
import { env } from '../config'
import { _throw } from '../services/error-service'

export const api_get_channel = async (token, channelId) => {
  try {
    const res = await axios.get(`${env.API}/channel/${channelId}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_channel_posts = async (token, id, page, itm_per_p, app_open) => {
  try {
    const res = await axios.get(`${env.API}/channel/${id}/videos?itm_per_p=${itm_per_p}&page=${page}&app_open${app_open}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_update_channel = async (token, id, data) => {
  try {
    const res = await axios.put(`${env.API}/channel/${id}`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_create_post = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/channel-drama`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_follow_channel = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/channel/${data}/follow`, {}, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_new_channels = async (token) => {
  try {
    const res = await axios.get(`${env.API}/new-channels`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}