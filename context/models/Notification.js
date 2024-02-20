import { types } from "mobx-state-tree"
import { NOTIFICATION_TYPES } from "../../constants/types"

const Notification = types
  .model('Notification', {
    id: types.identifierNumber,
    title: types.maybeNull(types.string),
    message: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
    seen: types.maybeNull(types.boolean),
    type: types.maybeNull(types.string),
    dataId: types.maybeNull(types.number)
  })
  .views(self => ({
    get notifTitle() {
      if (self.type === NOTIFICATION_TYPES.CH_ACK) return "Hurray! Your challenge was approved"
      else if (self.type === NOTIFICATION_TYPES.CH_DECLINED) return "Sorry, your challenge was declined"
      else if (self.type === NOTIFICATION_TYPES.CH_NOT_CONSIDERING) return "Sorry, your challenge didn't make it"
      else return self.title
    }
  }))
  .actions(self => ({
    dontIndentStr(str){
      return (str.replace(/  +/g, '')).replace(/\n/g, " ");
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default Notification