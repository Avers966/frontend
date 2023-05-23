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
@import '../../assets/stylus/base/vars.styl'

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
  background-color ui-cl-color-e3e4e8
  background-image url('/static/img/moon.svg')
  background-size 14px 14px
  background-repeat no-repeat
  background-position right 5px center
  border-radius border-big-radius
  transition background-color 0.2s ease-in-out
  cursor pointer


.theme-switch label::before
  content ""
  position absolute
  top 2px
  left 2px
  width 20px
  height 20px
  background-color ui-cl-color-white-theme
  border-radius border-half
  transition transform 0.2s ease-in-out


.theme-switch input[type="checkbox"]:checked + label
  background-color ui-cl-color-3fb3ff
  background-image url('/static/img/sun.svg')
  background-position left 5px center


.theme-switch input[type="checkbox"]:checked + label::before
  transform translateX(20px)
  background-color ui-cl-color-full-black


.dark-theme
  background-color ui-cl-color-dark-grey
  color ui-cl-color-white-theme

//========================================

[data-theme="light"]

  .theme-switcher__button
    svg
      fill ui-cl-color-full-black

  .main-layout__header
    background ui-cl-color-eucalypt

//========================================

[data-theme="dark"]
  .main-layout__actions-profile
    background ui-cl-color-292929
    box-shadow -2px 15px 26px #000
    border 1px solid ui-cl-color-border-dark
  .main-layout__actions-profile-item a
    color ui-cl-color-white-theme
  .main-layout__actions-profile-item .form-layout__footer
    color ui-cl-color-white-theme
  .main-layout__actions-profile-item:hover
    background #f1f3f90f
  .main-layout__actions-profile-item
    color ui-cl-color-white-theme
  .main-layout__actions-profile-item:nth-child(2) svg
    stroke ui-cl-color-white-theme
  .main-layout-profile__actions
    background ui-cl-color-grey-color
    &:hover
      background rgba(241,243,249,0.08)
    .main-layout__user-name
      color ui-cl-color-white-theme
  .shine
    background ui-cl-color-2f2f2f
    background-image linear-gradient(to right, ui-cl-color-2f2f2f 0%, ui-cl-color-dark-grey 20%, ui-cl-color-2f2f2f 40%, ui-cl-color-2f2f2f 100%)

  .friend__search-title
    color ui-cl-color-white-theme

  body
    background ui-cl-color-body-color

  .im__dialogs
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark

  .im-dialog
    background ui-cl-color-303030
    border 1px solid ui-cl-color-424244
    .main-layout__user-pic
      background ui-cl-color-dark-grey
    &__name
      color ui-cl-color-white-theme
    .user-status
      background-color ui-cl-color-dark-grey
      border 1px solid ui-cl-color-border-dark
    &:hover
      background ui-cl-color-393838

  .im__chat
    background ui-cl-color-5c5c5c

  .im-chat__message-text
    background-color ui-cl-color-3a3a3a
    box-shadow unset
    color ui-cl-color-white-theme

  .im-chat__user
    background ui-cl-color-363636
    border-color ui-cl-color-border-dark

  .im-chat__user-pic
    .main-layout__user-pic
      background ui-cl-color-dark-grey

  .im-chat__user-name
    color ui-cl-color-white-theme

  .no__notifications
    color ui-cl-color-white-theme

  .push__wrap
    background ui-cl-color-292929

  .push__list
    background ui-cl-color-292929

  .push__item
    &:hover
      background rgba(255, 255, 255, 0.08)
  .push__btn
    border-color ui-cl-color-border-dark
    color ui-cl-color-919191
    &:hover
      color ui-cl-color-white-bright
      background rgba(255, 255, 255, 0.08)

  .push__item+.push__item
    border-top 1px solid ui-cl-color-border-dark
  .push__content-preview
    color ui-cl-color-white-theme
  .push__content-name
    color ui-cl-color-919191

  .im-chat__user .user-status
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark

  .friend__search-clear
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark
    @media (any-hover: hover)
      &:hover
        background-color ui-cl-color-292935

  .friends_group_title.no-data
    color ui-cl-color-9e9e9e

  .news-block__content-text a
    color ui-cl-color-light-eucalypt

  .profile__tabs__title
    color ui-cl-color-8a8a8a

  .theme-switcher__button
    svg
      fill #e7e20e

  .vs__dropdown-toggle
    border-color ui-cl-color-686868
  .vs__selected
    color ui-cl-color-white-theme
  .vs__search
    color ui-cl-color-white-theme
  .vs__search::placeholder
    color ui-cl-color-white-theme
  .vs__selected-options input
    color ui-cl-color-white-theme
  .vs__selected-options input::placeholder
      color ui-cl-color-white-theme
  .vs__clear
    fill #868686
  .vs__open-indicator
    fill #868686

  .is_planing
    background ui-cl-color-1d1d1d
    color #d7d7d7

  .news-block__deffered-text
    color ui-cl-color-medium-grey
    padding 5px 10px
    border-radius border-super-small

  .news-block__changed-time
    color ui-cl-color-medium-grey
    padding 5px 10px
    border-radius border-super-small

  .error
    &__title
      color ui-cl-color-white-theme

  .pagination__link--arrow
    svg
      fill white

  .pagination__link--disabled
    opacity .3

  .pagination__link
    color ui-cl-color-b2b2b2

  .search
    &__tabs
      background ui-cl-color-dark-grey
    &__label
      color ui-cl-color-white-theme
    &-tabs
      &__item
        background transparent
        border-color ui-cl-color-5c5c5c
        &:hover
          background ui-cl-color-1d1d1d
          border-color ui-cl-color-1d1d1d
          color ui-cl-color-white-theme
        &.active
          background #5d5d5d
          border-color #8b8b8b
          &:hover
            background #5d5d5d
            border-color #8b8b8b
    &__input
      background transparent
      border-color #828282
      color ui-cl-color-white-theme
    .add-tags__input
      border-color #828282
    &-filter__select
      background transparent
      border-color #828282
      color ui-cl-color-white-theme
      background url('/static/img/arrow__select_h.svg') no-repeat calc(100% - 10px) 16px
      option
        color ui-cl-color-full-black
    &-block
      &__title
        color ui-cl-color-white-theme

  .settings-push
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark
    &__item+.settings-push__item
      border-color #555
    &__name
      color ui-cl-color-white-theme

  .settings-security__btn
    background radial-gradient(248.22% 257.37% at 9.27% 93.95%, rgba(161,128,255,0.1) 0%, rgba(74,157,255,0.1) 50%, rgba(117,247,255,0.1) 100%)
    background-color #464646
    border none
    color ui-cl-color-white-theme
    @media (any-hover: hover)
      &:hover
        background-color #545454

  .search-news__nonews
    color ui-cl-color-white-theme

  .settings-delete
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark
    &__title
      color ui-cl-color-white-theme

  .settings-security__block
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark

  .settings-security__title
    color ui-cl-color-white-theme

  .settings-security__value
    background transparent
    color ui-cl-color-b2b2b2
    border-color #555

  .aside-filter
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark
    &__title
      color ui-cl-color-white-theme
    &__item
      border-color #555
      color ui-cl-color-8e8e8e
      &.active
        color ui-cl-color-eucalypt

  .settings
    &-main
      background-color ui-cl-color-dark-grey
      border 1px solid ui-cl-color-border-dark

    &__title
      color ui-cl-color-white-theme

  .setting-main__addphoto
    background-color ui-cl-color-d2d2d2
      @media (any-hover: hover)
        &:hover
          background-color #e4e4e4

  .user-info-form__label_stylus
    color ui-cl-color-white-theme

  .user-info-form__input_stylus
    background-color transparent
    border 1px solid ui-cl-color-686868
    color ui-cl-color-white-theme

  .user-info-form__select
    background-color transparent
    border 1px solid ui-cl-color-686868
    color ui-cl-color-white-theme
    option
      color ui-cl-color-full-black

  .showmore-info
    background ui-cl-color-dark-grey

  .profile-info__bottom
    background ui-cl-color-1d1d1d
    border-color ui-cl-color-border-dark

  .profile-info__val
    color ui-cl-color-white-theme

  .recommend-block
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark

    &__not
      color ui-cl-color-white-theme

    &__title
      color ui-cl-color-white-theme
      border-color ui-cl-color-medium-grey

    &__item

      &:not(:last-child)
        border-color ui-cl-color-medium-grey

    &__name
      color ui-cl-color-white-theme

    &__search
      background ui-cl-color-border-dark
      border unset
      color ui-cl-color-white-theme
      &:hover
        background ui-cl-color-grey-color

  .main-layout
    &__header
      background-color ui-cl-color-dark-grey
      border-bottom 1px solid ui-cl-color-border-dark

    &__sidebar
      background-color ui-cl-color-2f2f2f
      border-color ui-cl-color-border-dark

    &__page
      background ui-cl-color-body-color

    &__link
      &:hover
        color ui-cl-color-white-theme

      &.router-link-active
        &:hover
          color ui-cl-color-eucalypt

    &__search-input
      background ui-cl-color-border-dark
      color ui-cl-color-e1e3e6
      &::placeholder
        color ui-cl-color-e1e3e6

      &:focus
        border-bottom-color ui-cl-color-medium-grey-light

  .weather
    color ui-cl-color-white-theme
    &__minmax
      color ui-cl-color-white-theme

  .news-add
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark

    &__text-title
      color ui-cl-color-white-theme
      background transparent
      border-bottom-color ui-cl-color-medium-grey-light

    &__actions
      border-top-color ui-cl-color-medium-grey-light

    &__actions-buttons button
      background-color ui-cl-color-full-black
      color ui-cl-color-white-theme

    &__settings-title
      color ui-cl-color-white-theme

  .add-tags
    &__input
      background transparent
      border-bottom 1px solid ui-cl-color-medium-grey-light
      color ui-cl-color-white-theme

    &__item
      background ui-cl-color-full-black
      color ui-cl-color-white-theme

  .profile-info__showmore
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark
    @media (any-hover: hover)
      &:hover
        background-color ui-cl-color-1d1b1b

  .news-block
    background-color ui-cl-color-dark-grey
    border 1px solid ui-cl-color-border-dark

    &__author-name
      color ui-cl-color-white-theme

    &__author-time
      color ui-cl-color-medium-grey

    &__content-title
      color ui-cl-color-white-theme

    &__content-text
      color ui-cl-color-medium-grey

    &__content-main
      border-bottom 1px solid ui-cl-color-medium-grey

  .edit__icon
    svg path
      fill ui-cl-color-medium-grey

  .post-block__text-content
    color ui-cl-color-dfdfdf

  .post-block__showmore
    background-color ui-cl-color-grey-color
    &:hover
      background-color ui-cl-color-1d1d1d

  .post-block__tags-item
    background-color ui-cl-color-full-black
    &:hover
      background-color ui-cl-color-1d1d1d
    a
      color ui-cl-color-dfdfdf

  .post-block__timer
    color ui-cl-color-dfdfdf
    svg path
      fill ui-cl-color-dfdfdf

  .post-block__title
    color ui-cl-color-white-theme

  .post-block__info
    a:nth-child(1)
      color ui-cl-color-dfdfdf
    span:nth-child(2)
      color ui-cl-color-939393

  .like-comment
    background-color ui-cl-color-grey-color
    color ui-cl-color-b2b2b2

  .open-comment
    border-color #3d3d3d

  .comment-icon span
    color ui-cl-color-b2b2b2 !important

  .comment-main .like-comment
    background-color unset !important

  .news-block__content-tag a
    background ui-cl-color-medium-grey
    color ui-cl-color-white-theme

    @media (any-hover: hover)
      &:hover
        background ui-cl-color-full-black

  .comment-add__input
    background transparent
    color ui-cl-color-b2b2b2
    border-color ui-cl-color-medium-grey-light

  .comment-main__time
    color ui-cl-color-939393

  .comments__title span
    color ui-cl-color-medium-grey

  .comment-main__author
    color ui-cl-color-white-theme

  .comment-main__text
    color ui-cl-color-dfdfdf


  .profile

    &__tab
      color ui-cl-color-8a8a8a
      &.active
        color ui-cl-color-fafaff

    &-info
      background ui-cl-color-dark-grey
      border 1px solid ui-cl-color-border-dark

      &__img
        border-color ui-cl-color-747474


      &__link
        color ui-cl-color-white-theme
        &:hover
          color #bfbfbf

      &__names
        color ui-cl-color-white-theme

      &__pic
        border-color ui-cl-color-medium-grey

      &__title
        color #a4a4a4

      &__header
        border-color #656565

  .friends
    &__title
      color ui-cl-color-white-theme !important

    &-possible
      background-color ui-cl-color-dark-grey
      border 1px solid ui-cl-color-border-dark
      &__title
        color ui-cl-color-white-theme
      .friends-search
        border-color #040404
      .friends-search__select
        background transparent
        border-color #828282
        color ui-cl-color-white-theme
        transition unset
        @media (any-hover: hover)
          &:hover
            background url('/static/img/arrow__select_h.svg') no-repeat calc(100% - 10px) 16px
        option
          color ui-cl-color-full-black

    &__header
      border-color #474747

    &-block
      background-color ui-cl-color-dark-grey
      border 1px solid ui-cl-color-border-dark

      &__name
        color ui-cl-color-fafaff

      &__age-city
        color #6a6a6a

    &__tabs

      li button
        color ui-cl-color-9e9e9e
        border-color #474747
        background transparent
        @media (any-hover: hover)
          &:hover
            background-color ui-cl-color-dark-grey
            border 1px solid ui-cl-color-border-dark
            color ui-cl-color-9e9e9e
          &:disabled
            background-color ui-cl-color-dark-grey
            border 1px solid ui-cl-color-border-dark
            opacity 35%
        &.active
          background-color ui-cl-color-grey-color
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
      background ui-cl-color-full-black
      height: 24px;
      padding: 0 10px
      border-radius 12px
      color ui-cl-color-fafaff
</style>
