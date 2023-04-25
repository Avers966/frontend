<template>
  <div class="form-layout__main">
    <div class="form-layout__logo">
      <p>Code Lounge</p>
      <main-logotype :width="35" :height="35"/>
    </div>
    <h1 class="form-layout__title">{{ info.title }}</h1>
    <p class="form-layout__text">{{ info.text }}</p>
    <p class="form-layout__descr" v-if="info.descr">{{ info.descr }}</p>

    <button-hover
      class="form-layout__btn"
      v-if="info.btn && info.btn.href"
      :variant="info.btn.variant"
    >
      <a :href="info.btn.href" target="_blank" style="color: white">
        {{ info.btn.text }}
      </a>
    </button-hover>

    <button-hover
      class="form-layout__btn"
      :to="{ name: info.btn.link }"
      v-else-if="info.btn"
      :variant="info.btn.variant"
    >
      {{ info.btn.text }}
    </button-hover>
  </div>
</template>

<script>
import MainLogotype from '../../Icons/MainLogotype.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'FormLayoutInfo',
  components: { MainLogotype },
  data: () => ({
    language: '',
    isOpenLanguageBlock: false,
  }),
  computed: {
    ...mapGetters('auth/info', ['getInfoById']),
    info() {
      return this.getInfoById(this.$route.path.split('/')[1]);
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.form-layout__main
  margin auto 0

.form-layout__logo
  position absolute
  top 75px
  left 150px
  z-index 1000
  display inline-flex
  padding 10px
  border-radius 10px
  background #ffffff21
  user-select none
  pointer-events none
  gap 10px
  max-width unset
  p
    font-size 25px
    font-weight 300
    text-transform uppercase
  svg path:nth-child(3)
    animation gradient 1s linear infinite

@keyframes gradient {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.form-layout__title
  font-family font-exo
  font-style normal
  font-weight 200
  font-size 40px
  line-height 53px
  letter-spacing -0.01em
  margin-bottom 30px

  @media (max-width breakpoint-xxl)
    font-size 28px
    line-height 36px

.form-layout__text
  font-size 18px
  line-height 30px
  letter-spacing 0.01em
  color jumbo
  max-width 575px

  @media (max-width breakpoint-xxl)
    font-size 14px

  & + .form-layout__btn
    margin-top 40px

.form-layout__descr
  font-size 15px
  letter-spacing 0.01em
  color scarpa-flow
  margin-bottom 15px
  margin-top 30px
</style>
