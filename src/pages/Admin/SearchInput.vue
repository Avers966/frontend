<template>
  <div class="admin-panel__search" v-bind:class="{ active: isActive }">
    <search-icon />
    <input
      class="admin-panel__input"
      type="text" placeholder="Начните набирать, что бы найти..."
      v-model="inputValue" @input="updateValue"
      v-on:focus="isActive = true" v-on:blur="isActive = false"
    >
  </div>
</template>

<script>
import SearchIcon from '@/Icons/SearchIcon.vue';

export default {
  name: 'SearchInput',

  components: { SearchIcon },

  data: () => ({
    filter: 'all',
    inputValue: '',
    isActive: false
  }),

  methods: {
    updateValue() {
      this.$emit('input-change', this.inputValue);
    },
  },
}

</script>

<style lang="stylus">
.admin-panel__search .admin-panel__input:hover + *
  background-color lightblue

.admin-panel
  padding 40px

  &__content
    display grid
    grid-template-columns 1058px 430px
    gap 37px
    align-items flex-start
    justify-content space-between
  &__search
    display flex
    align-items center
    padding 20px 40px
    background #FFFFFF
    transition all .3s ease-in-out
    border-radius 10px
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
    &.active
      background #21A45D
      input
        color #fff
        &::placeholder
          color #fff
      svg
        stroke #fff
    svg
      margin-right 15px
  &__input
    width 100%
    background transparent

  &__result
    margin-top 30px
    &-block
      display grid
      grid-template-columns repeat(2, 1fr)
      gap 22px
      .friends-block
       margin-bottom 0
</style>
