<template>
  <div class="recommend-block">
    <h3 class="recommend-block__title">Возможно вы их знаете</h3>
    <ul v-if="possibleFriends.length > 0" class="recommend-block__list">
      <li class="recommend-block__item" v-for="user in possibleFriends" :key="user.id">
        <div>
          <img class="recommend-block__img" :src="user.photo" :alt="user.firstName">

          <router-link
            class="recommend-block__name"
            :to="{ name: 'ProfileId', params: { id: user.id } }"
          >
            {{ user.firstName + ' ' + user.lastName }}
          </router-link>

        </div>
        <a class="recommend-block__button" href="#" @click.prevent="apiAddFriends({ id: user.id })">Добавить</a>
      </li>
    </ul>
    <div v-else class="recommend-block__not">
      <p>
        В данный момент нет вариантов.<br />
        Для получения рекомендаций, добавьте несколько друзей.
      </p>
      <router-link class="recommend-block__search" href="#" :to="{ name: 'FriendsFind' }">
        Искать друзей
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: 'FriendsPossible',

  data: () => ({
    userInfo: null
  }),

  computed: {
    ...mapGetters('profile/friends', ['getResultById']),

    possibleFriends() {
      return this.getResultById('recommendations');
    },

    getInfo() {
      return this.possibleFriends.map(friend => friend.idFrom);
    },
  },

  mounted() {
    if (this.possibleFriends.length === 0) this.apiRecommendations();
    this.fetchUserInfo();
  },

  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiRecommendations']),

    fetchUserInfo() {
      const user = this.getInfo();
      axios.get(`/account/${user}`)
        .then(response => {
          this.userInfo = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="stylus">
  .recommend-block
    min-width 430px
    height max-content
    padding 30px 40px
    background #FFFFFF
    box-shadow 0px 2px 8px rgba(0, 0, 0, 0.08)
    border-radius 10px

    &__not
      display flex
      flex-direction column
      align-items center
      p
        margin-bottom 15px

    &__title
      font-size 24px
      font-weight bold
      padding-bottom 25px
      border-bottom 1px solid #E6E6E6
      margin-bottom 15px

    &__list
      display flex
      flex-direction column

    &__item
      display flex
      align-items center
      padding-bottom 15px
      justify-content space-between

      &:not(nth-child(1))
        padding-top 15px

      &:not(:last-child)
        border-bottom 1px solid #E6E6E6
        margin-bottom 15px

    &__img
      border-radius 50%
      width 50px
      height 50px
      margin-right 20px

    &__name
      font-weight 600
      font-size 15px
      line-height 20px

    &__button
      font-size 13px
      line-height 21px
      color #21A45D

    &__search
      display block
      text-align center
      color #21A45D
      width 100%
      padding 18px 5px
      border 2px solid #21A45D
      transition all .2s ease-in-out
      background transparent
      @media (any-hover: hover)
        &:hover
          background #21A45D
          border-color #21A45D
          color #fff
</style>
