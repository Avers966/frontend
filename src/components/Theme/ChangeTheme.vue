<template>
  <div class="theme-switch">
    <input type="checkbox" id="theme-switch-checkbox" v-model="darkMode">
    <label for="theme-switch-checkbox"></label>
  </div>
</template>

<script>

export default {

  data() {
    return {
      darkMode: localStorage.getItem('theme') === 'dark',
    }
  },

  computed: {
    bodyClasses() {
      return {
        'dark-theme': this.darkMode,
      };
    },
  },
  watch: {
    darkMode(value) {
      if (value) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
        document.documentElement.removeAttribute('data-theme');
      }
    },
  },
  mounted() {
    if (this.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  },
}
</script>

<style lang="stylus">
.theme-switch
  position relative
  display inline-block
  width 45px
  height 25px
  margin-right 10px

.theme-switch input[type="checkbox"]
  display none


.theme-switch label
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  background-color #E3E4E8
  background-image url('/static/img/moon.svg')
  background-size 14px 14px
  background-repeat no-repeat
  background-position right 5px center
  border-radius 20px
  transition background-color 0.2s ease-in-out
  cursor pointer


.theme-switch label::before
  content ""
  position absolute
  top 2px
  left 2px
  width 20px
  height 20px
  background-color #fff
  border-radius 50%
  transition transform 0.2s ease-in-out


.theme-switch input[type="checkbox"]:checked + label
  background-color #3fb3ff
  background-image url('/static/img/sun.svg')
  background-position left 5px center


.theme-switch input[type="checkbox"]:checked + label::before
  transform translateX(20px)
  background-color #000


.dark-theme
  background-color #222
  color #fff

//========================================

[data-theme="light"]
  *
    transition all .2s ease-in-out

  .theme-switcher__button
    svg
      fill #000

  .main-layout__header
    background eucalypt

//========================================

