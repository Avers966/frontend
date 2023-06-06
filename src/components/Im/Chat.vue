<template>
  <div class="im-chat">
    <div class="im-chat__user" v-if="info.conversationPartner">
      <router-link
        class="im-chat__user-pic"
        :to="{
          name: 'ProfileId',
          params: { id: info.conversationPartner.id },
        }"
      >
        <div class="main-layout__user-pic">
          <img
            v-if="info.conversationPartner.photo"
            :src="info.conversationPartner.photo"
            :alt="
              info.conversationPartner.firstName[0] + ' ' + info.conversationPartner.firstName[0]
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
        {{ info.conversationPartner.firstName }} {{ info.conversationPartner.lastName }}
      </router-link>

      <span class="user-status" :class="{ online }">
        Был(а) в сети
        {{ this.info.conversationPartner.lastOnlineTime | moment('from') }}
      </span>
    </div>

    <div class="im-chat__user" v-else-if="userInfo">
      <router-link
        class="im-chat__user-pic"
        :to="{
          name: 'ProfileId',
          params: { id: userInfo.id },
        }"
      >
        <div class="main-layout__user-pic">
          <img
            v-if="userInfo.photo"
            :src="userInfo.photo"
            :alt="
              userInfo.firstName[0] + ' ' + userInfo.firstName[0]
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
          params: { id: userInfo.id },
        }"
      >
        {{ userInfo.firstName }} {{ userInfo.lastName }}
      </router-link>

      <span class="user-status" :class="{ online }">
        Был(а) в сети
        {{ this.userInfo.lastOnlineTime | moment('from') }}
      </span>
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
  },

  data: () => ({
    mes: '',
    isUserViewHistory: false,
    fetching: false,
    lastId: -1,
    userInfo: null
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
    }
  },

  // watch: {
  //   messages() {
  //     if (this.follow) this.setVirtualListToBottom();
  //   },
  // },

  async mounted() {
    this.follow = true;
    // this.markReadedMessages(this.$route.params.activeDialogId);
    // this.$refs.vsl.scrollToBottom();
    this.fetchUserInfo();
    if (!this.getInfo) {
      await this.apiInfo();
    }
  },

  methods: {
    ...mapActions('profile/dialogs', ['postMessage', 'loadOlderMessages', 'markReadedMessages']),
    ...mapGetters('profile/dialogs', ['isHistoryEndReached', 'getDialogs']),
    ...mapMutations('profile/dialogs', ['addOneMessage']),
    ...mapActions('profile/info', ['apiInfo']),

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

    fetchUserInfo() {
      axios.get(`/account/${this.getInfoConversationPartner}`)
      .then(response => {
        this.userInfo = response.data;
      })
      .catch(error => {
        console.log(error);
      });
    },

    addMessage() {
      this.messages.push(this.newMessage)
      this.newMessage = ''
      this.$nextTick(() => {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
      })
    }

    // async onScrollToTop() {
    //   if (this.$refs.vsl) {
    //     if (!this.isHistoryEndReached()) {
    //       let [oldest] = this.messagesGrouped;

    //       this.fetching = true;
    //       await this.loadOlderMessages();
    //       this.setVirtualListToOffset(1);

    //       this.$nextTick(() => {
    //         let offset = 0;
    //         for (const groupedMsg of this.messagesGrouped) {
    //           if (groupedMsg.id === oldest.id) break;
    //           offset += this.$refs.vsl.getSize(groupedMsg.id);
    //         }

    //         this.setVirtualListToOffset(offset);
    //         this.fetching = false;
    //       });
    //     }
    //   }
    // },

    // onScroll() {
    //   this.follow = false;
    // },

    // onScrollToBottom() {
    //   this.follow = true;
    // },

    // setVirtualListToOffset(offset) {
    //   if (this.$refs.vsl) {
    //     this.$refs.vsl.scrollToOffset(offset);
    //   }
    // },

    // setVirtualListToBottom() {
    //   if (this.$refs.vsl) {
    //     this.$refs.vsl.scrollToBottom();
    //   }
    // },
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
    background-color ui-cl-color-eucalypt
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
