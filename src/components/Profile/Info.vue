<template>
  <div class="profile-info" v-if="info">
    <div class="profile-info__background" :style="{ 'background-image': `url(${info.photo})` }">
      <div class="qr">
        <button @click="togglePopup" class="profile-info__shared-btn">
          <shared-account />
        </button>
        <transition name="fade">
          <div v-if="showPopup" class="profile-info__share-popup" v-click-outside="closePopup">
            Поделиться:
            <div class="qr-code" v-html="qrCode"></div>
            <div class="profile-info__share-link">
              <input
                class="profile-info__link-profile"
                ref="text" @click="copyText"
                :value="currentUrl"
              />
              <button class="profile-info__link-btn" @click="copyToClipboard">
                <span v-if="!copied"><copied-icon /></span>
                <span v-else-if="copied"><done-copied /></span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="profile-info__bottom">
      <div class="profile-info__left">
        <a
          href="#"
          class="profile-info__link"
          @click.prevent="scrollToPosts"
        >
          <span v-if="me">Мои публикации</span>
          <span v-else>Публикации {{ info.firstName }}</span>
        </a>
        <router-link class="profile-info__link" v-if="me" :to="{ name: 'Friends' }">
          Друзья
        </router-link>

      </div>
      <transition name="fade">
        <div v-if="showAvatar" class="profile-info__avatar-container" @click="showAvatar = false">
          <div class="profile-info__avatar-background">
            <img :src="info.photo" class="profile-info__avatar-loupe">
          </div>
        </div>
      </transition>
      <div class="profile-info__image">
        <div class="profile-info__status">
          <span class="user-status" :class="{ online, offline: !online }">
            {{ statusText }}
          </span>
        </div>
        <div
          class="profile-info__avatar"
          :class="{ offline: !online && !me }"
        >
          <img
            v-if="info.photo"
            :src="info.photo"
            :alt="info.firstName[0] + ' ' + info.lastName[0]"
            @click="showAvatar = true"
            @mouseover="showLoupe = true"
            @mouseleave="showLoupe = false"
          />
          <img v-else src="/static/img/avatar.png" alt="avatar placeholder" />
          <transition name="fade">
            <div v-if="showLoupe" class="profile-info__avatar-zoom">
              <plus-icon />
            </div>
          </transition>
        </div>
        <div class="profile-info__names">
          <h1 class="profile-info__name">{{ info.firstName + ' ' + info.lastName }}</h1>
          <span class="profile-info__cities" v-if="residenceText">{{ residenceText }}</span>
          <span class="profile-info__val" v-else>не заполнено</span>
        </div>
      </div>

      <div class="profile-info__right">
        <router-link class="profile-info__link" v-if="me" :to="{ name: 'Settings' }">
          Редактировать профиль
        </router-link>
        <button class="profile-info__showmore" v-if="!me" @click.prevent="actionsShow">
          Действия <arrow-buttom />
        </button>
        <transition name="fade">
          <div v-if="showActions" class="profile-info__actions" v-click-outside="closeActions">
            <!-- Подписка/отписка/принимаем запрос -->
            <a
              v-if="info.statusCode === 'WATCHING' && info.statusCode !== 'FRIEND'"
              href="#"
              class="profile-info__btn btn-send__message"
              @click.prevent="cancelApiRequests(info.id)">
              <simple-svg :filepath="'/static/img/delete.svg'" />
              Отписаться
            </a>
            <a
              v-else-if="info.statusCode !== 'FRIEND' &&
                info.statusCode !== 'REQUEST_TO' &&
                info.statusCode !== 'BLOCKED' &&
                info.statusCode !== 'REQUEST_FROM' &&
                info.statusCode !== 'SUBSCRIBED'"
              href="#"
              class="profile-info__btn subscribe btn-send__message"
              @click.prevent="subscribe(info.id)">
              <simple-svg :filepath="'/static/img/sidebar/admin/comments.svg'" />
              Подписаться
            </a>
            <a
              v-if="info.statusCode === 'REQUEST_FROM'"
              href="#"
              class="profile-info__btn btn-send__message"
              @click.prevent="acceptFriendRequest(info.id)">
              <simple-svg class="accept" :filepath="'/static/img/add.svg'" />
              Принять запрос
            </a>
            <!-- Сообщение -->
            <a
              v-if="info.statusCode !== 'BLOCKED'"
              href="#"
              class="profile-info__btn btn-send__message"
              @click.prevent="onSentMessage">
              <simple-svg :filepath="'/static/img/sidebar/im.svg'" />
              Написать сообщение
            </a>
            <!-- Блокировка/разблокировка -->
            <a
              v-if="blocked || info.isBlocked || info.statusCode === 'BLOCKED'"
              href="#"
              class="profile-info__btn btn-send__message"
              @click.prevent="unBlockedUser(info.id)">
              <simple-svg class="filter-green" :filepath="'/static/img/security-system-unlock.svg'" />
              Разблокировать
            </a>
            <a
              v-else
              href="#"
              class="profile-info__btn block btn-send__message"
              @click.prevent="blockedUser(info.id)">
              <simple-svg :filepath="'/static/img/unblocked.svg'" />
              Заблокировать
            </a>
            <!-- Добавление в друзья/отмена -->
            <a
              v-if="info.statusCode === 'FRIEND'"
              href="#"
              class="profile-info__btn btn-send__message"
              @click.prevent="cancelApiRequests(info.id)">
              Удалить из друзей
            </a>
            <a
              v-if="info.statusCode === 'REQUEST_TO'"
              href="#"
              class="profile-info__btn btn-send__message"
              @click.prevent="cancelApiRequests(info.id)">
              Отменить заявку
            </a>
            <a
              v-if="info.statusCode !== 'WATCHING' &&
                info.statusCode !== 'REQUEST_TO' &&
                info.statusCode !== 'BLOCKED' &&
                info.statusCode !== 'REQUEST_FROM' &&
                info.statusCode !== 'SUBSCRIBED'"
              href="#"
              class="profile-info__btn btn-send__message"
              @click.prevent="addToFriend(info.id)">
              <simple-svg class="accept" :filepath="'/static/img/add.svg'" />
              Добавить в друзья
            </a>
          </div>
        </transition>
      </div>
    </div>
    <div class="showmore-info">
      <div class="profile-info__show">
        <div class="profile-info__value">
          <span class="profile-info__title">
            <gift-icon />
            Дата рождения:
          </span>
          <span class="profile-info__val" v-if="info.birthDate">
            {{
              new Date(info.birthDate).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            }}
          </span>
          <span class="profile-info__val" v-else>не заполнено</span>
        </div>
        <div class="profile-info__value">
          <span class="profile-info__title">
            <phone-icon />
            Телефон:
          </span>
          <a class="profile-info__val" v-if="info.phone" :href="`tel: +7${info.phone}`">
            {{ info.phone | phone }}
          </a>
          <a class="profile-info__val" v-else>не заполнено</a>
        </div>
        <div class="profile-info__value">
          <span class="profile-info__title">
            <home-icon />
            Страна, город:
          </span>
          <span class="profile-info__val" v-if="residenceText">
            {{ residenceText }}
          </span>
          <span class="profile-info__val" v-else>не заполнено</span>
        </div>
        <div class="profile-info__value">
          <span class="profile-info__title">
            <about-icon />
            О себе:
          </span>
          <span class="profile-info__val info-about__text" v-if="info.about"> {{ info.about }}</span>
          <span class="profile-info__val" v-else>не заполнено</span>
        </div>
      </div>
      <div class="profile-info__weather" v-if="me">
        <weather-block />
      </div>
    </div>
    <modal v-model="modalShow">
      <p v-if="modalText">{{ modalText }}</p>

      <template slot="actions">
        <button-hover @click.native.prevent="onConfirm">Да</button-hover>

        <button-hover variant="red" bordered="bordered" @click.native="closeModal">
          Отмена
        </button-hover>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AboutIcon from '../../Icons/AboutIcon.vue';
