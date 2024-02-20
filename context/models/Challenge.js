import { getRoot, types } from "mobx-state-tree"
import Prize from  "./Prize"
import Asset from "./Asset"
import find from 'lodash/find'
import { CHALLENGE_STATUS } from "../../constants/types"
import { DateTime } from "luxon"

const Challenge = types
  .model('Challenge', {
    id: types.identifierNumber,
    hashId: types.maybeNull(types.string),
    createdBy: types.maybeNull(types.number),
    description: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    birthday: types.maybeNull(types.boolean),
    title: types.maybeNull(types.string),
    dueDate: types.maybeNull(types.string),
    monthyear: types.maybeNull(types.string),
    video: types.maybeNull(types.optional(Asset, {})),
    prizes: types.maybeNull(
      types.optional(
        types.array(Prize), []
      )
    )
  })
  .views(self => ({
    get accountStore() {
      return getRoot(self).accountStore
    },
    get winningDrama() {
      return find(self.accountStore.winningDramas, wd => wd.challenge.id === self.id)
    },
    get iWon() {
      return self.winningDrama
    },
    get isPast() {
      if (self.status === CHALLENGE_STATUS.PAST || DateTime.fromISO(self.dueDate) < DateTime.now()) return true
      else return false
    },
    get inReview() {
      return self.status === CHALLENGE_STATUS.NOT_CONSIDERING || self.status === CHALLENGE_STATUS.REVIEW ||
             self.status === CHALLENGE_STATUS.DECLINED
    },
    get challengeStatus() {
      if (self.inReview || !self.isPast) return self.status
      return CHALLENGE_STATUS.PAST
    },
    get challengeDueInDays() {
      const date = DateTime.now()
      const diff = date.diff(DateTime.fromISO(self.dueDate), ['days'])
      return Math.abs(Math.floor(diff.days))
    },
    get prizesByOrder() {
      return self.prizes.slice().sort((a, b) => parseFloat(a.order) - parseFloat(b.order))
    },
    get dueDateStr() {
      return DateTime.fromISO(self.dueDate).toFormat('LLL dd')
    },
    get isMyBirthdayMonth() {
      return self.monthyear?.slice(0,-4) == self.accountStore.user?.birthdayMonthNumber
    },
    get disableParticipate() {
      return self.isPast || self.inReview || self.birthday && !self.isMyBirthdayMonth
    }
  }))
  .actions(self => ({
    update(challenge) {
      self.set('description', challenge.description)
      self.set('status', challenge.status)
      self.set('title', challenge.title)
      self.set('birthday', challenge.birthday)
      self.set('dueDate', challenge.dueDate)
      self.set('monthyear', challenge.monthyear)
      self.set('video', challenge.video)
      if (challenge.prizes)
        self.set('prizes', challenge.prizes)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default Challenge