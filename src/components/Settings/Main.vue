<template>
  <div class="settings-main">

    <div class="settings-main-photoblock">
      <div class="user-info-form__block user-info-form__block--photo">
        <div class="settings-main__top">
          <div class="main-layout__user-pic" v-if="src">
            <img :src="src" :alt="firstName[0]" />
          </div>
          <div class="main-layout__user-pic" style="background-color: #333;" v-else>
            <img src="https://yastatic.net/s3/yandex-id-static/yandex-id/_/_next/static/media/avatar-placeholder.f27a38d6.png" alt="Нет фото" />
          </div>
        </div>

        <div class="user-info-form__wrap">
          <div class="user-info-form__photo-wrap">
            <input
              class="user-info-form__input_stylus-photo"
              type="file"
              ref="photo"
              id="photo"
              @change="processFile($event)"
              accept="image/*"
            />
            <button class="setting-main__buttons" @click.prevent="loadPhoto">
              <load-photo /> Добавить фото
            </button>
            <div v-if="src" class="settings-main__top--delete" @click="deletePhoto">
              <div class="settings-main__top--delete-icon">
                <delete-icon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <user-info-form-block
      label="Имя:"
      placeholder="Введите имя"
      text="firstName"
      v-model="firstName"
      ref="firstName"
    />

    <user-info-form-block
      label="Фамилия:"
      placeholder="Введите фамилию"
      text="lastName"
      v-model="lastName"
      ref="lastName"
    />

    <user-info-form-block
      label="Телефон:"
      placeholder="Введите телефон"
      v-model="phone"
      phone="phone"
    />

    <div class="settings-main-input">
      <span class="user-info-form__label_stylus">Страна:</span>

      <div class="user-info-form__wrap">
        <v-select
          placeholder="Выберите страну"
          class="country"
          v-model="country"
          :options="countryNames"
          :key="countries.id"
        />
      </div>
    </div>

    <div class="settings-main-input">
      <span class="user-info-form__label_stylus">Город:</span>

      <div class="user-info-form__wrap">
        <v-select
          placeholder="Выберите город"
          class="country"
          v-model="city"
          :options="cityNames"
          :key="cities.id"
        />
      </div>
    </div>

    <div class="settings-main-input">
      <span class="user-info-form__label_stylus">Дата рождения:</span>

      <div class="user-info-form__wrap">
        <select class="select user-info-form__select day" v-model="day">
          <option :value="null">Неизвестно</option>
          <option v-for="d in days" :key="d">{{ d }}</option>
        </select>

        <select class="select user-info-form__select month" v-model="month">
          <option :value="null">none</option>
          <option v-for="month in months" :key="month.val" :value="month">
            {{ month.text }}
          </option>
        </select>

        <select class="select user-info-form__select year" v-model="year">
          <option :value="null">Неизвестно</option>
          <option v-for="i in years" :key="i">{{ i }}</option>
        </select>
      </div>
    </div>

    <user-info-form-block label="О себе:" v-model="about" about="about" />

    <div class="user-info-form__block user-info-form__block--actions">
      <div class="user-info-form__wrap">
        <button class="setting-main__buttons button-submit" @click.prevent="submitHandler">
          Сохранить
        </button>
        <router-link :to="{ name: 'Profile' }" tag="button" class="setting-main__buttons canceled">
          Отменить
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DeleteIcon from '../../Icons/DeleteIcon.vue';
import LoadPhoto from '@/Icons/LoadPhoto.vue';
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
// import moment from 'moment';
import UserInfoFormBlock from '@/components/Settings/UserInfoForm/Block.vue';
import axios from 'axios';


