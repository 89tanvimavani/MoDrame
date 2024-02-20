import { getRoot, tryReference, types } from "mobx-state-tree"

const GuiStore = types
  .model('GuiStore', {
    connected: true,
    background: false,

    channelLaunchModal: false,
    showGrandPrizeNotif: false,
    outdatedApp: false
  })
  .views(self => ({
   
  }))
  .actions(self => ({
    setGrandPrizeModal() {
      self.set('grandPrizeModal', !self.grandPrizeModal)
    },
    setChannelLaunchModal() {
      self.set('channelLaunchModal', !self.channelLaunchModal)
    },
    setShowGrandPrizeNotif() {
      self.set('showGrandPrizeNotif', !self.showGrandPrizeNotif)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default GuiStore