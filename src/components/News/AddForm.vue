<template>
  <div class="news-add-form">
    <div class="news-add__actions-buttons">
      <button class="close_modal bold" @click.prevent="closeAddForm">x</button>
    </div>

    <form class="news-add__main" action="#">
      <div class="news-add__text">
        <textarea
          class="news-add__text-title"
          :placeholder="translations.newsAddTitle"
          v-model="title"
          maxlength="200"
          v:pattern="200"
          type="textarea"
        />
        <div v-if="src">
          <img :src="src" :alt="'photo'" class="post-image" />
        </div>

        <div>
          <input
            class="user-info-form__input_stylus-photo"
            type="file"
            ref="photo"
            id="photo"
            @change="processFile($event)"
            accept="image/*"
            max-size="3MB"
          />
        </div>

        <editor-content class="news-add__text-main" :editor="editor" />

        <editor-menu-bar
          class="news-add__actions"
          :editor="editor"
          v-slot="{ commands, isActive }"
        >
          <div class="news-add__actions-buttons">
            <button
              class="bold"
              :class="{ 'is-active': isActive.bold() }"
              @click.prevent="commands.bold">
              ж
            </button>

            <button
              class="italic"
              :class="{ 'is-active': isActive.italic() }"
              @click.prevent="commands.italic"
            >
              к
            </button>

            <button
              class="underline"
              :class="{ 'is-active': isActive.underline() }"
              @click.prevent="commands.underline"
            >
              ч
            </button>

            <div class="news-add__block photo" @click.prevent="loadPhoto">
              <simple-svg :filepath="'/static/img/photo.svg'" />
            </div>

            <div class="news-add__block" v-if="src">
              <button class="bold" @click.prevent="deletePhoto">x</button>
            </div>
          </div>
        </editor-menu-bar>
      </div>

      <div class="news-add__settings">
        <h4 class="news-add__settings-title">{{ translations.newsAddSettings }}</h4>

        <add-tags :tags="tags" @change-tags="onChangeTags" />

        <div class="is_planing" v-if="isPlaning">
          <h6>{{ translations.newsAddSettingsTimePublished }}</h6>

          <p>{{ day }} {{ monthNames[month] }} {{ year }} г. в {{ dateTime }}</p>
        </div>

        <div class="plaining-list__btns">
          <button
            v-if="!edit || deffered"
            class="post-btn-planing plaining-hole"
            @click.prevent="openModal"
          >
            {{ translations.newsAddQueued }}
          </button>
          <button
            class="post-btn-planing"
            @click.prevent="submitForm"
          >
            {{ translations.newsAddPosted }}
          </button>
        </div>
      </div>
    </form>

    <modal class="news-add__modal" v-model="modalShow">
      <div class="news-add__modal-selects deferred-post">
        <div class="alert-deferred-post">
          <span>{{ translations.newsAddQueuedTimeToPosted }}</span>
          <span>{{ day || '01' }} {{ monthNames[month] || 'январь' }} {{ year || '1970' }} г. в {{ dateTime || '00:00' }}</span>
        </div>
        <div class="data-pickers-list">
          <date-picker
            v-model="date"
            type="date"
            :placeholder="translations.newsAddDataPickedData"
          >
          </date-picker>
          <date-picker
            v-model="dateTime"
            :hour-options="hours"
            format="HH:mm"
            value-type="format"
            type="time"
            :placeholder="translations.newsAddDataPickedTime"
          >
          </date-picker>
        </div>
      </div>

      <template slot="actions">
        <div class="plaining-list__btns on_plaining">
          <button class="post-btn-planing" @click.prevent="onPlaning">{{ translations.newsAddQueued }}</button>
          <button class="post-btn-planing plaining-hole" @click.prevent="onCancelPlaning">{{ translations.cancel }}</button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Bold, Italic, Underline, Link } from 'tiptap-extensions';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AddTags from '@/components/News/AddTags';
import Modal from '@/components/Modal';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import translations from '@/utils/lang.js';

