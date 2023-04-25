<template>
  <div class="news-add-form">
    <div class="news-add__actions-buttons">
      <button class="close_modal bold" @click.prevent="closeAddForm">x</button>
    </div>

    <form class="news-add__main" action="#">
      <div class="news-add__text">
        <textarea
          class="news-add__text-title"
          placeholder="Дайте тему"
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
        <h4 class="news-add__settings-title">Настройка публикации</h4>

        <add-tags :tags="tags" @change-tags="onChangeTags" />

        <div class="is_planing" v-if="isPlaning">
          <h6>Запланированное время</h6>

          <p>{{ day }} {{ monthNames[month] }} {{ year }} г. в {{ dateTime }}</p>
        </div>

        <div class="plaining-list__btns">
          <button v-if="!edit || deffered" class="post-btn-planing plaining-hole" @click.prevent="openModal">Запланировать</button>
          <button class="post-btn-planing" @click.prevent="submitForm">Опубликовать</button>
        </div>
      </div>
    </form>

    <modal class="news-add__modal" v-model="modalShow">
      <div class="news-add__modal-selects deferred-post">
        <div class="alert-deferred-post">
          <span>Публикация будет опубликована:</span>
          <span>{{ day || '01' }} {{ monthNames[month] || 'январь' }} {{ year || '1970' }} г. в {{ dateTime || '00:00' }}</span>
        </div>
        <div class="data-pickers-list">
          <date-picker
            v-model="date"
            type="date"
            placeholder="Выберите дату"
          >
          </date-picker>
          <date-picker
            v-model="dateTime"
            :hour-options="hours"
            format="HH:mm"
            value-type="format"
            type="time"
            placeholder="Выберите время"
          >
          </date-picker>
        </div>
      </div>

      <template slot="actions">
        <div class="plaining-list__btns on_plaining">
          <button class="post-btn-planing" @click.prevent="onPlaning">Планировать</button>
          <button class="post-btn-planing plaining-hole" @click.prevent="onCancelPlaning">Отмена</button>
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
      reader.onload = (e) => {
        this.editor.commands.setImage({ src: e.target.result });
      };
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
<style lang="stylus" media="screen">
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
  font-size 13px
  background #fafafa
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
  font-size 16px
  background #f6f6f6
  border-radius 5px
  border 1px solid #d9d9d9
  span:nth-child(1)
    font-weight bold


.news-add__text-title
  border-bottom: 1px solid #e6e6e6
  padding-bottom 20px

.post-btn-planing
  display block
  text-align center
  color #fff
  width 100%
  padding 10px 5px
  border 2px solid #21a45d
  transition all 0.2s ease-in-out
  background #21a45d
  @media (any-hover: hover)
    &:hover
      background #333
      border-color #333
      color #fff

.post-btn-planing.plaining-hole
  background transparent
  color #21a45d
  @media (any-hover: hover)
    &:hover
      background #21a45d
      border-color #21a45d
      color #fff

.plaining-list__btns
  display flex
  flex-direction column
  gap 10px
  width 100%

.plaining-list__btns.on_plaining
  flex-direction row

</style>
