<!-- eslint-disable vue/html-indent -->
<template>
  <div class="main-layout__sidebar">
    <div class="main-layout__logo" :class="{ admin: isAdminPage }">
      <div class="main-layout__admin-logo" v-if="isAdminPage">
        <simple-svg :filepath="'/static/img/logo-admin.svg'" />
      </div>
      <div class="main-layout__logotype" v-else>
        <p>Code Lounge</p>
        <main-logotype :width="35" :height="35"/>
      </div>
    </div>

    <nav class="main-layout__nav">
      <router-link
        :title="item.text"
        class="main-layout__link"
        v-for="(item, index) in info"
        :key="index"
        :exact="item.exact"
        :to="item.link"
        :class="{
          'main-layout__link--im':
            item.link.name === 'Im' || (item.link.name === 'Friends' && requestsCount.count),
          big: unreadedMessages >= 100,
        }"
        :data-push="
          item.link.name === 'Im'
            ? unreadedMessages
            : item.link.name === 'Friends'
            ? requestsCount.count
            : false
        "
      >
        <div class="simple-svg-wrapper">
          <sidebar-icons :name="item.icon" />
        </div>
        <span class="sidebar__text">{{ item.text }}</span>
      </router-link>
    </nav>

    <router-link
      class="main-layout__link"
      v-if="!isAdminPage"
      :to="{ name: 'Settings' }"
      title="Настройки"
    >
      <div class="simple-svg-wrapper">
        <sidebar-icons :name="'settings'" />
      </div>
      <span class="sidebar__text">Настройки</span>
    </router-link>

    <a class="main-layout__link" @click.prevent="onLogout" href="#" title="Выйти">
      <div class="simple-svg-wrapper">
        <sidebar-icons :name="'exit'" />
      </div>
      <span class="sidebar__text">Выйти</span>
    </a>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import SidebarIcons from '../../Icons/sidebar/SidebarIcons.vue';
import MainLogotype from '../../Icons/MainLogotype.vue';

export default {
  name: 'MainLayoutSidebar',
  components: { SidebarIcons, MainLogotype },
  computed: {
    ...mapGetters('global/menu', ['getSidebarById']),
    ...mapGetters('profile/dialogs', ['unreadedMessages']),
    ...mapState('profile/friends', ['requestsCount']),
    isAdminPage() {
      return this.$route.path.indexOf('admin') !== -1;
    },
    info() {
      return this.getSidebarById(this.isAdminPage ? 'admin' : 'user');
    },
  },

  mounted() {
    this.apiRequestsCount();
    this.apiUnreadedMessages();
  },

  methods: {
    ...mapActions('auth/api', ['logout']),
    ...mapActions('profile/friends', ['apiRequestsCount']),
    ...mapActions('profile/dialogs', ['apiUnreadedMessages']),
    onLogout() {
      this.logout().finally(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.form-layout__main
  margin auto 0

.main-layout__logotype
  z-index 1000
  display inline-flex
  align-items center
  white-space nowrap
  padding 10px
  border-radius 10px
  background #ffffff21
  user-select none
  pointer-events none
  gap 10px
  width 100%
  max-width unset
  p
    font-size 25px
    font-weight 300
    text-transform uppercase
  svg path:nth-child(3)
    animation gradient 1s linear infinite

@keyframes gradient {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.main-layout__sidebar
  position fixed
  left 0
  top 0
  bottom 0
  width sidebar-width
  background steel-gray
  padding 40px
  color #fff
  display flex
  flex-direction column
  overflow-y auto

  @media (max-width breakpoint-xxl)
    width sidebar-width-xl

.main-layout__logo
  margin-bottom 100px
  display flex
  align-items center

  &.admin
    max-width 100%

.main-layout__admin-logo
  width 100%
  margin-left 10px

.main-layout__nav
  margin-bottom auto
  margin-top -25px

.main-layout__link
  color rgba(255, 255, 255, 0.4)
  display flex
  align-items baseline
  margin-left -25px
  margin-right -25px
  padding 25px
  transition all 0.2s
  position relative

  &:hover
    color #fff

  &--im
    &:after
      content attr(data-push)
      font-weight 600
      font-size 13px
      width 23px
      height 23px
      background-color #E65151
      border-radius 50%
      display flex
      align-items center
      justify-content center
      position absolute
      right 10px
      top 50%
      transform translateY(-50%)

    &.big
      &:after
        width 35px
        height 35px
        right 5px

  &.router-link-active
    color #fff

  .simple-svg-wrapper
    width 16px
    height 16px
    margin-right 15px
    flex none

    & svg
      vertical-align text-top
      height 100%

@media(max-width: 1024px)
  .main-layout__sidebar
    width 120px
  .sidebar__text
    display none
</style>
