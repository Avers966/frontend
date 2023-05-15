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

  .theme-switcher__button
    svg
      fill #000

  .main-layout__header
    background eucalypt

//========================================

[data-theme="dark"]

  .friend__search-title
    color #fff

  body
    background #141414

  .im__dialogs
    background-color #222
    border 1px solid #424242

  .im-dialog
    background #303030
    border 1px solid #424244
    .main-layout__user-pic
      background #222
    &__name
      color #fff
    .user-status
      background-color #222
      border 1px solid #424242
    &:hover
      background #393838

  .im__chat
    background #5c5c5c

  .im-chat__message-text
    background-color #3a3a3a
    box-shadow unset
    color #fff

  .im-chat__user
    background #363636
    border-color #424242

  .im-chat__user-pic
    .main-layout__user-pic
      background #222

  .im-chat__user-name
    color #fff

  .im-chat__user .user-status
    background-color #222
    border 1px solid #424242

  .friend__search-clear
    background-color #222
    border 1px solid #424242
    @media (any-hover: hover)
      &:hover
        background-color #292935

  .friends_group_title.no-data
    color #9e9e9e

  .news-block__content-text a
    color #8bc49e

  .profile__tabs__title
    color #8a8a8a

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
  .vs__selected-options input
    color #fff
  .vs__selected-options input::placeholder
      color #fff
  .vs__clear
    fill #868686
  .vs__open-indicator
    fill #868686

  .is_planing
    background #1d1d1d
    color #d7d7d7

  .news-block__deffered-text
    color #7d7d7d
    padding 5px 10px
    border-radius 5px

  .news-block__changed-time
    color #7d7d7d
    padding 5px 10px
    border-radius 5px

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
      background #222
    &__label
      color #fff
    &-tabs
      &__item
        background transparent
        border-color #5c5c5c
        &:hover
          background #1d1d1d
          border-color #1d1d1d
          color #fff
        &.active
          background #5d5d5d
          border-color #8b8b8b
          &:hover
            background #5d5d5d
            border-color #8b8b8b
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
    background-color #222
    border 1px solid #424242
    &__item+.settings-push__item
      border-color #555
    &__name
      color #fff

  .settings-security__btn
    background radial-gradient(248.22% 257.37% at 9.27% 93.95%, rgba(161,128,255,0.1) 0%, rgba(74,157,255,0.1) 50%, rgba(117,247,255,0.1) 100%)
    background-color #464646
    border none
    color #ffffff
    @media (any-hover: hover)
      &:hover
        background-color #545454

  .search-news__nonews
    color #fff

  .settings-delete
    background-color #222
    border 1px solid #424242
    &__title
      color #fff

  .settings-security__block
    background-color #222
    border 1px solid #424242

  .settings-security__title
    color #fff

  .settings-security__value
    background transparent
    color #b2b2b2
    border-color #555

  .aside-filter
    background-color #222
    border 1px solid #424242
    &__title
      color #fff
    &__item
      border-color #555
      color #8e8e8e
      &.active
        color #21a45d

  .settings
    &-main
      background-color #222
      border 1px solid #424242

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

  .showmore-info
    background #222

  .profile-info__bottom
    background #1d1d1d
    border-color #424242

  .profile-info__val
    color #fff

  .recommend-block
    background-color #222
    border 1px solid #424242

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

    &__search
      background #424242
      border unset
      color #fff
      &:hover
        background #333333

  .main-layout
    &__header
      background-color #222
      border-bottom 1px solid #424242

    &__sidebar
      background-color #2f2f2f
      border-color #424242

    &__page
      background #141414

    &__link
      &:hover
        color #fff

      &.router-link-active
        &:hover
          color #21a45d

    &__search-input
      background #424242
      color #E1E3E6
      &::placeholder
        color #E1E3E6

      &:focus
        border-bottom-color #555555

  .weather
    color #fff
    &__minmax
      color #fff

  .news-add
    background-color #222
    border 1px solid #424242

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

  .profile-info__showmore
    background-color #222
    border 1px solid #424242
    @media (any-hover: hover)
      &:hover
        background-color #1d1b1b

  .news-block
    background-color #222222
    border 1px solid #424242

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

  .post-block__text-content
    color #dfdfdf

  .post-block__showmore
    background-color #333
    &:hover
      background-color #1d1d1d

  .post-block__tags-item
    background-color #000
    &:hover
      background-color #1d1d1d
    a
      color #dfdfdf

  .post-block__timer
    color #dfdfdf
    svg path
      fill #dfdfdf

  .post-block__title
    color #fff

  .post-block__info
    a:nth-child(1)
      color #dfdfdf
    span:nth-child(2)
      color #939393

  .like-comment
    background-color #333
    color #b2b2b2

  .open-comment
    border-color #3d3d3d

  .comment-icon span
    color #b2b2b2 !important

  .comment-main .like-comment
    background-color unset !important

  .news-block__content-tag a
    background #7d7d7d
    color #fff

    @media (any-hover: hover)
      &:hover
        background #000

  .comment-add__input
    background transparent
    color #b2b2b2
    border-color #555555

  .comment-main__time
    color #939393

  .comments__title span
    color #7d7d7d

  .comment-main__author
    color #fff

  .comment-main__text
    color #dfdfdf


  .profile

    &__tab
      color #8a8a8a
      &.active
        color #fafaff

    &-info
      background #222
      border 1px solid #424242

      &__img
        border-color #747474


      &__link
        color #fff
        &:hover
          color #bfbfbf

      &__names
        color #fff

      &__pic
        border-color #7d7d7d

      &__title
        color #a4a4a4

      &__header
        border-color #656565

  .friends
    &__title
      color #fff !important

    &-possible
      background-color #222
      border 1px solid #424242
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
      background-color #222
      border 1px solid #424242

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
            background-color #222
            border 1px solid #424242
            color #9e9e9e
          &:disabled
            background-color #222
            border 1px solid #424242
            opacity 35%
        &.active
          background-color #333
          border 1px solid #4f4f4f

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
