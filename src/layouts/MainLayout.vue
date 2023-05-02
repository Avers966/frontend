<template>
  <div class="main-layout">
    <main-layout-sidebar />

    <div class="main-layout__main">
      <main-layout-header />

      <main class="main-layout__page">
        <router-view />
      </main>
    </div>

    <real-time-updater />
  </div>
</template>

<script>
import MainLayoutHeader from '@/components/MainLayout/Header';
import MainLayoutSidebar from '@/components/MainLayout/Sidebar';
import RealTimeUpdater from '@/components/RealTimeUpdater';

export default {
  components: {
    MainLayoutHeader,
    MainLayoutSidebar,
    RealTimeUpdater,
  },
};
</script>

<style lang="stylus">
@import '../assets/stylus/base/vars.styl'

.main-layout
  display flex
  height 100%

.main-layout__main
  width 100%
  margin-left sidebar-width
  height 100%

.main-layout__page
  padding-top header-height
  background-color white-lilac
  min-height 100%
  position relative
  z-index 1

@media (min-width: 320px) and (max-width: 768px)
  .main-layout
    flex-direction column
    &__main
      margin-left 0
    &__sidebar
      display flex
      align-items center
      flex-direction row
      justify-content space-between
      position unset
      width 100%
      overflow unset
      padding 15px
    &__logo
      margin-bottom 0
    &__logotype
      flex-direction row-reverse
      background transparent
      padding 0
      z-index unset
      p
        font-size 15px
    &__link
      margin-left 0
      margin-right 0
    &__header
      position unset
      left 0
    &__page
      padding  30px 15px
      .inner-page
        padding 0
    .recommend-block
      display none
</style>