Vue.directive( 'pattern', {
  update (el, binding) {
    const sourceValue = el.value;
    const maxLength = parseInt(binding.value);
	  el.maxLength = maxLength;

    const newValue = sourceValue
    .replace(/[^a-zA-Zа-яА-ЯёЁ_]/g, '') // убираем знаки препиния, кирилица/латиница/
    .substring(0, maxLength); // ограничиваем колличество вводимых знаков, дублируя ограничение атрибутом.

    if (sourceValue !== newValue) {
      el.value = newValue;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
})

export default {
  name: 'NewsAddForm',

  components: { AddTags, Modal, DatePicker, EditorContent, EditorMenuBar },

  props: {
    edit: Boolean,
    deffered: Boolean,
    info: Object,
  },

  data: () => ({
    title: '',
    content: '',
    tags: [],
    linkUrl: '',
    isOpenLinkMenu: false,
    modalShow: false,
    isPlaning: null,
    editor: null,

    day: '',
    month: '',
    monthNames: ['', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    year: '',
    date: '',
    dateTime: '',
    hours: Array.from({ length: 16 }).map((_, i) => i + 8),
    lastDate: null,
    currentUtcDateTime: null,

    componentKey: 0,
	  photo: '',
    src: '',
    attrs: [
      {
        key: 'weekends',
        content: 'weekends',
        dates: {
          start: new Date(2018, 0, 1),
          end: new Date(2022, 0, 1),
          weekdays: [1, 7],
        },
      },
    ],
  }),

  computed: {
    ...mapGetters('profile/info', ['getInfo']),

    translations() {
      const lang = this.$store.state.auth.languages.language.name;
      if (lang === 'Русский') {
        return translations.rus;
      } else {
        return translations.eng;
      }
    },

    fullDate() {
      if (this.dateTime) {
        const date = new Date(this.date)
        const time = this.dateTime.split(':')
        date.setHours(Number(time[0]))
        date.setMinutes(Number(time[1]))
        return date.toISOString()
      } else {
        return ''
      }
    },

    currentUtc() {
      if (this.dateTime) {
        const date = new Date(this.date)
        const time = this.dateTime.split(':')
        date.setHours(Number(time[0]))
        date.setMinutes(Number(time[1]))
        return date
      } else {
        return ''
      }
    },
  },

  watch: {
    dateTime: function() {
      this.lastDate = this.fullDate;
      this.currentUtcDateTime = this.currentUtc
    },

    lastDate: function(newDate) {
      const date = new Date(newDate);
      this.day = date.getUTCDate();
      this.month = date.getUTCMonth() + 1;
      this.year = date.getUTCFullYear();
    },
  },

  mounted() {
    if (this.info && this.info.imagePath) {
      this.src = this.info.imagePath;
    }
    if (this.edit) {
      this.title = this.info.title;
      this.tags = this.info.tags;
      this.editor = new Editor({
        content: `${this.info.postText}`,
        extensions: [new Bold(), new Italic(), new Underline(), new Link()],
      });

    } else {
      this.editor = new Editor({
        content: '',
        extensions: [new Bold(), new Italic(), new Underline(), new Link()],
      });

    }
  },

  beforeDestroy() {
    this.editor.destroy();
  },


  created() {
    this.lastDate = this.fullDate;
    this.currentUtcDateTime = this.currentUtc;
  },

  methods: {
    ...mapActions('profile/feeds', ['actionsFeed']),
    ...mapActions('global/storagePostPhoto', ['apiStoragePostPhoto']),
    ...mapGetters('global/storagePostPhoto', ['getStoragePostPhoto']),
    ...mapMutations('global/storagePostPhoto', ['setStoragePostPhoto']),

    onChangeTags(tags) {
      this.tags = tags;
    },

    loadPhoto() {
      this.$refs.photo.click();
    },

    deletePhoto() {
      this.photo = '';
      this.src = '';
      this.setStoragePostPhoto('');
    },

    processFile(event) {
      [this.photo] = event.target.files;
      const reader = new window.FileReader();
      reader.onload = (e) => (this.src = e.target.result);
      reader.readAsDataURL(this.photo);
    },

    async submitForm() {
      if (this.title.length <= 3 || this.editor.getHTML().length <= 7) {
        if (this.modalShow) this.closeModal();
        this.$store.dispatch('global/alert/setAlert', {
          status: 'response',
          text: 'Тема должен состоять не менее трех символов, текст - не менее семи.',
        });
        return;
      }


      if (this.photo) {
        await this.apiStoragePostPhoto(this.photo);

        if (this.getStoragePostPhoto()) {
          this.imagePath = this.getStoragePostPhoto();
        }
      } else if (!this.src) {
        this.imagePath = '';
      } else if (this.info && this.info.imagePath) {
        this.imagePath = this.info.imagePath;
      }

      await this.actionsFeed({
        imagePath: this.imagePath,
        route: this.$route.name,
        postId: this.info ? this.info.id : null,
        edit: this.edit,
        id: this.getInfo.id,
        title: this.title,
        postText: this.editor.getHTML(),
        tags: this.tags,
        publishDate:
          this.isPlaning &&
          this.lastDate
      }).then(() => {
        this.$emit('submit-complete');
        this.setStoragePostPhoto(null);
      });
    },
    openModal() {
      this.modalShow = true;
    },
    closeModal() {
      this.modalShow = false;
    },
    onPlaning() {
      if (this.currentUtcDateTime < new Date()) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'validation',
          text: 'Запланированное время не может быть в прошлом времени!',
        });
        return;
      }
      this.isPlaning = true;
      this.modalShow = false;
    },
    onCancelPlaning() {
      this.isPlaning = null;
      this.year = 1970;
      this.month = 1;
      this.day = 1;
      this.dateTime = '00:00';
      this.modalShow = false;
    },
    closeAddForm() {
      this.$emit('close-form');
    },
  },
};
</script>
<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

