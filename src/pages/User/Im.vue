<template>
  <div class="im">
    <div class="im__dialogs">
      <im-dialog
        v-for="dialog in dialogs"
        :key="dialog.id"
        :info="dialog"
        :user-info="users"
        :push="countPush(dialog.unreadСount)"
        :me="+info?.id === +dialog.lastMessage?.authorId"
        :active="dialog?.id === activeDialog?.id"
        @click.native="clickOnDialog(dialog)"
      />
    </div>

    <div class="im__chat" v-if="activeDialog && messagesLoaded">
      <im-chat :user-info="users" :info="activeDialog" :messages="messages" />
    </div>

    <div v-else class="no-dialog">Диалог не выбран</div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import ImDialog from '@/components/Im/Dialog';
import ImChat from '@/components/Im/Chat';
import dialogsApi from '@/requests/dialogs';

export default {
  name: 'Im',
  components: { ImDialog, ImChat },
  props: {
    activeDialogId: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      activeDialog: null,
      messagesLoaded: false,
      infoUser: null
    };
  },

  computed: {
    ...mapState('profile/dialogs', ['dialogs', 'messages', 'newMessage']),
    ...mapGetters('global/search', ['getResultById', 'getUsersQueryParams']),
    ...mapState('profile/info', ['info']),

    users() {
      return this.getResultById('users');
    },

    currentActiveDialogId() {
      return this.$route.params.activeDialogId;
    },

    conversationPartners() {
      return this.dialogs.filter(dialog => {
        return dialog.conversationPartner1 === this.info.id || dialog.conversationPartner2 === this.info.id;
      }).map(dialog => {
        return dialog.conversationPartner1 === this.info.id ? dialog.conversationPartner2 : dialog.conversationPartner1;
      });
    },
  },

  watch: {
    activeDialogId: {
      immediate: true,
      async handler(value) {
        if (value) {
          await this.newDialogs(this.currentActiveDialogId);
        }
        if (value) {
          this.messagesLoaded = false;
          await this.fetchMessages(this.currentActiveDialogId);
          this.messagesLoaded = true;
          const newActiveDialog = this.fetchDialogs().length ? this.fetchDialogs().filter((d) => d.id === this.currentActiveDialogId) : [];
          if (newActiveDialog.length > 0) {
            [this.activeDialog] = newActiveDialog;
            this.activeDialog.unreadCount = 0;
          } else {
            const response = await dialogsApi.newDialogs(this.currentActiveDialogId);
            const dialogData = response.data;
            this.activeDialog = this.generateNewDialog(dialogData)
            console.log(dialogData);
          }
        }
      },
    },

    newMessage: {
      handler(message) {
        // new message of partner
        if (this.activeDialogId && message.conversationPartner1 === this.activeDialogId) {
          message.isSentByMe = false;
          this.addOneMessage(message);
          this.markReadedMessages(message.conversationPartner1);
        }
      },
    },
  },

  beforeMount() {
    setTimeout(() => {
      this.onSearchUsers();
    }, 1000)
  },

  methods: {
    ...mapActions('profile/dialogs', ['newDialogs','fetchDialogs', 'fetchMessages', 'markReadedMessages']),
    ...mapActions('global/search', ['searchUsers']),
    ...mapMutations('profile/dialogs', [
      'addOneMessage',
      'setUnreadedMessages',
      'setNewMessage',
      'setActiveDialogId',
    ]),
    ...mapMutations('profile/dialogs', ['setDialogs']),
    ...mapGetters('users/info', ['getUsersInfo']),
    ...mapGetters('profile/dialogs', ['getDialogs']),
    ...mapGetters('profile/info', ['getInfo']),

    onSearchUsers() {
      const searchQuery = Object.assign({}, this.getUsersQueryParams, {
        ids: this.conversationPartners,
      });
      this.searchUsers({ payload: searchQuery });
    },

    generateNewDialog(dialogData) {
      return {
        id: dialogData.id,
        unreadCount: dialogData.unreadCount,
        conversationPartner1: dialogData.conversationPartner1,
        conversationPartner2: dialogData.conversationPartner2,
        lastMessage: {
          time: dialogData.lastMessage && dialogData.lastMessage[0]?.time,
          messageText: dialogData.lastMessage && dialogData.lastMessage[0]?.messageText,
          authorId: dialogData.lastMessage && dialogData.lastMessage[0]?.authorId,
        },
      };
    },

    countPush(unread) {
      return unread > 0 ? unread : null;
    },

    clickOnDialog(dialogId) {
      const dialog = this.dialogs.find(d => d.id === dialogId);
      if (dialog) {
        const conversationPartner = dialog.conversationPartner1 === this.info.id ? dialog.conversationPartner2 : dialog.conversationPartner1;
        this.$router.push({ name: 'ImChat', params: { activeDialogId: conversationPartner } });
      }
    }
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.no-dialog
  display flex
  width 100%
  height 100%
  justify-content:center
  align-items center
  color #666

.im
  display flex
  width 100%
  height 'calc(100vh - %s)' % header-height
  margin-bottom 30px

.im__dialogs
  width 100%
  max-width 35%
  overflow-y auto
  max-height 100%
  padding 15px
  height 100%
  border-radius 10px 0 0 10px
  background-color #d2d4d7

.im__chat
  width 100%
  flex auto
  height 100%
  background-color ui-cl-color-white-themefff
  border-radius 0 10px 10px 0
  overflow hidden
</style>
