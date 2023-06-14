<template>
  <div class="im-chat">
    <div class="im-chat__user" v-if="filteredUserInfo.length !== 0">
      <router-link
        class="im-chat__user-pic"
        :to="{
          name: 'ProfileId',
          params: { id: filteredUserInfo && filteredUserInfo[0].id },
        }"
      >
        <div class="main-layout__user-pic">
          <img
            v-if="filteredUserInfo && filteredUserInfo[0].photo"
            :src="filteredUserInfo && filteredUserInfo[0].photo"
            :alt="
              filteredUserInfo && filteredUserInfo[0].firstName[0] + ' ' + filteredUserInfo && filteredUserInfo[0].firstName[0]
            "
          />

          <div v-else>
            <unknow-user />
          </div>
        </div>
      </router-link>

      <router-link
        class="im-chat__user-name"
        :to="{
          name: 'ProfileId',
          params: { id: info.id },
        }"
      >
        {{ filteredUserInfo && filteredUserInfo[0].firstName }} {{ filteredUserInfo && filteredUserInfo[0].lastName }}
      </router-link>

      <div>
        <span class="user-status isonline-lasttime" v-if="filteredUserInfo[0].lastOnlineTime === null">был(а) в сети давно</span>
        <span class="user-status isonline-online" v-else-if="filteredUserInfo[0].isOnline">Онлайн</span>
        <span class="user-status isonline-lasttime" v-else>был(а) в сети {{ filteredUserInfo[0].lastOnlineTime | moment('from') }}</span>
      </div>
    </div>

    <div class="im-chat__infitite_list_wrapper chat-message" v-chat-scroll ref="chatContainer">
      <chat-message v-for="(item, index) in messagesGrouped" :key="index" :source="item"/>
    </div>

    <form class="im-chat__enter" action="#" @submit.prevent="onSubmitMessage">
      <input
        class="im-chat__enter-input"
        type="text"
        placeholder="Ваше сообщение..."
        v-model="mes"
      />
    </form>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ChatMessage from '@/components/Im/ChatMessage';
import UnknowUser from '../../Icons/UnknowUser.vue';
import axios from 'axios';
import VueChatScroll from 'vue-chat-scroll';
Vue.use(VueChatScroll)

const makeHeader = (msgDate) => {
  return { id: `group-${msgDate}`, stubDate: true, date: msgDate };
};

