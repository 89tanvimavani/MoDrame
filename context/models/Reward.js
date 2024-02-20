import { types } from "mobx-state-tree"

const Reward = types
  .model('Reward', {
    prize: types.maybeNull(types.number),
    status: types.maybeNull(types.string)
  })
  .views(self => ({
  }))
  .actions(self => ({
    set(key, value) {
      self[key] = value
    }
  }))

export default Reward