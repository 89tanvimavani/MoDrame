import { sortedLastIndexOf } from "lodash"
import { detach, getRoot, types } from "mobx-state-tree"
import { api_create_drama, api_update_drama } from "../../queries/drama"
import Asset from "../models/Asset"

const PublishDramaStore = types
  .model('PublishDramaStore', {
    video: types.optional(
      Asset, {}
    ),
    dramaId: types.maybeNull(types.number),
    frame: types.maybeNull(types.boolean),
    hashId: types.maybeNull(types.string),
    description: types.optional(types.string, ''),
    tags: types.optional(types.array(types.string), []),

    loading: false,
    uploadingError: false
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    },
    get publishing() {
      return self.loading || self.video.loading
    },
    get uploadingVideo() {
      return self.video.loading
    },
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get homeStore() {
      return getRoot(self).homeStore
    },
    get validPublish() {
      return !self.uploadingVideo && self.description
    }
  }))
  .actions(self => ({
    async createDrama(challengeId) {
      try {
        const res = await api_create_drama(self.token, {
          challengeId
        })
        if (res.error) throw res

        self.set('hashId', res.data.hashId)
        self.set('dramaId', res.data.id)

        return res.data
      } catch (err) {
        return err
      }
    },
    async upload(file, challengeId) {

      try {
        self.set('loading', true)
        self.set('uploadingError', false)

        const data = await self.createDrama(challengeId)
        if (data.error) throw data

        const dramaId = data.id
        const hashId = data.hashId

        const video = Asset.create({})
        self.set('video', video)

        const res = await video.upload(dramaId, hashId, self.token, file)

        self.set('loading', false)
        if (res.error) throw res
      } catch (err) {
        self.set('uploadingError', true)
        self.set('loading', false)
        return err
      }
    },
    async updateDrama() {
      try {
        self.set('loading', true)

        const res = await api_update_drama(self.token, {
          drama: {
            id: self.dramaId,
            frame: self.frame,
            description: self.description,
            tags: self.tags
          }
        })

        let data = {
          ...res.data,
          video: {
            ...res.data.video,
            localUrl: self.video?.localUrl
          }
        }

        self.dramasFactory.addUpdateDrama(data)

        self.set('loading', false)
        self.clearData()

        return res.data
        
      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    clearData() {
      self.removeVideo(),
      self.clear()
    },
    removeVideo() {
      if (self.video) detach(self.video)
    },
    clear() {
      self.set('dramaId', null)
      self.set('hashId', null)
      self.set('frame', false)
      self.set('description', '')
      self.set('tags', [])
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default PublishDramaStore