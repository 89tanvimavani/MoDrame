import { getRoot, types } from "mobx-state-tree"
import { api_get_reaction_by_id, api_create_reaction } from "../../queries/reaction"
import Drama from "../models/Drama"
import map from 'lodash/map'

const ReactionStore = types
  .model('ReactionStore', {
    drama: types.maybeNull(
      types.reference(
        Drama
      )
    ),
    myReactions: types.optional(
      types.array(
        types.reference(Drama)
      ), []
    )
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    },
    get homeStoreDramaIds() {
      return map(getRoot(self).homeStore.dramas, d => d.id)
    },
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get homeStore() {
      return getRoot(self).homeStore
    }
  }))
  .actions(self => ({
    addUpdateReactions(dramas) {
      Promise.all(dramas.map(async drama => {
        const d = await self.dramasFactory.getDrama(drama.dramaId)
        if (d) {
          d.updateReactions(drama.stats, drama.sumReact) 
        } 
      }))
      .then(() =>  self.homeStore.updateFlatListData())
    },
    async getReactionsById(ids=null) {
      let dramaIds = ids
      if (!dramaIds)
        dramaIds = self.homeStoreDramaIds

      try {
        const res = await api_get_reaction_by_id(self.token, dramaIds)
        if (res.error) throw res
        self.addUpdateReactions(res.data)
        return res.data
      } catch (err) {
        return err
      }
    },
    async createReaction(reactionType, dramaId, add) {
      try { 
        let data = {
          dramaId,
          reaction: reactionType
        }

        self.updateReactionCount(dramaId, add)

        const res = await api_create_reaction(self.token, data)
        if (res.error) throw res

        return res.data
      } catch (err) {
        return err
      }
    },
    async updateReactionCount(dramaId, add) {
      let drama = await self.dramasFactory.getDrama(dramaId)
      drama.updateReactionCount(add)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default ReactionStore