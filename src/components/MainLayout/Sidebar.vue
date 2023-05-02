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

    <button class="burger-menu__button" @click="isOpen = !isOpen" :class="{'active': isOpen, overflow: bodyOverflow }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <transition>
      <nav class="main-layout__nav" v-show="isOpen" :class="{'active': isOpen}">
        <router-link
          :title="item.text"
          class="main-layout__link"
          v-for="(item, index) in info"
          :key="index"
          :exact="item.exact"
          :to="item.link"
          :class="{
            'main-layout__link--im':
              item.link.name === 'Im' || (item.link.name === 'Friends' && requestsCount?.count),
            big: unreadedMessages?.count >= 100,
          }"
          :data-push="
            item.link.name === 'Im'
              ? unreadedMessages?.count
              : item.link.name === 'Friends'
              ? requestsCount?.count
              : false
          "
        >
          <div class="simple-svg-wrapper">
            <sidebar-icons :name="item.icon" />
          </div>
          <span class="sidebar__text">{{ item.text }}</span>
        </router-link>
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
      </nav>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import SidebarIcons from '../../Icons/sidebar/SidebarIcons.vue';
import MainLogotype from '../../Icons/MainLogotype.vue';

export default {
  name: 'MainLayoutSidebar',
  components: { SidebarIcons, MainLogotype },
  data() {
    return {
      isOpen: false,
    }
  },
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
    removeBodyOverflow() {
      const body = document.querySelector('body');
      return {
        computedStyle: () => {
          if (this.isOpen) {
            body.style.overflow = 'hidden';
          } else {
            body.style.overflow = '';
          }
        }
      }
    },
    bodyOverflow() {
      return this.removeBodyOverflow.computedStyle();
    }
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


.burger-menu__button
  position relative
  display inline-block
  width 30px
  background transparent
  height 20px
  position relative
  cursor pointer
  z-index 150

.burger-menu__button span
  display block
  position absolute
  height 3px
  width 100%
  background-color #21A45D
  opacity 1
  left 0
  transform rotate(0deg)
  transition transform 0.25s ease-in-out, opacity 0.25s ease-in-out

.burger-menu__button span:nth-child(1)
  top 0px

.burger-menu__button span:nth-child(2)
  top 8px

.burger-menu__button span:nth-child(3)
  top 16px

.burger-menu__button.active span:nth-child(1),
.burger-menu__button.active span:nth-child(4)
  transform rotate(45deg)
  top: 16px;

.burger-menu__button.active span:nth-child(2)
  opacity 0
  transform rotate(45deg)

.burger-menu__button.active span:nth-child(3)
  transform rotate(-45deg)

@media (min-width: 768px)
  .burger-menu__button
    display none
  .main-layout__nav
    display block !important

@media (max-width: 768px)
  .burger-menu__button
    display block
  .main-layout__nav
    position absolute
    left 0
    top 0
    z-index 100
    width 100%
    height 1500px
    overflow hidden
    background radial-gradient(248.22% 257.37% at 9.27% 93.95%, rgba(161,128,255,0.1) 0%, rgba(74,157,255,0.1) 50%, rgba(117,247,255,0.1) 100%)
    background-color #313135
    padding 80px 30px

</style>
