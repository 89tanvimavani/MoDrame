import { getRoot, types } from "mobx-state-tree"
import Asset from "./Asset"
import Challenge from "./Challenge"
import User from "./User"
import Reaction from "./Reaction"
import Reward from "./Reward"
import find from 'lodash/find'
import { REACTION_TYPES } from "../../constants/types"
import filter from "lodash/filter"

const Drama = types
  .model('Drama', {
    id: types.identifierNumber,
    description: types.maybeNull(types.string),
    tags: types.maybeNull(types.array(types.string), []),
    hashId: types.string,
    user: types.maybeNull(types.reference(User)),
    challenge: types.maybeNull(
      types.reference(Challenge)),
    winning: types.maybeNull(types.boolean),
    views: types.maybeNull(types.number),
    frame: types.maybeNull(types.boolean),
    video: types.maybeNull(
      types.optional(Asset, {}
    )),
    reward: types.maybeNull(
      types.optional(Reward, {})
    ),
    numberOfReactions: types.optional(types.number, 0),
    reactions: types.optional(
      types.array(Reaction), [
        {
          counter: 0,
          liked: false,
          type: REACTION_TYPES.NICE
        },
        {
          counter: 0,
          liked: false,
          type: REACTION_TYPES.ANGRY
        },
        {
          counter: 0,
          liked: false,
          type: REACTION_TYPES.SAD
        },
        {
          counter: 0,
          liked: false,
          type: REACTION_TYPES.OH
        }
      ]
    )
  })
  .views(self => ({
    get accountStore() {
      return getRoot(self).accountStore
    },
    get mine() {
      return self.user?.id === self.accountStore.user?.id
    },
    get winner() {
      return self.winning
    },
    get reactionTypes() {
      return filter(self.reactions, r => r.counter !== 0 )
    },
    get formattedViews() {
      const views = self.views

      if (views > 1000 && views < 1000000) {
        const v = (views/1000).toFixed(1)
        return `${v}k`
      } else if (views > 1000000) {
        const v = (views/1000000).toFixed(1)
        return `${v}M`
      }
      return views
    },
    get border() {
      if (self.frame)
        return self.user?.zodiac?.frame
    },
    get icon() {
      if (self.frame)
        return self.user?.zodiac?.icon
    }
  }))
  .actions(self => ({
    update(drama) {
      self.set('description', drama.description)
      self.set('hashId', drama.hashId)
      self.set('video', drama.video)
      self.set('tags', drama.tags)
      self.set('frame', drama.frame)
      self.set('winning', drama.winning)
      self.set('views', drama.views)
      if (drama.reward)
        self.set('reward', drama.reward)
      self.set('reactions', [
        {
          counter: 0,
          liked: false,
          type: REACTION_TYPES.NICE
        },
        {
          counter: 0,
          liked: false,
          type: REACTION_TYPES.ANGRY
        },
        {
          counter: 0,
          liked: false,
          type: REACTION_TYPES.SAD
        },
        {
          counter: 0,
          liked: false,
          type: REACTION_TYPES.OH
        }
      ])
    },
    updateReactionCount(add) {
      self.set('numberOfReactions', self.numberOfReactions+add)
    },
    updateReactions(reactions, sum) {
      self.reactions.map(reaction => {
        reaction.update(
          find(reactions, r => r.reaction === reaction.type)
        )
      })
      self.set('numberOfReactions', sum)
    },
    reactionId(type) {
      return self.reactions?.findIndex(r => r.type === type)
    },
    pushNewReaction(reaction) {
      self.reactions.push(reaction)
    },
    set(key, value) {
      self[key] = value
    }
  }))

export default Drama