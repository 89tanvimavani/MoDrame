import { getRoot, types } from "mobx-state-tree"
import { api_get_notifications, api_delete_notification } from "../../queries/notifications"
import Notification from '../models/Notification'

const NotificationsStore = types
  .model('NotificationsStore', {
    notifications: types.optional(
      types.array(Notification), []
    ),
    loading: true,
    page: 1,
    itm_p_page: 10,
    empty: false
  })
  .views(self => ({
    get token() {
      return getRoot(self).authStore.token
    },
    get usersFactory() {
      return getRoot(self).usersFactory
    },
  }))
  .actions(self => ({

    async nextPage() {
      try {
        self.set('loading', true)
        self.set('page', self.page+1)
        await self.getNotifications()
        self.set('loading', false)
      } catch (err) {
        self.set('loading', false)
      }
    },

    async getNotifications(reset=false) {
      try {

        self.set('loading', true)

        if (reset) {
          self.set('page', 1)
          self.set('empty', false)
        }

        const res = await api_get_notifications(
          self.token, 
          self.page,
          self.itm_p_page
        )
        if (res.error) throw res
 
        self.pushNotifications(res.data, reset)

        self.set('loading', false)

        return res.data
      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    async deleteNotification(id) {
      try {
        self.set('loading', true)

        const res = await api_delete_notification(self.token, id)
        if (res.error) throw res
        
        self.set('notifications', self.notifications.filter(n => { return n.id != id }))
        self.set('loading', false)

        return res.data
      } catch (err) {
        self.set('loading', false)
        return err
      }
    },
    pushNotifications(data, reset) {
      if (!reset && data.length < 10) self.set('empty', true)
      if (reset) return self.set('notifications', data)
      return self.notifications.push(...data)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default NotificationsStore