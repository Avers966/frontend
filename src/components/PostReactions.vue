<template>
  <div class="post-reactions">
    <div class="post-reactions__heart" @mouseover="showReactions = true">
      <like-icon />
      <div class="post-reactions__reactions" v-show="showReactions" @mouseleave="showReactions = false">
        <div v-for="(reaction, index) in reactions" :key="index" class="post-reactions__reaction" @click="addReaction(reaction.type)">
          <img :title="reaction.label" :src="`/static/img/post-reactions/${reaction.type}.gif`" :alt="reaction.label" />
        </div>
      </div>
    </div>
    <!-- <div class="post-reactions__likes">{{ likes }} Likes</div> -->
  </div>
</template>

<script>
import LikeIcon from '../Icons/LikeIcon.vue';
export default {
  components: {
    LikeIcon,
  },
  props: {
    active: null,
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
      likes: 0
    }
  },

  methods: {
    addReaction(reactionType) {
      this.$emit('reaction-added', reactionType);
    },
  },
}
</script>

<style lang="stylus">
.post-reactions
  display flex
  align-items center

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
  margin-left 10px
</style>
