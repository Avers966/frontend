<template>
  <div class="friends inner-page">
    <div class="inner-page__main">
      <div class="friends__header">
        <div class="friends__header-left">
          <h2 class="friends__title">Мои друзья</h2>
          <div class="friends__search">
            <div class="friends__search-icon">
              <search-icon />
            </div>

            <input
              class="friends__search-input"
              placeholder="Начните вводить имя друга..."
              v-model="firstName"
            />
          </div>
        </div>
        <ul class="friends__tabs">
          <li class="friends__tabs__item" v-if="localFriends.REQUEST_FROM">
            <button
              :class="{ 'friends__tabs__link active': isActive('application') }"
              @click.prevent="setActive('application')"
            >
              {{ 'Запросы в друзья' + ' ' + `(${localFriends.REQUEST_FROM?.length || 0})` }}
            </button>
          </li>
          <li class="friends__tabs__item" v-if="localFriends.REQUEST_TO">
            <button
              :class="{ 'friends__tabs__link active': isActive('outgoing') }"
              @click.prevent="setActive('outgoing')"
            >

              {{ 'Исходящие запросы' + ' ' + `(${localFriends.REQUEST_TO?.length || 0})` }}
            </button>
          </li>
          <li class="friends__tabs__item" v-if="localFriends.FRIEND">
            <button
              :class="{ 'friends__tabs__link active': isActive('friends') }"
              @click.prevent="setActive('friends')"
            >
              {{ 'Друзья' + ' ' + `(${localFriends.FRIEND?.length || 0})` }}
            </button>
          </li>
          <li class="friends__tabs__item" v-if="localFriends.SUBSCRIBED">
            <button
              :class="{ 'friends__tabs__link active': isActive('subscribers') }"
              @click.prevent="setActive('subscribers')"
            >
              {{ 'Подписчики' + ' ' + `(${localFriends.SUBSCRIBED?.length || 0})` }}
            </button>
          </li>
          <li class="friends__tabs__item" v-if="localFriends.BLOCKED">
            <button
              :class="{ 'friends__tabs__link active': isActive('blocked') }"
              @click.prevent="setActive('blocked')"
            >
              {{ 'Заблокированные' + ' ' + `(${localFriends.BLOCKED?.length || 0})` }}
            </button>
          </li>
          <li class="friends__tabs__item" v-if="localFriends.REJECTING">
            <button
              :class="{ 'friends__tabs__link active': isActive('rejected') }"
              @click.prevent="setActive('rejected')"
            >
              {{ 'Отклоненные запросы' + ' ' + `(${localFriends.REJECTING?.length || 0})` }}
            </button>
          </li>
          <li class="friends__tabs__item" v-if="localFriends.WATCHING">
            <button
              :class="{ 'friends__tabs__link active': isActive('signed') }"
              @click.prevent="setActive('signed')"
            >
              {{ 'Подписан(а)' + ' ' + `(${localFriends.WATCHING?.length || 0})` }}
            </button>
          </li>
        </ul>
      </div>

      <div class="friends__content">
        <div class="friends__list">
          <div v-if="localFriends.REQUEST_FROM" class="friends_group" :class="{ 'active': isActive('application') }">
            <h3 class="friends_group_title friends__title">Запросы в друзья</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.REQUEST_FROM"
              :key="friend.id"
              :info="friend"
              accept-button
            />
          </div>
          <div v-if="localFriends.REQUEST_TO" class="friends_group" :class="{ 'active': isActive('outgoing') }">
            <h3 class="friends_group_title friends__title">Исходящие запросы</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.REQUEST_TO"
              :key="friend.id"
              :info="friend"
            />
          </div>

          <div v-if="localFriends.FRIEND" class="friends_group" :class="{ 'active': isActive('friends') }">
            <h3 class="friends_group_title friends__title">Друзья</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.FRIEND"
              :key="friend.id"
              :info="friend"
            />
          </div>

          <div v-if="localFriends.SUBSCRIBED" class="friends_group" :class="{ 'active': isActive('subscribers') }">
            <h3 class="friends_group_title friends__title">Подписчики</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.SUBSCRIBED"
              :key="friend.id"
              :info="friend"
            />
          </div>

          <div v-if="localFriends.BLOCKED" class="friends_group" :class="{ 'active': isActive('blocked') }">
            <h3 class="friends_group_title friends__title">Заблокированные пользователи</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.BLOCKED"
              :key="friend.id"
              :info="friend"
              :blocked="true"
            />
          </div>

          <div v-if="localFriends.REJECTING" class="friends_group" :class="{ 'active': isActive('rejected') }">
            <h3 class="friends_group_title friends__title">Отклоненные запросы</h3>
            <friends-block
              friend="friend"
              v-for="friend in localFriends.REJECTING"
              :key="friend.id"
              :info="friend"
            />
          </div>

          <div v-if="friends.WATCHING" class="friends_group" :class="{ 'active': isActive('signed') }">
            <h3 class="friends_group_title friends__title">Подписан(а)</h3>
            <friends-block
              friend="friend"
              v-for="friend in friends.WATCHING"
              :key="friend.id"
              :info="friend"
            />
          </div>
        </div>

        <div class="inner-page__aside">
          <recommend-friend />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import RecommendFriend from '@/components/RecommendFriend.vue';
import FriendsBlock from '@/components/Friends/Block';
import SearchIcon from '@/Icons/SearchIcon.vue';

export default {
  name: 'Friends',
  components: { RecommendFriend, FriendsBlock, SearchIcon },

  data: () => ({
    firstName: '',
    localFriends: [],
    statusCodes: [
      'REQUEST_FROM',
      'REQUEST_TO',
      'FRIEND',
      'BLOCKED',
      'REJECTING',
      'SUBSCRIBED',
      'WATCHING',
    ],
    activeItem: 'application',
  }),

  computed: {
    ...mapGetters('profile/friends', ['getResultById']),
    ...mapState('profile/friends', ['friends']),
  },

  watch: {
    friends() {
      console.log('watch');
      this.localFriends = this.friends;
    },
  },

  mounted() {
    this.statusCodes.forEach((statusCode) => {
      this.apiFriends({ statusCode });
    });
    this.localFriends = this.friends;
  },

  methods: {
    ...mapActions('profile/friends', ['apiFriends']),

    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
    }
  },
};
</script>

<style scoped lang="stylus">
.friends_group_title
  margin-bottom 15px
  font-weight 600
  font-size 30px
  color #000

.friends_group
  display none
  &.active
    display block
  &:not(:last-child)
    margin-bottom 40px
.friends__content
  position relative
  width 100%
  display grid
  grid-template-columns 70% 30%
  gap 30px

  .inner-page__aside
    max-width 100%
    margin-top 54px

.friends__list
  display flex
.inner-page
  &__main
    max-width none



.friends-possible
  margin-top 0

@media (max-width 892px)
  .friends__content
    flex-direction column
    align-items stretch
  .inner-page__aside
    position static
    max-width none
    width 100%
    margin-bottom 40px
    order -1
  .friends__list
    margin-right 0

  .friends_group:not(:last-child)
    margin-bottom 40px
</style>
