import { getRoot, types } from "mobx-state-tree"
import { api_get_winners } from "../../queries/drama"
import { api_search } from "../../queries/search"
import Drama from "../models/Drama"
import User from "../models/User"

const SearchStore = types
  .model('SearchStore', {
    dramas: types.optional(
      types.array(types.reference(Drama)), []
    ),
    loading: true,

    searchQuery: types.maybeNull(types.string),
    users: types.optional(
      types.array(types.reference(User)), []
    ),
    searchError: false,
    searchLoading: true
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    },
    get dramasFactory() {
      return getRoot(self).dramasFactory
    },
    get usersFactory() {
        return getRoot(self).usersFactory
      }
  }))
  .actions(self => ({
    async getWinningDramas() {
      try {
        self.set('loading', true)

        const res = await api_get_winners(self.token)
        if (res.error) throw res

        const ids = self.dramasFactory.addUpdateDramas(res.data)
        self.set('dramas', ids)
        self.set('loading', false)
        
        return res.data
      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    async search() {
      try {
        self.set('searchLoading', true)
        self.set('searchError', false)
  
        const res = await api_search(self.token, self.searchQuery)
        if (res.error) throw res

        const ids = self.usersFactory.addUpdateUsers(res.data)

        self.set('users', ids)
        self.set('searchLoading', false)
          
        return res.data
      } catch (err) {
        self.set('searchLoading', false)
        self.set('searchError', true)
        return err
      }
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default SearchStore