Vue.component('VSelect', VSelect)
export default {
  name: 'SettingsMain',
  components: { UserInfoFormBlock, DeleteIcon, LoadPhoto },

  data: () => ({
    photoName: 'Фотография',
    firstName: '',
    lastName: '',
    phone: '',
    about: '',
    day: 1,
    month: { val: 1, text: 'Января' },
    year: 2000,
    months: [
      { val: 0, text: 'Января' },
      { val: 1, text: 'Февраля' },
      { val: 2, text: 'Марта' },
      { val: 3, text: 'Апреля' },
      { val: 4, text: 'Мая' },
      { val: 5, text: 'Июня' },
      { val: 6, text: 'Июля' },
      { val: 7, text: 'Августа' },
      { val: 8, text: 'Сентября' },
      { val: 9, text: 'Октября' },
      { val: 10, text: 'Ноября' },
      { val: 11, text: 'Декабря' },
    ],
    fileName: '',
    src: '',
    country: '',
    city: '',
    countries: [],
    cities: [],
    currentCountry: {},
  }),

  computed: {
    ...mapGetters('global/storage', ['getStorage']),
    ...mapGetters('profile/info', ['getInfo']),

    phoneNumber() {
      return this.phone.replace(/\D+/g, '');
    },

    years() {
      return Array.from({ length: 61 }, (value, index) => 1962 + index);
    },

    countryNames () {
      return this.countries.map(country => country.title)
    },

    cityNames () {
      return this.cities.map(city => city.title)
    },

    days() {
      return this.month.val === 1
        ? this.year & 3 || (!(this.year % 25) && this.year & 15)
          ? 28
          : 29
        : 30 + ((this.month.val + (this.month.val >> 3)) & 1);
    },
  },

  watch: {
    getInfo(value) {
      if (!value) {
        return;
      }
      this.setInfo();
    },
    country: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue !== '') {
          setTimeout(() => {
          this.currentCountry = this.countries.find(country => country.title === newValue);
          this.loadCities(this.currentCountry.id);

            if (this.city && this.currentCountry && this.city !== '' && this.currentCountry.id !== this.cities.find(city => city.title === this.city).countryId) {
              this.city = '';
              this.country = '';
            }
          }, 700)
        } else {
          this.city = '';
          this.country = '';
        }
      }
    }
  },

  mounted() {
    this.loadCountries();
  },

  methods: {
    ...mapActions('global/storage', ['apiStorage']),
    ...mapActions('profile/info', ['apiChangeInfo']),
    ...mapMutations('global/storage', ['setStorage']),

    loadCountries() {
      axios
        .get('/geo/country')
        .then((response) => {
          this.countries = response.data;
          if (this.getInfo) {
            this.setInfo();
          }
        })
        .catch(() => {});
      return;
    },

    loadCities(countryId) {
      if (!countryId) {
        this.city = null;
        return;
      }
      axios.get(`/geo/country/${countryId}/city`).then((response) => {
        this.cities = response.data;
      });
      return countryId;
    },

    async submitHandler() {
      let _birthDate = 'none';
        if (this.year && this.month && this.day) {
          _birthDate = new Date(this.year, this.month.val, this.day).toISOString();
        }

        if (!this.$refs.firstName.validate() && !this.$refs.lastName.validate()) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'error',
          text: 'Поля "Имя" и "Фамилия" являются обязательными',
        });
        return
      } else if (!this.$refs.firstName.validate()) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'error',
          text: 'Поле "Имя" является обязательным',
        });
        return;
      } else if (!this.$refs.lastName.validate()) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'error',
          text: 'Поле "Фамилия" является обязательным',
        });
        return;
      } else if (this.lastName.length < 3 && this.firstName.length < 3) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'error',
          text: 'Имя и Фамилия не могут быть короче 3-ёх символов',
        });
        return;
      } else if (this.firstName.length < 3) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'error',
          text: 'Имя не может быть короче 3-ёх символов',
        });
        return;
      } else if (this.lastName.length < 3) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'error',
          text: 'Фамилия не может быть короче 3-ёх символов',
        });
        return;
      }

      if (this.fileName) {
        await this.apiStorage(this.fileName).then((response) => {
          this.photoName = response.data.photoName;
          this.fileName = response.data.fileName;
        });
      }

      await this.apiChangeInfo({
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: _birthDate,
        phone: this.phoneNumber,
        about: this.about,
        country: this.country,
        city: this.city,
        photoName: this.photoName,
        photo: this.fileName,
      }).then(() =>
      this.setStorage(null))
      this.$router.push('/profile');;
    },

    processFile(event) {
      [this.fileName] = event.target.files;
      const reader = new window.FileReader();
      reader.onload = (e) => {
        this.src = e.target.result;
      };
      reader.readAsDataURL(this.fileName);
    },

    loadPhoto() {
      this.$refs.photo.click();
    },

    deletePhoto() {
      this.fileName = '';
      this.photoName = '';
      this.src = '';
      this.setStorage('');
    },

    setInfo() {
      this.firstName = this.getInfo.firstName;
      this.lastName = this.getInfo.lastName;
      this.src = this.getInfo.photo;
      if (this.getInfo.phone) {
        this.phone = this.getInfo.phone.replace(/^[+]?[78]/, '');
      } else this.phone = '';

      if (this.getInfo.birthDate) {
        const birthDate = new Date(this.getInfo.birthDate);
        this.day = birthDate.getDate();
        this.month = this.months[birthDate.getMonth()];
        this.year = birthDate.getFullYear();
      }
      this.about = this.getInfo.about;
      if (this.getInfo.country) {
        this.country = this.getInfo.country;
        this.currentCountry = this.countries.find((country) => country.title === this.country);
        this.loadCities(this.currentCountry?.id);
      }
      if (this.getInfo.city) {
        this.city = this.getInfo.city;
      }
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.settings-main
  background #fff
  width 550px
  box-shadow standart-boxshadow
  padding 40px 20px
  border-radius 20px

  .user-info-form__label_stylus
    white-space pre-wrap

.settings-main__back
  margin-left 20px

.setting-main__delete-icon
  position absolute
  right 10px
  top 12px
  width 12px
  height 12px

.country
  width 100%

.user-info-form__block
  display flex
  justify-content center
  flex-direction column
  .main-layout__user-pic
    width 96px
    height 96px
    border 2px solid grey
    margin-right 0
  img
    width 100%
    height 100%

.settings-main__top
  display flex
  align-items center
  gap 15px
  justify-content center
  margin-bottom 15px
  &--delete
    display flex
    flex-direction column
    font-size 11px
    cursor pointer
    &-icon
      display inline-flex
      justify-content center
      align-items center
      background #e9e9e9
      padding 9px 10px
      border-radius 100%
      margin-left 10px
      @media (any-hover: hover)
        &:hover
          background #c5c5c5

.setting-main__buttons
  background #e9e9e9
  padding 10px
  border-radius 20px
  font-size 14px
  &.button-submit
    min-width 150px
  @media (any-hover: hover)
    &:hover
      background #c5c5c5
  &.canceled
    margin-left 10px
    background transparent
    border: 1px solid #c5c5c5
    color #8e8e8e
    @media (any-hover: hover)
      &:hover
        background #c85252
        border-color #c85252
        color #fff

.settings-main-photoblock
  margin-bottom 25px

.settings-main-input
  display flex
  flex-direction column
  align-items flex-start

.user-info-form__select
  width 100%
  border 1px solid #E3E3E3
  padding 15px 20px
  font-size 15px
  color #000
  display flex
  height auto
  align-items center
  white-space nowrap
  overflow hidden
  position relative
  border-radius 10px

.vs__dropdown-toggle
  width 100%
  border 1px solid #e3e3e3
  padding 0
  background transparent
  font-size 15px
  color #000
  display flex
  align-items center
  white-space nowrap
  overflow hidden
  position relative
  border-radius 10px
.vs__selected
  margin 0
  padding 0
  color #000
.vs__selected-options
  padding 11px 20px
.vs__search,
.vs__search:focus
  margin 0
  padding 0
.vs__actions
  padding-right 10px
  margin 0
.vs__clear
  vertical-align unset
  svg
    height 10px
    display block
@media (min-width: 320px) and (max-width: 768px)
  .settings
    .aside-filter
      background-color transparent !important
      &__title
        display block
    .aside-filter
      border-radius 0
      background none
      margin-bottom 20px
      &__list
        flex-direction column
      &__item
        padding 10px 0 10px 0
        font-size 13px
    &-main
      width 100%
      padding 15px
    &-push
      width 100% !important
      padding 15px !important
      &__name
        font-size 10px !important
      &__item
        padding 10px 0 !important
      &__icon
        width 14px !important
    .user-info-form__input_stylus
      padding 10px
      font-size 12px
    .vs__selected-options
      padding 10px
      font-size 12px
    .user-info-form__select
      padding 10px
      font-size 12px
    .settings-push__check-label:after
      width 30px
    .settings-push__check-label:before
      width 17px
      height 17px
      top -8px
    .settings-push__check-input:checked + .settings-push__check-label:before
      left 32%
    .settings-security__block
      width 100%
      padding 15px
    .settings-delete__title
      font-size 14px
      line-height 130%
      max-width unset
    .settings-delete__confirm-label
      font-size 11px
    .settings-delete__confirm-label:before
      width 18px
      height 15px
      margin-right 15px
    .settings-delete__confirm-label:after
      width 0
      height 8px
      top 9px
      left 6px
    .settings-delete__confirm
      margin-bottom 15px
    .settings-delete__actions
      .btn.btn--disable
        margin 0
      .btn.btn--warning
        margin 0
    .settings-delete__actions-link
      font-size 12px
    .settings-security__title
      font-size 20px
</style>
