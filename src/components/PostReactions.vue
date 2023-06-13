<template>
  <a href="#" @click.prevent="onChange">
    <div class="post-reactions" :class="['post-reactions', combinedReactionStyle]">
      <div class="post-reactions__heart" @mouseover="showReactions = true" :class="{ active }">
        <div class="post-reactions__likes">
          <span
            v-if="selectedReaction"
            class="post-reactions__selected"
          >
            <img
              :src="`/static/img/post-reactions/${selectedReaction}.gif`"
              :alt="selectedReaction"
              ref="reactionImg"
            />
          </span>
          <span
            v-else-if="reaction !== null"
            class="post-reactions__selected"
          >
            <img
              :src="`/static/img/post-reactions/${reaction}.gif`"
              :alt="reaction"
              ref="reactionImg"
            />
          </span>
          <span v-else-if="localQuantity === null">
            <like-icon />
          </span>
          <span class="post-reactions__quantity" v-if="quantity !== 0">{{ localQuantity }}</span>
        </div>
        <div class="post-reactions__reactions" v-if="showReactions" @mouseleave="showReactions = false">
          <div v-for="(reaction, index) in reactions" :key="index" class="post-reactions__reaction" @click="addReaction(reaction.type)">
            <img :title="reaction.label" :src="`/static/img/post-reactions/${reaction.type}.gif`" :alt="reaction.label" />
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
import LikeIcon from '../Icons/LikeIcon.vue';
export default {
  components: {
    LikeIcon,
  },
  props: {
    active: null,
    quantity: {
      type: Number,
      required: true
    },
    reaction: String
  },

  data() {
    return {
      reactions: [
        { type: 'heart', label: 'Нравится' },
        { type: 'funny', label: 'Смешно' },
        { type: 'wow', label: 'Ого!' },
        { type: 'delight', label: 'Восторг' },
        { type: 'sadness', label: 'Печаль' },
        { type: 'malice', label: '&$#%!' },
      ],
      showReactions: false,
      localQuantity: null,
      localActive: null,
      selectedReaction: null,
      isGifPlaying: true
    }
  },

  computed: {
    combinedReactionStyle() {
      return this.selectedReaction && this.reaction
        ? `post-reactions--${this.selectedReaction} post-reactions--${this.reaction}`
        : this.selectedReaction
          ? `post-reactions--${this.selectedReaction}`
          : this.reaction
            ? `post-reactions--${this.reaction}`
            : '';
    }
  },

  watch: {
    quantity(val) {
      this.localQuantity = val;
    },
    active(val) {
      this.localActive = val;
    },
  },

  methods: {
    addReaction(reactionType) {
      this.selectedReaction = reactionType;
      this.$emit('reaction-added', reactionType);
    },

    onChange() {
      this.$emit('liked', this.localActive);
      if (this.localActive) this.localQuantity--;
      else this.localQuantity++;
      this.localActive = !this.localActive;
    },

  },
}
</script>

<style lang="stylus">
@import '../assets/stylus/base/vars.styl'

.post-reactions
  display flex
  align-items center
  cursor pointer
  height 32px
  background-color #F0F2F5
  padding 4px 20px
  border-radius 32px
  transition all .2s ease-in-out
  gap 5px
  &:hover
    color ui-cl-color-wild-watermelon
    background-color ui-cl-color-d2d2d2

.post-reactions__label
  font-size 10px

.post-reactions__heart
  position relative
  cursor pointer

.post-reactions__reactions
  position absolute
  top -17px
  background-color #fff
  padding 5px
  border-radius 20px
  box-shadow 0px 2px 8px rgba(0,0,0,0.08)
  left 100%
  margin-left 10px
  display flex
  gap 5px
  width 272px

.post-reactions__reaction
  display flex
  flex-direction column
  align-items center
  cursor pointer
  transition all .2s ease-in-out
  &:hover
    img
      transition all .2s ease-in-out
      transform scale(1.3)

.post-reactions__reaction img
  width 40px
  height 40px

.post-reactions__likes
  display flex
  align-items center
  gap 5px

.post-reactions__quantity
  font-size 15px
  font-weight 500
  color #818c99

.post-reactions__selected img
  width 24px
  height 24px

.post-reactions
  &--wow,
  &--funny,
  &--delight
    background-color #FFF2D6
  &--sadness
    background-color #EDF3FA
  &--malice
    background-color #FDEBE8
  &--heart
    background-color #FFEDED

</style>
