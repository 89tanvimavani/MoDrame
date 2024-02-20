import { types } from "mobx-state-tree"

const Prize = types
  .model('Prize', {
    id: types.identifierNumber,
    numberOfPrizes: types.maybeNull(types.number),
    order: types.maybeNull(types.number),
    title: types.maybeNull(types.string)
  })
  .views(self => ({
  }))
  .actions(self => ({
    
    set(key, value) {
      self[key] = value
    }
  }))

export default Prize