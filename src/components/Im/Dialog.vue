<template>
  <div class="im-dialog" :class="{ active, push }" v-if="userInfo">
    <a
      class="im-dailog__pic"
      href="#"
    >
      <div class="main-layout__user-pic">
        <img
          v-if="userInfo.photo"
          :src="userInfo.photo"
          :alt="userInfo.firstName[0] + ' ' + userInfo.lastName[0]"
        />

        <div v-else>
          <unknow-user />
        </div>
      </div>
    </a>

    <div class="im-dialog-contents">
      <div class="im-dialog__info">
        <a
          class="im-dialog__name"
          href="#"
        >
          {{ userInfo.firstName }}
          {{ userInfo.lastName }}
        </a>
        <div class="im-dialog-online">
          <span v-if="userInfo.lastOnlineTime === null">был(а) в сети давно</span>
          <span class="isonline-online" v-else-if="userInfo.isOnline">Онлайн</span>
          <span v-else>Был(а) в сети {{ userInfo.lastOnlineTime | moment('from') }}</span>
        </div>
      </div>
      <div class="im-dialog__content">
        <p class="im-dialog__last">
          <span class="im-dialog__last-me" v-if="me"> Вы: {{ info.lastMessage.messageText }}</span>
          <span v-else> {{ info.lastMessage.messageText }}</span>
          <span>{{ info.lastMessage.time }}</span>
        </p>
      </div>
      <span class="im-dialog__push" v-if="push > 0">{{ push }}</span>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import UnknowUser from '../../Icons/UnknowUser.vue';

export default {
  name: 'ImDialog',
  components: { UnknowUser },
  props: {
    active: Boolean,
    push: Number,
    online: Boolean,
    me: Boolean,
    info: Object,
  },

  data: () => ({
    userInfo: null
  }),

  computed: {
    ...mapGetters('profile/info', ['getInfo']),

    conversationPartner() {
    return this.info.conversationPartner1 === this.getInfo.id ? this.info.conversationPartner2 :
           this.info.conversationPartner2 === this.getInfo.id ? this.info.conversationPartner1 :
           null;
    }
  },

  async mounted() {
    this.fetchUserInfo();
    if (!this.getInfo) {
      await this.apiInfo();
    }
  },

  methods: {
    ...mapActions('profile/info', ['apiInfo']),

    fetchUserInfo() {
      axios.get(`/account/${this.conversationPartner}`)
        .then(response => {
          this.userInfo = response.data;
        })
    },
  }
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.im-dialog-online
  font-size font-size-super-small
  background-color ui-cl-color-eucalypt
  color ui-cl-color-white-theme
  padding 3px
  border-radius border-super-small
  box-shadow box-shadow-main

.im-dialog-contents
  display flex
  flex-direction column
  gap 5px

.im-dialog
  display flex
  gap 10px
  align-items center
  background ui-cl-color-white-bright-second
  border-radius border-small
  position relative
  padding 20px
  z-index 0
  transition all .2s ease-in-out
  cursor pointer

  .user-status
    padding 4px
    background-color ui-cl-color-eucalypt
    font-size font-size-super-upsmall
    line-height 100%

  &:not(:last-child)
    margin-bottom 15px

  &:hover
    background ui-cl-color-c5c5c5


  &.push + &.active, &.active + &.push
    &:after
      display none

  &.active
    &:after
      display none

    &:before
      display block

  &.push
    &:after
      display none

    &:before
      display block
      background-color #E9F5EF

    .im-dialog__time
      color #7D9A8B

.im-dailog__pic
  width 60px
  border-radius border-half
  overflow hidden
  flex none
  .main-layout__user-pic
    width 60px
    height 60px
    margin-right 0

.im-dialog__info
  display flex
  gap 5px
  align-items center
  width 100%

.im-dialog__name
  font-size font-size-default
  color ui-cl-color-grey-color
  font-weight font-weight-medium
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

  @media (max-width breakpoint-xl)
    display none

.im-dialog__last
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  font-size font-size-small
  line-height 18px
  letter-spacing -0.003em

  &-me
    color ui-cl-color-eucalypt

.im-dialog__time
  color ui-cl-color-santas-gray
  font-size font-size-small
  line-height 19px

.im-dialog__push
  width 27px
  height 27px
  border-radius border-half
  display flex
  align-items center
  justify-content center
  font-size font-size-small
  line-height 27px
  font-weight font-weight-bold
  color ui-cl-color-white-theme
  background-color #E65151
  margin-left auto

.im-dialog__last-me
  color green
</style>
