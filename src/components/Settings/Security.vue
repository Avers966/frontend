<template>
  <div class="settings-security">
    <div class="settings-security__block">
      <div class="settings-security__mail">
        <h3 class="settings-security__title">E-mail:</h3>

        <input
          class="settings-security__value"
          v-model="changeEmail"
          autocomplete="off"
        />

        <button class="settings-security__btn" @click.prevent="openModal('email')">Изменить</button>
      </div>

      <h3 class="settings-security__title">Пароль:</h3>
      <input
        class="settings-security__value not-first"
        type="password"
        v-model="password"
        placeholder="Введите текущий пароль"
        autocomplete="new-password"
      />
      <input
        class="settings-security__value"
        type="password"
        v-model="passwordTwo"
        placeholder="Введите новый пароль"
        autocomplete="new-password"
      />
      <button class="settings-security__btn" @click.prevent="openModal('password')">Изменить</button>
    </div>

    <modal v-model="modalShow">
      <p v-if="modalText">{{ modalText }}</p>

      <template slot="actions">
        <button-hover @click.native="closeModal">Ок</button-hover>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import auth from '@/requests/auth';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SettingsSecurity',
  components: { Modal },

  data: () => ({
    modalShow: false,
    modalText: '',
    changeEmail: '',
    password: '',
    passwordTwo: '',
  }),

  computed: {
    ...mapGetters('profile/info', ['getInfo']),
  },

  mounted() {
    setTimeout(() => {
      this.changeEmail = this.getInfo?.email;
      this.password = '';
      this.passwordTwo = '';
    }, 300);
  },

  methods: {
    ...mapActions('auth/api', ['logout']),

    closeModal() {
      this.modalShow = false;
    },

    async openModal(id) {
      if (id === 'email') {
        await auth.requestChangeEmailLink({ email: this.changeEmail }).then(() => {
          this.modalText = `Адрес электронной почты успешно изменен на ${this.changeEmail}`;
          this.modalShow = true;
          setTimeout(() => {
            this.logout().finally(() => {
              this.$router.push('/login');
            });
          }, 3000);
        });
      }

      if (id === 'password') {
        if (this.password === this.passwordTwo) {
          await auth.requestChangePasswordLink({ password: this.passwordTwo }).then(() => {
            this.modalText = `Пароль успешно изменен`;
            this.modalShow = true;
          });
        }
      }
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'


.settings-security__block
  background #fff
  box-shadow standart-boxshadow
  display flex
  flex-direction column
  width 100%
  padding 30px
  font-size 15px
  border-radius 20px

  &+&
    margin-top 20px

.settings-security__mail
  margin-bottom 30px

.settings-security__btn
  display block
  min-width 180px
  max-width 180px
  color #21a45d
  border-radius 10px
  text-align center
  background #fff
  border 1px solid #21a45d
  font-size 14px
  padding 10px
  @media (any-hover: hover)
    &:hover
      background #21a45d
      color #fff

.settings-security__title
  color #000
  margin-bottom 15px
  font-family 'Exo', Arial, sans-serif
  font-size 24px
  font-weight 600

.form__input_stylus
  color #000000

.settings-security__value
  display block
  width 100%
  color #767676
  border-radius 10px
  background #fff
  border 1px solid #ababab
  font-size 14px
  padding 10px 15px
  margin-bottom 15px
</style>
