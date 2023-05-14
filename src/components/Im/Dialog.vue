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
        <span class="user-status" v-if="!online" :class="{ online }">
          Был(а) в сети
          <br />
          {{ this.userInfo.lastOnlineTime | moment('from') }}
        </span>
        <span class="user-status" v-else :class="{ online, offline: !online }"> онлайн </span>
      </div>
      <div class="im-dialog__content">
        <p class="im-dialog__last">
          <span class="im-dialog__last-me"> Вы: привет</span> <span class="im-dialog__time">11 часов назад</span>
          <!-- <span> {{ userInfo.lastMessage.messageText || null }}</span> -->
        </p>
      </div>
    </div>

    <!-- <div class="im-dialog__content">
      <p class="im-dialog__last">
        <span class="im-dialog__last-me" v-if="me"> Вы: {{ userInfo.lastMessage[0].messageText }}</span>
        <span v-else> {{ userInfo.lastMessage.messageText || null }}</span>
      </p>

      <span class="im-dialog__time">{{ userInfo.lastMessage[0].time  || null | moment('from') }}</span>
    </div> -->

    <span class="im-dialog__push" v-if="push > 0">{{ push }}</span>
  </div>
</template>

<script>
import axios from 'axios';
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
    getInfo() {
      return this.info.conversationPartner;
    },
  },

  mounted() {
    this.fetchUserInfo();
  },

  methods: {
    fetchUserInfo() {
      axios.get(`/account/${this.getInfo}`)
        .then(response => {
          this.userInfo = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.im-dialog-contents
  display flex
  flex-direction column
  gap 5px

.im-dialog
  display flex
  align-items center
  background #e7e7e7
  border-radius 10px
  position relative
  padding 20px
  z-index 0
  transition all .2s ease-in-out
  cursor pointer

  .user-status
    padding 4px
    background-color #21a45d
    font-size 10px
    line-height 100%

  &:not(:last-child)
    margin-bottom 15px

  &:hover
    background #c5c5c5


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
  border-radius 50%
  overflow hidden
  flex none
  .main-layout__user-pic
    margin-right 0

.im-dialog__info
  display flex
  gap 15px
  align-items center
  width 100%

.im-dialog__name
  font-size 16px
  color #333
  font-weight 500
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

  @media (max-width breakpoint-xl)
    display none

.im-dialog__last
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  font-size 12px
  line-height 18px
  letter-spacing -0.003em

  &-me
    color eucalypt

.im-dialog__time
  color #A4A4B8
  font-size 12px
  line-height 19px

.im-dialog__push
  width 27px
  height 27px
  border-radius 50%
  display flex
  align-items center
  justify-content center
  font-size 12px
  line-height 27px
  font-weight 600
  color #fff
  background-color #E65151
  margin-left auto

.im-dialog__last-me
  color green
</style>
