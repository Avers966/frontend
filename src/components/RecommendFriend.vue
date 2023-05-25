<template>
  <div class="recommend-block">
    <h3 class="recommend-block__title">{{ translations.recommendBlockTitle }}</h3>
    <ul v-if="userInfo?.length > 0" class="recommend-block__list">
      <li class="recommend-block__item" v-for="user in userInfo" :key="user?.id">
        <div>
          <img v-if="user.photo" class="recommend-block__img" :src="user?.photo" :alt="user?.firstName">
          <img v-else class="recommend-block__img" src="/static/img/avatar.png" :alt="user?.firstName" />

          <router-link
            class="recommend-block__name"
            :to="{ name: 'ProfileId', params: { id: user?.id } }"
          >
            {{ user?.firstName + ' ' + user?.lastName }}
          </router-link>

        </div>
        <a class="recommend-block__button" href="#" @click.prevent="apiAddFriends({ id: user?.id })">{{ translations.recommendBlockAdd }}</a>
      </li>
    </ul>
    <div v-else class="recommend-block__not">
      <p>
        {{ translations.recommendBlockDescription }}
      </p>
      <router-link class="recommend-block__search" href="#" :to="{ name: 'FriendsFind' }">
        {{ translations.recommendBlockBtn }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import translations from '@/utils/lang.js';

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
      return this.possibleFriends.map(friend => friend.friendId);
    },

    translations() {
      const lang = this.$store.state.auth.languages.language.name;
      if (lang === 'Русский') {
        return translations.rus;
      } else {
        return translations.eng;
      }
    },
  },

  mounted() {
    if (this.possibleFriends.length === 0) this.apiRecommendations();
    this.fetchUserInfo();
  },

  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiRecommendations']),

    fetchUserInfo() {
      const requests = this.getInfo.map(id => axios.get(`/account/${id}`));
      Promise.all(requests)
        .then(responses => {
          this.userInfo = responses.map(response => response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
};
</script>

<style lang="stylus">
@import '../assets/stylus/base/vars.styl'

  .recommend-block
    min-width 430px
    height max-content
    padding 30px
    background ui-cl-color-white-theme
    box-shadow 0px 2px 8px rgba(0, 0, 0, 0.08)
    border-radius border-small

    &__not
      display flex
      flex-direction column
      align-items center
      p
        margin-bottom 15px
        line-height 120%

    &__title
      font-size 24px
      font-weight font-weight-bold
      padding-bottom 25px
      border-bottom 1px solid ui-cl-color-e6e6e6
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
        border-bottom 1px solid ui-cl-color-e6e6e6
        margin-bottom 15px
      &:last-child
        padding-bottom 0

    &__img
      border-radius border-half
      width 50px
      height 50px
      margin-right 5px

    &__name
      font-weight font-weight-medium
      font-size font-size-downdefault
      line-height 20px

    &__button
      background-color ui-cl-color-eucalypt
      padding 3px 5px
      font-size font-size-small-medium
      border-radius border-super-small
      line-height 21px
      color ui-cl-color-white-theme
      transition all .2s ease-in-out
      @media (any-hover: hover)
        &:hover
          background-color ui-cl-color-gun-powder

    &__search
      display block
      text-align center
      color ui-cl-color-eucalypt
      width 100%
      padding 18px 5px
      border 2px solid ui-cl-color-eucalypt
      border-radius border-super-small
      transition all .2s ease-in-out
      background transparent
      @media (any-hover: hover)
        &:hover
          background ui-cl-color-eucalypt
          border-color ui-cl-color-eucalypt
          color ui-cl-color-white-theme
</style>
