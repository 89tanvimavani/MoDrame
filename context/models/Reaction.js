import { types } from "mobx-state-tree"

const Reaction = types
  .model('Reaction', {
    type: types.identifier,
    counter: types.maybeNull(types.number),
    liked: types.maybeNull(types.boolean),
  })
  .views(self => ({
  }))
  .actions(self => ({
    toggle() {
      self.set('liked', !self.liked)
    },
    update(rawReaction) {
      if (rawReaction) {
        self.set('counter', parseInt(rawReaction.count))
        self.set('liked', rawReaction.reacted)
      } else self.reset()
    },

    reset() {
      self.set('counter', 0)
      self.set('liked', false)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default Reaction