import { getRoot, types } from "mobx-state-tree"
import { env } from '../../config'
import axios from 'axios'
import { _throw } from "../../services/error-service"
import { ASSET_TYPE } from "../../constants/types"
import Toast from "react-native-toast-message"
import { _compress } from "../../services/video-compress"
import RNFS from 'react-native-fs';
import { Platform } from "react-native"

const Asset = types
  .model('Asset', {
    id: types.maybeNull(types.number),
    url: types.maybeNull(types.string),
    localUrl: types.maybeNull(types.string),
    thumbnail: types.maybeNull(types.string),
    poster: types.maybeNull(types.string),
    gif: types.maybeNull(types.string),
    low: types.maybeNull(types.string),
    high: types.maybeNull(types.string),
    duration: types.maybeNull(types.number),

    // uploading
    loading: false,
    progress: 0
  })
  .views(self => ({
    get local() {
      if (self.localUrl) return self.localUrl
      else return self.url
    },
    get src() {
      if (self.high) return self.high
      if (self.localUrl) return self.localUrl
      else return self.url
    },
    get uploaded() {
      return self.url || self.progress === 100
    }
  }))
  .actions(self => ({
    afterCreate() {
      
    },
    async upload(primaryId, hashId, token, file, type=ASSET_TYPE.DRAMA_VIDEO) {
      try {
        self.set('progress', 0)
        self.set('localUrl', file.uri)
        self.set('loading', true)
        
        const data = new FormData()
        data.append('type', type)
        data.append('hashId', hashId)
        data.append('primaryId', primaryId)
        data.append('duration', file.duration)

        const extArr = file.uri.split('.')
        const ext = extArr[extArr.length - 1]

        const validExt = ext.length <= 5 ? ext : (type !== ASSET_TYPE.USER_AVATAR  ? 'mp4' : 'jpeg')
        const nameInvalid = !file.fileName || (file.fileName && /^\d+$/.test(file.fileName))

        let stats, destPath=file.uri;
        // copy the file to the real path if real path does not exist
        if (Platform.OS === 'android' && !file.realPath) {
          stats = await RNFS.stat(file.uri)
          let eA = stats.originalFilepath.split('.')
          let extension = eA[eA.length - 1]
          
          const fileName = `temp-file.${extension}`
          destPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
          await RNFS.copyFile(file.uri, destPath);
          await RNFS.stat(destPath);
        }

        let compressedUri = Platform.OS === 'ios' ? file.uri : `file://${destPath}`;
        if (type === ASSET_TYPE.CHALLENGE_VIDEO || type === ASSET_TYPE.DRAMA_VIDEO)
          if (getRoot(self).onDeviceVideoCompression) {
            if (Platform.OS === 'ios')
              compressedUri = await _compress(file.uri)
            else {
              compressedUri = await _compress(destPath)
              compressedUri = `file://${compressedUri}`
            }
          }

        data.append('asset', {
          uri: compressedUri,
          name: nameInvalid ? 'name.' + validExt : file.fileName,
          type: type !== ASSET_TYPE.USER_AVATAR ? 'video/mp4' : 'image/jpeg'
        });
        
        const res = await self.uploadAction(data, token)

        if (res.error) throw res

        self.set('id', res.data.id)
        self.set('duration', res.data.duration)

        const { url } = res.data
        
        if (type !== ASSET_TYPE.CHALLENGE_VIDEO)
          Toast.show({
            type: 'info',
            text1: type !== ASSET_TYPE.USER_AVATAR ? 'Video uploaded' : 'Photo uploaded',
            visibilityTime: 1500
          })

        self.set('url', url)
        self.set('loading', false)

        return res
      } catch (err) {
        self.set('progress', 0)
        self.set('loading', false)
        return _throw(err)
      }
    },
    async uploadAction(data, authToken) {
      try {
        const config = {
          onUploadProgress: progressEvent => {
              const progress = progressEvent.loaded/progressEvent.total
              if (Math.ceil(progress*100) > 0)
                self.set('progress', Math.ceil(progress*100))
              else self.set('progress', 0)
            },
          headers: {
            'content-type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            'Authorization': authToken
          }
        }
  
        const res = await axios.post(`${env.API}/upload-asset`, data, config)  
  
        return res.data
      } catch(err) {
        return _throw(err)
      }
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default Asset