import GiftIcon from '../../Icons/GiftIcon.vue';
import HomeIcon from '../../Icons/HomeIcon.vue';
import PhoneIcon from '../../Icons/PhoneIcon.vue';
import SharedAccount from '../../Icons/SharedAccount.vue';
import ArrowButtom from '../../Icons/ArrowBottom.vue';
import CopiedIcon from '../../Icons/CopiedIcon.vue';
import DoneCopied from '../../Icons/DoneCopied.vue';
import PlusIcon from '../../Icons/PlusIcon.vue';
import WeatherBlock from '@/components/WeatherBlock.vue';
import Modal from '@/components/Modal';
import QRCode from 'qrcode-generator';
import vClickOutside from 'v-click-outside';



export default {
  name: 'ProfileInfo',
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    GiftIcon,
    PhoneIcon,
    HomeIcon,
    AboutIcon,
    SharedAccount,
    CopiedIcon,
    DoneCopied,
    ArrowButtom,
    PlusIcon,
    Modal,
    WeatherBlock
  },

  props: {
    me: Boolean,
    online: Boolean,
    blocked: Boolean,
    friend: Boolean,
    info: Object,
    text: String,
  },

  data: () => ({
    modalShow: false,
    modalText: '',
    modalType: 'deleteFriend',
    showInfo: false,
    showInfoWeather: false,
    showPopup: false,
    qrCode: '',
    copied: false,
    showLoupe: false,
    showAvatar: false,
    showActions: false,
  }),

  computed: {
    ...mapGetters('profile/dialogs', ['dialogs']),


    residenceText() {
      let country = this.info?.country;
      let city = this.info?.city;
      if (!country && !city) {
        return null;
      }
      return `${country + ', ' || ''} ${city || ''}`;
    },

    currentUser() {
      return this.$store.getters.getUser;
    },

    currentUrl() {
      if (this.me === true) {
        return `${window.location.origin}/profile/` + this.currentUser;
      } else {
        return window.location.href;
      }
    },

    statusText() {
      return this.online ? 'онлайн' : 'не в сети';
    },
  },

  methods: {
    ...mapActions('users/actions', ['apiBlockedUser', 'apiUnblockUser']),
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends', 'apiSubscribe']),
    ...mapActions('profile/dialogs', ['createDialogWithUser', 'apiLoadAllDialogs']),
    ...mapActions('users/info', ['userInfoId']),
    ...mapGetters('profile/info', ['getInfo']),

    getAgeAsString(age) {
      const ages = ['год', 'года', 'лет'];
      const n = parseInt(age, 10);
      return ages[n % 100 > 4 && n % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][n % 10 < 5 ? n % 10 : 5]];
    },

    copyText() {
      const range = document.createRange();
      range.selectNode(this.$refs.text);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    },

    copyToClipboard() {
      const range = document.createRange();
      range.selectNode(this.$refs.text);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      this.copied = true;
    },

    actionsShow() {
      this.showActions = !this.showActions;
    },

    closeActions() {
      this.showActions = false;
    },

    togglePopup() {
      const url = this.currentUrl;
      this.qrCode = this.generateQRCode(url);
      this.showPopup = !this.showPopup;
    },

    closePopup() {
      window.getSelection().removeAllRanges();
      this.copied = false;
      this.showPopup = false;
    },

    generateQRCode(url) {
      const qr = QRCode(0, 'M');
      qr.addData(url);
      qr.make();
      return qr.createImgTag();
    },

    scrollToPosts() {
      const posts = document.getElementById('mypublications');
      posts.scrollIntoView({ behavior: 'smooth' });
      this.activeLink = 'link1';
    },

    showMoreInfo() {
      this.showInfo = !this.showInfo;
    },

    showWeather() {
      this.showInfoWeather = !this.showInfoWeather;
    },

    addToFriend(id) {
      if (this.info.statusCode === 'REQUEST_TO') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Вы уже отправляли запрос на добавления в друзья этому пользователю!',
        });
        return;
      }
      if (this.info.statusCode === 'FRIEND') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Этот пользователь уже является вашим другом!',
        });
        return;
      }
      if (this.info.statusCode === 'BLOCKED') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Вы заблокировали этого пользователя!',
        });
        return;
      }
      if (this.info.statusCode === 'SUBSCRIBED') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Этот пользователь среди ваших подписчиков, для добавления в друзья необходимо удалить его из списка подписчиков!',
        });
        return;
      }
      if (
        this.info.statusCode !== 'NONE' &&
        this.info.statusCode !== null &&
        this.info.statusCode == 'WATCHING'
      ) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'У вас уже есть отношения с этим пользователем, чтобы подписаться необходимо остановить другие отношения!',
        });
        return;
      }
      this.apiAddFriends({ id });
      this.locationReload();
    },

    locationReload() {
      setTimeout(() => {
        location.reload()
      }, 500)
    },

    cancelApiRequests(id) {
      this.apiDeleteFriends(id);
      this.locationReload();
    },

    acceptFriendRequest(id) {
      if (this.info.statusCode === 'FRIEND') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Этот пользователь уже является вашим другом!',
        });
        return;
      }
      this.apiAddFriends({ id, isApprove: true });
      this.locationReload()
    },

    subscribe(id) {
      if (this.info.statusCode === 'WATCHING') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Вы уже подписаны на этого пользователя!',
        });
        return;
      }
      if (
        this.info.statusCode !== 'NONE' &&
        this.info.statusCode !== null &&
        this.info.statusCode !== 'WATCHING'
      ) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'У вас уже есть отношения с этим пользователем, чтобы подписаться необходимо остановить другие отношения!',
        });
        return;
      }
      this.apiSubscribe(id);
      this.locationReload();
    },

    blockedUser(id) {
      this.apiBlockedUser(id);
      this.locationReload();
    },

    unBlockedUser(id) {
      this.apiUnblockUser(id);
      this.locationReload();
    },

    closeModal() {
      this.modalShow = false;
    },

    onSentMessage() {
      if (this.blocked) return false;
      this.$router.push({
        name: 'ImChat',
        params: { activeDialogId: this.info.id.toString() },
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'
  .v-enter-active,
  .v-leave-active
    transition opacity .3s ease-in-out

  .showmore-info
    display grid
    align-items center
    grid-template-columns repeat(2, 1fr)
    background #fff
    gap 70px
    &.not-me
      justify-content flex-start

  .profile-info
    background #fff
    border-radius 10px
    box-shadow 0px 2px 8px rgba(0,0,0,0.08)
    overflow hidden
    width 1250px
    min-width 320px

    &__btn
      display flex
      align-items center
      gap 5px
      color #333
      white-space nowrap
      font-size 13px
      padding 10px
      border-radius 10px
      transition all .2s ease-in-out
      &:hover
        background-color #f5f6f8

      &.block
        svg
          path
            fill unset
            stroke #222
            stroke-width 1px
            stroke-opacity 1
          line
            stroke #222

      &.subscribe
        svg path
          fill unset
          stroke #222
          stroke-opacity 1

      svg
        width 13px
        height 13px
        path
          fill #222

        rect
          fill #222


    &__showmore
      display flex
      align-items center
      gap 5px
      background-color #21a45d
      border-radius 5px
      font-size 15px
      padding 7px
      color #fff
      transition background-color .2s ease-in-out
      @media (any-hover: hover)
        &:hover
          background-color #167240

    &__actions
      display flex
      flex-direction column
      position absolute
      padding 10px
      top 40px
      right 0
      background-color #fff
      box-shadow 0px 2px 8px rgba(0,0,0,0.08)
      border-radius 10px

      &.fade-enter-active,
      &.fade-leave-active
        transition all .2s ease-in-out
      &.fade-enter,
      &.fade-leave-to
        opacity 0


    &__background
      position relative
      height 250px
      width 100%
      background-size cover
      object-fit cover
      &::after
        position absolute
        content ''
        width 100%
        height 100%
        top 0
        left 0
        background rgba(255, 255, 255, 0.2)
        backdrop-filter blur(30px)
        overflow hidden
    &__left,
    &__right
      display flex
      align-items center
      justify-content space-between
    &__right
      position relative
    &__link
      text-transform uppercase
      font-size 15px
      font-weight bold
      color #707070
      transition all .2s ease-in-out
      @media (any-hover: hover)
        &:hover
          color #333
      &.active
        color #99a2ad
        border-bottom 3px solid #99a2ad
        &:hover
          color #99a2ad
      &:not(:last-child)
        margin-right 20px
    &__image
      display flex
      flex-direction column
      justify-content center
      align-items center
      position absolute
      top -50px
      left 50%
      transform: translate(-50%, -35%);
    &__avatar
      position relative
      width 150px
      height 150px
      border-radius 50%
      border 6px solid #21a45d
      overflow hidden
      margin-bottom 10px
      img
        display flex
        align-items center
        justify-content center
        width 100%
        height 100%
        object-fit cover
        cursor pointer
      &.offline
        border-color #c2c2c2
      &-zoom
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: 100%
        height: 100%
        opacity: 0.5
        color #fff
        font-size 45px
        background #000
        pointer-events none
        display flex
        justify-content center
        align-items center

        &.fade-enter-active,
        &.fade-leave-active
          transition all .2s ease-in-out
        &.fade-enter,
        &.fade-leave-to
          opacity 0

      &-background
        background-color #fff
        padding 10px
        border-radius 10px

      &-container
        position fixed
        top 0
        left 0
        width 100%
        height 100%
        background-color rgba(0,0,0,0.8)
        display flex
        justify-content center
        align-items center
        z-index 1000

        &.fade-enter-active,
        &.fade-leave-active
          transition all .2s ease-in-out
        &.fade-enter,
        &.fade-leave-to
          opacity 0

      &-loupe
        max-width 700px
        max-height 700px
        border-radius 10px


    &__bottom
      position relative
      padding 50px 50px
      display flex
      align-items center
      justify-content space-between
      background #fafafa
      border-bottom 1px solid #e2e2e2
    &__show
      padding 50px 0 50px 50px
    &__weather
      padding 50px 50px 50px 0
    &__names
      color #000
      text-align center
    &__name
      text-transform uppercase
      font-size 20px
      margin-bottom 5px
    &__cities
      color #949494
    &__value
      margin-bottom 10px
    &__title
      color #99a2ad
      gap 5px
      font-weight bold
    &__status
      position absolute
      top 0
      right 0
      z-index 100
    &__shared-btn
      position absolute
      top 10px
      right 10px
      z-index 100
      background #333
      padding 5px
      border-radius 5px
      box-shadow 0px 2px 8px rgba(0,0,0,0.08)
    &__share-popup
      display flex
      flex-direction column
      align-items center
      justify-content center
      position absolute
      top 50px
      right 10px
      padding 15px
      background-color #fff
      z-index 100
      border-radius 10px 0 10px 10px
      box-shadow 0px 2px 8px rgba(0,0,0,0.08)

      &.fade-enter-active,
      &.fade-leave-active
        transition all .2s ease-in

      &.fade-enter,
      &.fade-leave-to
        opacity 0

    &__share-link
      display flex
    &__link-profile
      display block
      overflow hidden
      border-left 1px solid #d2d2d2
      border-top 1px solid #d2d2d2
      border-bottom 1px solid #d2d2d2
      border-radius 5px 0 0 5px
      padding 10px
    &__link-btn
      display inline-block
      background #21a45d
      padding 0 10px
      border-radius 0 5px 5px 0
      color #fff
      font-weight bold
    .qr-code
      img
        width 130px
        height 130px

</style>