@media (min-width: 320px) and (max-width: 768px)
  .news-add
    &__main
      flex-direction column
      padding 0 15px 15px 15px
    &__text
      margin-right 0
      padding-right 0
      border-right 0
      &__title
        padding-bottom 0
        font-size font-size-updefault
    &__actions-buttons
      padding 10px 15px 0 15px
      justify-content flex-end
      .close_modal
        position unset
    &__settings
      max-width unset
      &-title
        font-size font-size-updefault
    .modal__wrapper
      padding 15px
      max-width 300px
  .news-add__actions
    justify-content unset
    padding 15px 0 20px 0


</style>
<style lang="stylus" media="screen">
@import '../../assets/stylus/base/vars.styl'
.close_modal
  position relative
  top 8px
  left 95%
  width 25px

.ProseMirror-focused
  height 200px

.ProseMirror
  height 200px

.is_planing
  font-size font-size-small
  background ui-cl-color-white-bright
  padding 5px
  color #6b6b6b
  display flex
  flex-direction column
  border-radius 10px 10px 0 0

.post-image
  width 250px
  margin-bottom 30px

.news-add__text-main
  cursor text

.deferred-post
  display flex
  flex-direction column
  gap 20px
  align-items center
  justify-content center
  border-top 0
  padding-top 0

.data-pickers-list
  display flex
  align-items center
  gap 15px
  .mx-datepicker
    width auto

.alert-deferred-post
  display flex
  width 100%
  flex-direction column
  align-items center
  justify-content center
  padding 10px
  font-size font-size-default
  background #f6f6f6
  border-radius border-super-small
  border 1px solid #d9d9d9
  span:nth-child(1)
    font-weight font-weight-bold


.news-add__text-title
  border-bottom: 1px solid ui-cl-color-e6e6e6
  padding-bottom 20px

.post-btn-planing
  display block
  text-align center
  color ui-cl-color-white-theme
  width 100%
  padding 10px 5px
  border 2px solid ui-cl-color-eucalypt
  transition all 0.2s ease-in-out
  background ui-cl-color-eucalypt
  @media (any-hover: hover)
    &:hover
      background ui-cl-color-grey-color
      border-color ui-cl-color-grey-color
      color ui-cl-color-white-theme

.post-btn-planing.plaining-hole
  background transparent
  color ui-cl-color-eucalypt
  @media (any-hover: hover)
    &:hover
      background ui-cl-color-eucalypt
      border-color ui-cl-color-eucalypt
      color ui-cl-color-white-theme

.plaining-list__btns
  display flex
  flex-direction column
  gap 10px
  width 100%

.plaining-list__btns.on_plaining
  flex-direction row

</style>