export default {
  name: 'ImChat',
  components: {
    UnknowUser,
    ChatMessage
  },

  props: {
    info: Object,
    messages: Array,
    online: Boolean,
    userInfo: Array
  },

  data: () => ({
    mes: '',
    isUserViewHistory: false,
    fetching: false,
    lastId: -1,
    infoChatUser: null
  }),

  computed: {
    ...mapGetters('profile/info', ['getInfo']),

    messagesGrouped() {
      let groups = [];
      let headerDate = null;

      for (const msg of this.messages) {
        const msgDate = new Date(msg.time).toDateString();
        if (msgDate !== headerDate) {
          headerDate = msgDate;
          groups.push(makeHeader(headerDate));
        }
        msg.isSentByMe = msg.conversationPartner2 === this.info.id;
        groups.push(msg);

      }
      return groups;
    },

    getInfoConversationPartner() {
      return this.info.conversationPartner1 === this.getInfo.id ? this.info.conversationPartner2 :
           this.info.conversationPartner2 === this.getInfo.id ? this.info.conversationPartner1 :
           null;
    },

    filteredUserInfo() {
      return this.userInfo.filter(user => user.id === this.getInfoConversationPartner);
    }

  },

  async mounted() {
    this.follow = true;
    await axios.put(`dialogs/${this.info.id}`)
    if (!this.getInfo) {
      await this.apiInfo();
      this.getInfoChat();
    }
  },

  methods: {
    ...mapActions('profile/dialogs', ['postMessage', 'loadOlderMessages', 'markReadedMessages']),
    ...mapGetters('profile/dialogs', ['isHistoryEndReached', 'getDialogs']),
    ...mapMutations('profile/dialogs', ['addOneMessage']),
    ...mapActions('profile/info', ['apiInfo']),

    getInfoChat() {
      const conversationPartnerId = this.info.conversationPartner1 === this.getInfo.id ? this.info.conversationPartner2 :
            this.info.conversationPartner2 === this.getInfo.id ? this.info.conversationPartner1 :
            null;
      console.log(conversationPartnerId)
      const user = this.userInfo.find(user => user.id === conversationPartnerId);
      this.infoChatUser = user;
    },

    onSubmitMessage() {
      if (!this.mes.trim()) return;
      const payload = {
        type: 'MESSAGE',
        recipientId: this.info.conversationPartner2,
        data: {
          time: null,
          conversationPartner1: this.info.conversationPartner1,
          conversationPartner2: this.info.conversationPartner2,
          messageText: this.mes,
          readStatus: null,
          dialogId: this.info.id
        },
      };
      this.addOneMessage(payload.data);
      this.$socket.sendMessage(payload);
      this.lastId -= 1;
      this.mes = '';
    },

    addMessage() {
      this.messages.push(this.newMessage)
      this.newMessage = ''
      this.$nextTick(() => {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
      })
    }
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.im-chat
  position relative
  display flex
  flex-direction column
  height 100%

.isonline-online
  color ui-cl-color-white-bright-second
  background-color ui-cl-color-eucalypt

.isonline-lasttime
  background-color #333
  color ui-cl-color-white-bright-second

.im-chat__user
  display flex
  align-items center
  height 40px
  padding 30px 20px
  font-size font-size-small
  background-color ui-cl-color-white-bright-second
  border-bottom 1px solid #d2d4d7

  .user-status
    padding 4px
    font-size font-size-super-upsmall
    line-height 100%

.im-chat__user-pic
  width 40px
  height 40px
  border-radius border-half
  overflow hidden
  margin-right 10px
  .main-layout__user-pic
    width 40px
    height 40px

.im-chat__user-name
  font-weight font-weight-bold
  font-size font-size-default
  color ui-cl-color-steel-gray
  margin-right auto

.im-chat__user-status
  color #9EA4AD

  &.online
    color ui-cl-color-eucalypt

.im-chat__infitite_list_wrapper
  padding 20px
  position relative
  overflow-y auto
  flex 1
  &.div:not(:last-child)
    margin-bottom 20px

.im-chat__infitite_list
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  overflow-y auto

.im-chat__message > div
  padding 20px

.im-chat__enter
  display block
  width 100%

.im-chat__enter-input
  width 100%
  background-color ui-cl-color-363636
  padding 0 40px
  font-size font-size-default
  color ui-cl-color-white-theme
  height 80px

  &::placeholder
    color #B0B0BC

.im-chat__loader
  padding 1em

  .finished
    font-size font-size-small
    text-align center
    color #bfbfbf

  .spinner
    font-size font-size-super-upsmall
    margin 0 auto
    text-indent -9999em
    width 25px
    height 25px
    border-radius border-half
    background ui-cl-color-white-theme
    background linear-gradient(to right, ui-cl-color-eucalypt 10%, rgba(255, 255, 255, 0) 42%)
    position relative
    animation load3 1.4s infinite linear
    transform translateZ(0)

  .spinner:before
    width 50%
    height 50%
    background ui-cl-color-eucalypt
    border-radius 100% 0 0 0
    position absolute
    top 0
    left 0
    content ''

  .spinner:after
    background #f8fafd
    width 75%
    height 75%
    border-radius border-half
    content ''
    margin auto
    position absolute
    top 0
    left 0
    bottom 0
    right 0

  @-webkit-keyframes load3
    0%
      transform rotate(0deg)
    100%
      transform rotate(360deg)

  @keyframes load3
    0%
      transform rotate(0deg)
    100%
      transform rotate(360deg)
</style>
