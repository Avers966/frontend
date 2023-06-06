<template>
  <div class="im">
    <div class="im__dialogs">
      <im-dialog
        v-for="dialog in dialogs"
        :key="dialog.id"
        :info="dialog"
        :push="countPush(dialog.unreadСount)"
        :me="+info?.id === +dialog.lastMessage?.authorId"
        :active="dialog?.id === activeDialogId"
        @click.native="clickOnDialog(dialog.id)"
      />
    </div>

    <div class="im__chat" v-if="activeDialog && messagesLoaded">
      <im-chat :info="activeDialog" :messages="messages" />
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
    };
  },

  computed: {
    ...mapState('profile/dialogs', ['dialogs', 'messages', 'newMessage']),
    ...mapState('profile/info', ['info']),

    currentActiveDialogId() {
      return this.$route.params.activeDialogId;
    }
  },

  watch: {
    activeDialogId: {
      immediate: true,
      async handler(value) {
        await this.fetchDialogs();
        if (value) {
          this.messagesLoaded = false;
          await this.fetchMessages(value);
          this.messagesLoaded = true;
          const newActiveDialog = this.getDialogs().length ? this.getDialogs().filter((d) => d.id === value) : [];
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
          // this.markReadedMessages(message.authorId);
        }
      },
    },
  },

  methods: {
    ...mapActions('profile/dialogs', ['fetchDialogs', 'fetchMessages', 'markReadedMessages']),
    ...mapActions('users/info', ['userInfoId']),
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
      if (+dialogId === +this.activeDialogId) {
        return;
      }
      this.$router.push({
        name: 'ImChat',
        params: { activeDialogId: dialogId },
      });
    },
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
