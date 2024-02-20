import { getRoot, types } from "mobx-state-tree"

const Zodiac = types
  .model('Zodiac', {
    name: types.maybeNull(types.string),
    frameUrl: types.maybeNull(types.string),
    iconUrl: types.maybeNull(types.string)
  })
  .views(self => ({

  }))
  .actions(self => ({
    update(zodiac) {
      self.set('name', zodiac.name)
      self.set('frameUrl', zodiac.frameUrl)
      self.set('iconUrl', zodiac.iconUrl)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default Zodiac