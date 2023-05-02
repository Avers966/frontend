<!-- <template>
  <div class="profile-info" v-if="info">
    <div class="profile-info__pic">
      <div class="profile-info__img" :class="{ offline: !online && !me }">
        <img
          v-if="info.photo"
          :src="info.photo"
          :alt="info.firstName[0] + ' ' + info.lastName[0]"
        />

        <img v-else src="/static/img/avatar.png" alt="avatar placeholder" />
      </div>

      <div class="profile-info__actions" v-if="!me">
        <button-hover :disable="blocked" @click.native="onSentMessage">
          Написать сообщение
        </button-hover>

        <button-hover
          class="profile-info__add"
          :variant="btnVariantInfo.variant"
          bordered="bordered"
          @click.native="profileAction"
        >
          {{ btnVariantInfo.text }}
        </button-hover>
      </div>
    </div>

    <div class="profile-info__main">
      <router-link class="edit" v-if="me" :to="{ name: 'Settings' }">
        <edit-icon />
      </router-link>

      <span class="profile-info__blocked" :class="{ blocked }" v-else @click="blockedUser">
        {{ blockedText }}
      </span>

      <div class="profile-info__header">
        <h1 class="profile-info__name">{{ info.firstName + ' ' + info.lastName }}</h1>

        <span v-if="!online" class="user-status">
          Был(а) в сети {{ info.lastOnlineTime | moment('from') }}
        </span>

        <span v-else class="user-status" :class="{ online, offline: !online }">
          {{ statusText }}
        </span>
      </div>

      <div class="profile-info__block">
        <span class="profile-info__title">Дата рождения:</span>

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

      <div class="profile-info__block">
        <span class="profile-info__title">Телефон:</span>

        <a class="profile-info__val" v-if="info.phone" :href="`tel: +7${info.phone}`">
          {{ info.phone | phone }}
        </a>

        <a class="profile-info__val" v-else>не заполнено</a>
      </div>

      <div class="profile-info__block">
        <span class="profile-info__title">Страна, город:</span>

        <span class="profile-info__val" v-if="residenceText">
          {{ residenceText }}
        </span>

        <span class="profile-info__val" v-else>не заполнено</span>
      </div>

      <div class="profile-info__block">
        <span class="profile-info__title">О себе:</span>

        <span class="profile-info__val info-about__text" v-if="info.about"> {{ info.about }}</span>

        <span class="profile-info__val" v-else>не заполнено</span>
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
</template> -->

<template>
  <div class="profile-info" v-if="info">
    <div class="profile-info__background" :style="{ 'background-image': `url(${info.photo})` }">
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
      <div class="profile-info__image">
        <div class="profile-info__avatar" :class="{ offline: !online && !me }">
          <img
            v-if="info.photo"
            :src="info.photo"
            :alt="info.firstName[0] + ' ' + info.lastName[0]"
          />
          <img v-else src="/static/img/avatar.png" alt="avatar placeholder" />
          <div class="profile-info__status">
            <span class="user-status" :class="{ online, offline: !online }">
              {{ statusText }}
            </span>
          </div>
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
        <div v-if="!me" class="profile-info__actions">
          <a
            href="#"
            class="profile-info__btn btn-send__message"
            :disable="blocked"
            @click.prevent="onSentMessage">Написать сообщение</a>
          <a
            href="#"
            class="profile-info__btn btn-send__hole"
            @click.prevent="profileAction"
          >
            {{ btnVariantInfo.text }}
          </a>
        </div>
      </div>
    </div>
    <div class="showmore-info">
      <transition>
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
      </transition>
      <transition>
        <div class="profile-info__weather" v-if="me">
          <weather-block />
        </div>
      </transition>
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
import WeatherBlock from '@/components/WeatherBlock.vue';
import Modal from '@/components/Modal';

export default {
  name: 'ProfileInfo',
  components: { GiftIcon, PhoneIcon, HomeIcon, AboutIcon, Modal, WeatherBlock },
  props: {
    me: Boolean,
    online: Boolean,
    blocked: Boolean,
    friend: Boolean,
    info: Object,
  },

  data: () => ({
    modalShow: false,
    modalText: '',
    modalType: 'deleteFriend',
    showInfo: false,
    showInfoWeather: false,
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

    statusText() {
      return this.online ? 'онлайн' : 'не в сети';
    },

    blockedText() {
      return this.blocked ? 'Пользователь заблокирован' : 'Заблокировать';
    },

    btnVariantInfo() {
      return this.blocked
        ? { variant: 'red', text: 'Разблокировать' }
        : this.friend
        ? { variant: 'red', text: 'Удалить из друзей' }
        : { variant: 'white', text: 'Добавить в друзья' };
    },
  },

  methods: {
    ...mapActions('users/actions', ['apiBlockUser', 'apiUnblockUser']),
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends']),
    ...mapActions('profile/dialogs', ['createDialogWithUser', 'apiLoadAllDialogs']),
    ...mapActions('users/info', ['userInfoId']),

    getAgeAsString(age) {
      const ages = ['год', 'года', 'лет'];
      const n = parseInt(age, 10);
      return ages[n % 100 > 4 && n % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][n % 10 < 5 ? n % 10 : 5]];
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

    blockedUser() {
      if (this.blocked) return;
      this.modalText = `Вы уверены, что хотите заблокировать пользователя ${this.info.fullName}`;
      this.modalShow = true;
      this.modalType = 'block';
    },

    async profileAction() {
      if (this.blocked) {
        this.apiUnblockUser(this.$route.params.id).then(() => {
          this.userInfoId(this.$route.params.id);
        });
        return;
      }

      if (this.friend) {
        this.modalText = `Вы уверены, что хотите удалить пользователя ${this.info.fullName} из друзей?`;
        this.modalShow = true;
        this.modalType = 'deleteFriend';
        return;
      }

      await this.apiAddFriends({ id: this.info.id });
      this.userInfoId(this.$route.params.id);
    },

    closeModal() {
      this.modalShow = false;
    },

    onConfirm() {
      if (this.modalType === 'block') {
        this.apiBlockUser(this.$route.params.id).then(() => {
          this.apiInfo(this.$route.params.id);
          this.closeModal();
        });
        return;
      }

      this.apiUnblockUser(this.$route.params.id).then(() => {
        this.apiInfo(this.$route.params.id);
        this.closeModal();
      });
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
    grid-template-columns 1fr 500px
    gap 70px
    &.not-me
      justify-content flex-start

  .profile-info
    background #fff
    border-radius 10px
    box-shadow 0px 2px 8px rgba(0,0,0,0.08)
    overflow hidden
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
      &.offline
        border-color #c2c2c2
    &__bottom
      position relative
      padding 50px 50px
      display flex
      align-items center
      justify-content space-between
      background #fafafa
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
    &__btn
      background radial-gradient(248.22% 257.37% at 9.27% 93.95%, rgba(161,128,255,0.1) 0%, rgba(74,157,255,0.1) 50%, rgba(117,247,255,0.1) 100%)
      background-color #313135
      color #fff
      font-size 13px
      padding 10px
      border-radius 10px
      transition all .2s ease-in-out
      &:hover
        background-color #505057
      &.btn-send__message
        margin-right 10px

</style>
