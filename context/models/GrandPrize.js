import { getRoot, types } from "mobx-state-tree"
import Asset from "./Asset"

const GrandPrize = types
  .model('GrandPrize', {
    id: types.maybeNull(types.number),
    title: types.maybeNull(types.string),
    descrption: types.maybeNull(types.string),
    photo: types.maybeNull(
      types.optional(Asset, {})),
  })
  .views(self => ({
    
  }))
  .actions(self => ({
    setPrize(prize) {
      self.set('id', prize?.id ? prize.id : null)
      self.set('photo', prize?.photo ? prize.photo : null)
      self.set('title', prize?.title ? prize.title : null)
      self.set('descrption', prize?.descrption ? prize.descrption : null)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default GrandPrize