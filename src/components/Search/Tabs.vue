<template>
  <ul class="search-tabs">
    <li
      class="search-tabs__item"
      v-for="(item, index) in tabs"
      :key="index"
      :class="{ active: item.id === tabSelect }"
      @click="changeTab(item.id)"
    >
      {{ item.text }}
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SearchTabs',
  computed: {
    ...mapGetters('global/search', ['tabs', 'tabSelect']),
  },
  methods: {
    ...mapActions('global/search', ['changeTab']),
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.search-tabs
  display flex
  align-items center
  gap 15px
  margin-bottom 15px

.search-tabs__item
  display block
  min-width 120px
  max-width 120px
  color #767676
  border-radius 5px
  text-align center
  background #fff
  border 1px solid #ababab
  font-size 14px
  padding 10px
  cursor pointer
  transition all .2s ease-in-out

  @media (any-hover: hover)
    &:hover
      color #222
      background #c8ecd8
      border-color #c8ecd8


  &.active
    color #fff
    background #21a45d
    border-color #21a45d
    &:hover
      color #fff
      background #21a45d
      border-color #21a45d
</style>
