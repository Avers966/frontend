<template>
  <div class="friends-block" ref="dropdown">
    <div class="friends-block__img">
      <img v-if="info.photo" :src="info.photo" :alt="info.firstName" />
      <img v-else src="/static/img/avatar.png" :alt="info.firstName" />
    </div>

    <div class="friends-block__info">
      <router-link class="friends-block__name" :to="{ name: 'ProfileId', params: { id: info.id } }">
        {{ info.firstName }}
        {{ info.lastName }}
        <span class="user-status" :class="{ online, offline: !online }">{{ statusText }}</span>
      </router-link>

      <span class="friends-block__age-city" v-if="moderator">модератор</span>

      <span class="friends-block__age-city" v-else-if="info.birthDate && info.country">
        {{ info.birthDate | moment('from', true) }},
        {{ info.city ? info.city : (info.country ? info.country : 'не заполнено') }}
      </span>

      <span class="friends-block__age-city" v-else>профиль не заполнен</span>
    </div>

    <div>
      <button
        :class="{ 'friends-block__showmore': true, 'active': showDropdown }"
        @click.prevent="toggleDropdown"
      >
        <actions-show />
      </button>
      <div class="friends-block__actions" v-show="showDropdown">
        <template v-if="moderator">
          <div
            class="friends-block__actions-block"
            @click="openModal('deleteModerator')"
          >
            <span>Редактировать</span>
            <simple-svg :filepath="'/static/img/edit.svg'" />
          </div>
          <div
            class="friends-block__actions-block"
            @click="openModal('deleteModerator')"
          >
            <span>Удалить из списка</span>
            <simple-svg :filepath="'/static/img/delete.svg'" />
          </div>
        </template>
        <template v-else-if="admin">
          <div
            class="friends-block__actions-block"
            v-if="blocked || info.isBlocked"
          >
            <span>Разблокировать</span>
            <simple-svg class="filter-green" :filepath="'/static/img/security-system-unlock.svg'" />
          </div>
          <div class="friends-block__actions-block" v-else>
            <span>Заблокировать</span>
            <simple-svg :filepath="'/static/img/unblocked.svg'" />
          </div>
        </template>
        <template v-else>
          <div
            v-if="subscribeButton"
            class="friends-block__actions-block message subscribe__icon"
            @click="subscribe(info.id)"
          >
            <span>Подписаться</span>
            <simple-svg :filepath="'/static/img/sidebar/admin/comments.svg'" />
          </div>
          <div
            v-if="acceptButton"
            class="friends-block__actions-block message"
            @click="acceptFriendRequest(info.id)"
          >
            <span>Принять запрос</span>
            <simple-svg class="accept" :filepath="'/static/img/add.svg'" />
          </div>
          <div
            class="friends-block__actions-block message"
            @click="sendMessage(messageId)"
          >
            <span>Cообщение</span>
            <simple-svg :filepath="'/static/img/sidebar/im.svg'" />
          </div>
          <div
            class="friends-block__actions-block delete"
            @click="openModal('delete')"
            v-if="friend"
          >
            <span>Удалить</span>
            <simple-svg :filepath="'/static/img/delete.svg'" />
          </div>
          <div
            class="friends-block__actions-block add"
            @click="addToFriend(info.id)"
            v-else
          >
            <span>Добавить в друзья</span>
            <simple-svg :filepath="'/static/img/friend-add.svg'" />
          </div>
          <div
            class="friends-block__actions-block"
            v-if="blocked || info.isBlocked || info.statusCode === 'BLOCKED'"
            @click="openModal('unblock')"
          >
            <span>Разблокировать</span>
            <simple-svg class="filter-green" :filepath="'/static/img/security-system-unlock.svg'" />
          </div>
          <div
            v-else
            class="friends-block__actions-block"
            @click="openModal('block')"
          >
            <span>Заблокировать</span>
            <simple-svg :filepath="'/static/img/unblocked.svg'" />
          </div>
        </template>
      </div>
    </div>

    <modal v-model="modalShow">
      <p v-if="modalText">{{ modalText }}</p>
      <template slot="actions">
        <button-hover @click.native="onConfrim(targetId)">Да</button-hover>
        <button-hover variant="red" bordered="bordered" @click.native="closeModal">
          Отмена
        </button-hover>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import ActionsShow from '@/Icons/ActionsShow.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'FriendsBlock',
  components: { Modal, ActionsShow },
  props: {
    friend: Boolean,
    admin: Boolean,
    blocked: Boolean,
    moderator: Boolean,
    subscribeButton: {
      type: Boolean,
      default: false,
    },
    acceptButton: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => ({
        firstName: 'Михаил',
        lastName: 'Веселов',
        birthDate: 1559751301818,
        town_id: 1,
        photo: '/static/img/user/user_1.jpg',
        id: 124,
      }),
    },
  },

  data: () => ({
    modalShow: false,
    modalType: 'delete',
    showDropdown: false,
  }),

  computed: {
    ...mapGetters('profile/dialogs', ['dialogs']),

    statusText() {
      return this.info.isOnline ? 'онлайн' : 'не в сети';
    },

    online() {
      return this.info.isOnline;
    },

    getInfo() {
      return this.info.idFrom;
    },

    currentUser() {
      return this.$store.getters.getUser;
    },

    targetId() {
      if (this.info.fromAccountId) {
        if (this.info.fromAccountId === this.currentUser) {
          return this.info.toAccountId;
        } else {
          return this.info.fromAccountId;
        }
      } else {
        return this.info.id;
      }
    },

    modalText() {
      let text = '';
      if (this.modalType === 'delete') {
        text = `Вы уверены, что хотите удалить пользователя ${
          this.info.firstName + ' ' + this.info.lastName
        } из друзей?`;
      } else if (this.modalType === 'deleteModerator') {
        text = `Вы уверены, что хотите удалить ${
          this.info.firstName + ' ' + this.info.lastName
        } из списка модераторов?`;
      } else if (this.modalType === 'block') {
        text = `Вы уверены, что хотите заблокировать пользователя ${
          this.info.firstName + ' ' + this.info.lastName
        }?`;
      } else if (this.modalType === 'unblock') {
        text = `Вы уверены, что хотите разблокировать  пользователя ${
          this.info.firstName + ' ' + this.info.lastName
        }?`;
      }
      return text;
    },

    messageId() {
      if (this.info.toAccountId) {
        return this.info.toAccountId;
      } else return this.info.id;
    },
  },

  mounted() {
    document.addEventListener('click', this.hideDropdown);
    const { dropdown } = this.$refs;
    if (dropdown) {
      dropdown.addEventListener('click', this.stopPropagation);
    }
  },

  beforeDestroy() {
    document.removeEventListener('click', this.hideDropdown);
    this.$refs.dropdown.removeEventListener('click', this.stopPropagation);
  },

  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends', 'apiSubscribe']),
    ...mapActions('profile/dialogs', ['openDialog']),
    ...mapActions('users/actions', ['apiBlockUser', 'apiUnblockUser']),

    acceptFriendRequest(id) {
      if (this.info.statusCode === 'FRIEND') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Этот пользователь уже является вашим другом!',
        });
        return;
      }
      this.apiAddFriends({ id, isApprove: true });
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
    },

    closeModal() {
      this.modalShow = false;
    },

    openModal(id) {
      this.modalType = id;
      this.modalShow = true;
    },

    sendMessage(userId) {
      this.$router.push({ name: 'ImChat', params: { activeDialogId: userId } });
    },

    async onConfrim(id) {
      if (this.modalType === 'delete') {
        this.apiDeleteFriends(id).then(() => this.closeModal());
      } else if (this.modalType === 'deleteModerator') {
        console.log('delete moderator');
      } else if (this.modalType === 'block') {
        this.apiBlockUser(id).then(() => {
          this.blocked = true; // обновляем значение "blocked" внутри компонента
          this.closeModal();
        });
      } else if (this.modalType === 'unblock') {
        this.apiUnblockUser(id).then(() => {
          this.blocked = false; // обновляем значение "blocked" внутри компонента
          this.closeModal();
        });
      }
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    hideDropdown(event) {
      if (this.showDropdown && !this.$refs.dropdown.contains(event.target)) {
        this.showDropdown = false
      }
    },

    stopPropagation(event) {
      event.stopPropagation()
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.accept path
  fill sea-green

.subscribe__icon
    path
      stroke sea-green
      stroke-opacity 1
      stroke-width 2

.friends-block
  position relative
  align-items center
  background #fff
  box-shadow standart-boxshadow
  padding 20px
  width 100%
  display inline-flex
  border-radius 10px
  &:not(:last-child)
    margin-bottom 20px

  .friends-block__showmore
    background transparent
    padding 0
    svg path:nth-child(1)
      fill none
      stroke #ababab
    svg path:nth-child(2),
    svg path:nth-child(3),
    svg path:nth-child(4)
      fill #ababab
    &.active
      svg path:nth-child(1)
        fill none
        stroke #21a45d
      svg path:nth-child(2),
      svg path:nth-child(3),
      svg path:nth-child(4)
        fill #21a45d

.friends-block__img
  width 65px
  height 65px
  border-radius 50%
  overflow hidden
  margin-right 30px
  flex none

  @media (max-width breakpoint-xxl)
    margin-right 10px

  img
    object-fit cover
    width 100%
    height 100%

.friends-block__info
  margin-right auto

.friends-block__name
  font-weight 600
  font-size 18px
  line-height 27px
  color steel-gray
  display block

  @media (max-width breakpoint-xxl)
    font-size 14px

.friends-block__age-city
  font-size 15px
  line-height 22px
  color #5A5A5A

  @media (max-width breakpoint-xxl)
    font-size 13px

.friends-block__actions
  background-color #fff
  position absolute
  right 20px
  top 70%
  display flex
  flex-direction column
  align-items flex-start
  border-radius 10px
  box-shadow 0px 2px 8px rgba(0,0,0,0.08)
  transition all 0.3s ease
  z-index 15
  overflow hidden
  &-block
    display flex
    width 100%
    align-items center
    font-size 14px
    font-weight 500
    justify-content flex-end
    gap 7px
    padding 12px
    flex-direction row-reverse
    cursor pointer
    @media (any-hover: hover)
      &:hover
        background #fbfbfb
        span
          color #21a45d

  @media (max-width breakpoint-xxl)
    & + &
      margin-left 5px

  & + &
    margin-left 10px

  &.message
    margin-top 5px

    .simple-svg
      fill eucalypt

  &.delete
    margin-top 3px

  &.add
    margin-top 2px
    margin-left 15px

  .simple-svg-wrapper
    font-size 0
    width 15px
    height 15px
</style>
