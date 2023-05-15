import axios from 'axios';

export default {
  getMessages(id) {
    return axios.get(`/dialogs/messages?page=0&size=3&sort=time,desc&companionId=${id}`);
  },

  getDialogs() {
    return axios.get('/dialogs?page=0&size=5&sort=unreadCount,desc');
  },

  unreadedMessages() {
    return axios.get('/dialogs/unread');
  },

  markReaded(id) {
    return axios.put(`dialogs/${id}`);
  },
};
