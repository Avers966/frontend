import dialogsApi from '@/requests/dialogs';

export default {
  namespaced: true,
  state: {
    dialogs: [],
    unreadedMessages: 0, // total unreaded
    messages: [], // sorted oldest->newest 0 is oldest
    totalMessages: null,
    dialogsLoaded: false,
    activeDialogId: null,
    oldLastKnownMessageId: null,
    isHistoryEndReached: false,
    newMessage: {},
  },
  getters: {
    getDialogs: (s) => s.dialogs,
    getMessages: (s) => s.messages,
    oldestKnownMessageId: (s) => (s.messages.length > 0 ? s.messages[0]['id'] : null),
    activeDialog: (s) => s.dialogs.find((el) => el.id == s.activeDialogId),
    getActiveDialogId: (s) => +s.activeId,
    dialogsLoaded: (s) => s.dialogsLoaded,
    unreadedMessages: (s) => s.unreadedMessages,
    hasOpenedDialog: (s) => (dialogId) => !!s.dialogs.find((el) => el.id == dialogId),
    isHistoryEndReached: (s) => s.isHistoryEndReached,
  },
  mutations: {
    clearMessages(state) {
      state.messages = [];
    },

    setUnreadedMessages: (s, unread) => (s.unreadedMessages = unread),
    setDialogs: (s, dialogs) => (s.dialogs = dialogs),
    setNewMessage: (s, newMessage) => (s.newMessage = newMessage),
    dialogsLoaded: (s) => (s.dialogsLoaded = true),
    setActiveDialogId: (s, value) => (s.activeDialogId = value),
    addMessages: (s, { messages, total }) => {
      s.messages = [...s.messages, ...messages];
      s.messages.sort((a, b) => a.time - b.time);
      s.total = total;
    },

    addOneMessage: (state, messagePayload) => {
      state.messages.push(messagePayload);
    },
    selectDialog: (state, dialogId) => {
      state.activeId = dialogId;
      state.messages = [];
      state.isHistoryEndReached = false;
    },
    markEndOfHistory: (s) => (s.isHistoryEndReached = true),
  },

  actions: {
    async fetchMessages({ commit }, dialogId) {
      const response = await dialogsApi.newDialogs(dialogId);
      if (!response.lastMessage) return;
      const messages = [{
        ...response.lastMessage,
        time: new Date(response.lastMessage.time).getTime(),
      }];
      commit('clearMessages');
      commit('addMessages', {
        messages,
        total: response.unreadCount,
      });
    },

    async fetchDialogs({ commit }) {
      try {

        const response = await dialogsApi.getDialogs();
        if (response.data?.content?.length === 0) return;

        const dialogs = [];
        const data = response.data.content;
        data.map((d) => {
          const newDialog = {
            id: d.id,
            unreadCount: d.unreadCount,
            conversationPartner1: d.conversationPartner1,
            conversationPartner2: d.conversationPartner2,
            lastMessage: {
              time: d.lastMessage && d.lastMessage[0]?.time,
              messageText: d.lastMessage && d.lastMessage[0]?.messageText,
              authorId: d.lastMessage && d.lastMessage[0]?.authorId,
            },
          };
          dialogs.push(newDialog);
        });
        commit('setDialogs', dialogs);
      } catch (err) {
        console.log(err);
      }
    },

    async apiUnreadedMessages({ commit, dispatch }) {
      const { data } = await dialogsApi.unreadedMessages();
      commit('setUnreadedMessages', data);
      await dispatch('fetchDialogs');
    },

    async markReadedMessages({ dispatch }, _, id) {
      await dialogsApi.markReaded(id);
      await dispatch('fetchDialogs');
    },
  },
};