[data-theme="dark"]
  *
    transition all .2s ease-in-out

  .news-block__content-text a
    color #8bc49e

  .theme-switcher__button
    svg
      fill #e7e20e

  .vs__dropdown-toggle
    border-color #686868
  .vs__selected
    color #fff
  .vs__search
    color #fff
  .vs__search::placeholder
    color #fff
  .vs__clear
    fill #868686
  .vs__open-indicator
    fill #868686

  .is_planing
    background #1d1d1d
    color #d7d7d7

  .error
    &__title
      color #fff

  .pagination__link--arrow
    svg
      fill white

  .pagination__link--disabled
    opacity .3

  .pagination__link
    color #b2b2b2

  .search
    &__tabs
      background #313135
    &__label
      color #fff
    &-tabs
      &__item
        background transparent
        border-color #5c5c5c
        &.active
          background #212122
          border-color #212122
    &__input
      background transparent
      border-color #828282
      color #fff
    .add-tags__input
      border-color #828282
    &-filter__select
      background transparent
      border-color #828282
      color #fff
      background url('/static/img/arrow__select_h.svg') no-repeat calc(100% - 10px) 16px
      option
        color #000
    &-block
      &__title
        color #fff

  .settings-push
    background #313135
    &__item+.settings-push__item
      border-color #555
    &__name
      color #fff

  .search-news__nonews
    color #fff

  .settings-delete
    background #313135
    &__title
      color #fff

  .settings-security__block
    background #313135

  .settings-security__title
    color #fff

  .settings-security__value
    background-color transparent

  .settings-security__btn
    color #000
    border-color #e2e2e2
    @media (any-hover: hover)
      &:hover
        background #21a45d
        border-color #21a45d
        color #fff


  .aside-filter
    background-color #313135
    &__title
      color #fff
    &__item
      border-color #555
      color #8e8e8e
      &.active
        color #21a45d

  .settings
    &-main
      background-color #313135

    &__title
      color #fff

  .setting-main__addphoto
    background-color #d2d2d2
      @media (any-hover: hover)
        &:hover
          background-color #e4e4e4

  .user-info-form__label_stylus
    color #fff

  .user-info-form__input_stylus
    background-color transparent
    border 1px solid #686868
    color #fff

  .user-info-form__select
    background-color transparent
    border 1px solid #686868
    color #fff
    option
      color #000

  .recommend-block
    background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
    background-color #313135

    &__not
      color #fff

    &__title
      color #fff
      border-color #7d7d7d

    &__item

      &:not(:last-child)
        border-color #7d7d7d

    &__name
      color #fff

  .main-layout
    &__header
      background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
      background-color #313135

    &__sidebar
      background-color #191920

    &__page
      background #1f1f24

    &__search-input
      background #242424

      &:focus
        border-bottom-color #555555

  .news-add
    background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
    background-color #313135

    &__text-title
      color #fff
      background transparent
      border-bottom-color #555555

    &__actions
      border-top-color #555555

    &__actions-buttons button
      background-color #000
      color #fff

    &__settings-title
      color #fff

  .add-tags
    &__input
      background transparent
      border-bottom 1px solid #555555
      color #fff

    &__item
      background #000
      color #fff

  .news-block
    background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
    background-color #313135

    &__author-name
      color #fff

    &__author-time
      color #7d7d7d

    &__content-title
      color #fff

    &__content-text
      color #7d7d7d

    &__content-main
      border-bottom 1px solid #7d7d7d

  .edit__icon
    svg path
      fill #7d7d7d


  .news-block__content-tag a
    background #7d7d7d
    color #fff

    @media (any-hover: hover)
      &:hover
        background #000

  .comment-add__input
    background transparent
    color #7d7d7d

  .comment-add
    border-bottom 1px solid #7d7d7d

  .comments__title span
    color #7d7d7d

  .comment-main__author
    color #fff

  .comment-main__text
    color #7d7d7d

  .comment-block__reviews-list
      .comment-main + .comment-main
        border-top 1px solid #7d7d7d

  .comment-block.show-comments .comment-block__reviews
    border-top 1px solid #7d7d7d

  .profile

    &__tab
      color #8a8a8a
      &.active
        color #fafaff

    &-info
      background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
      background-color #313135
      &__img
        border-color #747474

      &__pic
        border-color #7d7d7d

      &__name
        color #fff

      &__title
        color #a4a4a4

      &__val
        color #fff

  .weather
    background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
    background-color #313135
    color #fff
    &__minmax
      color #fff

  .friends
    &__title
      color #fff !important

    &-possible
      background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
      background-color #313135
      &__title
        color #fff
      .friends-search
        border-color #040404
      .friends-search__select
        background transparent
        border-color #828282
        color #fff
        transition unset
        @media (any-hover: hover)
          &:hover
            background url('/static/img/arrow__select_h.svg') no-repeat calc(100% - 10px) 16px
        option
          color #000

    &__header
      border-color #474747

    &-block
      background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
      background-color #313135

      &__name
        color #fafaff

      &__age-city
        color #6a6a6a

    &__tabs

      li button
        color #9e9e9e
        border-color #474747
        background transparent
        @media (any-hover: hover)
          &:hover
            background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
            background-color #313135
            border-color #313135
          &:disabled
            background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
            background-color #313135
            border-color #313135
            opacity 35%
        &.active
            background radial-gradient(248.22% 257.37% at 9.27% 93.95%,rgba(161,128,255,.1) 0%,rgba(74,157,255,.1) 50%,rgba(117,247,255,.1) 100%)
            background-color #292935
            border-color #313135

    &__search
      color #838383
      background transparent
      border 1px solid #474747
      &-input
        color #838383
      ::placeholder
        color #838383

    .user-status
      width 86px
      text-align center
      background #000
      height: 24px;
      padding: 0 10px
      border-radius 12px
      color #fafaff
</style>
