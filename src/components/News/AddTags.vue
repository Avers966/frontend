<template>
  <div class="add-tags">
    <input
      class="add-tags__input"
      type="text"
      placeholder="Начните вводить..."
      v-model="tag"
      @input="searchTags"
      @change="addTag"
      v-touppercase="10"
    />

    <div class="add-tags__block">
      <div class="add-tags__item" v-for="(tag, index) in updateTags" :key="index">
        #{{ tag.name }}
        <span class="add-tags__delete" @click="deleteTag(index)"> &#10005; </span>
      </div>
    </div>
    <transition name="fade">
      <div class="add-tags__search-results fade-in" v-if="searchResults.length > 0 || tag.length === 0">
        <div class="add-tags__search-item" v-for="(result, index) in searchResults" :key="index" @click="addTagFromSearch(result)">
          #{{ result.name }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';

Vue.directive( 'touppercase', {
  update (el, binding) {
    const sourceValue = el.value;
	  const maxLength = parseInt(binding.value);
	  el.maxLength = maxLength;

    const newValue = sourceValue
    .toLowerCase() // все вводимые знаки с маленькой буквы.
		.replace(/ /g, '_') // заменяем пробелы на нижние подчёркивания. Подмена автоматический.
    .replace(/[^a-zA-Zа-яА-ЯёЁ0-9_]/g, '') // убираем знаки препиния, кирилица/латиница/0-9 - разрешены.
		.substring(0, maxLength); // ограничиваем колличество вводимых знаков, дублируя ограничение атрибутом.

    if (sourceValue !== newValue) {
      el.value = newValue;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
})

export default {
  name: 'AddTags',

  props: {
    tags: Array,
  },

  data: () => ({
    tagsList: [],
    tag: '',
    searchResults: [],
  }),

  computed: {
    updateTags() {
      return this.tags;
    },
  },

  mounted() {
    setTimeout(() => {
      this.tagsList = this.tags;
    }, 200)
  },

  methods: {
    deleteTag(index) {
      this.tagsList = this.tags.filter((tag) => tag !== this.tags[index]);
      this.$emit('change-tags', this.tagsList);
    },

    searchTagsApi(tag) {
      axios.get(`/tag?name=${tag}`)
        .then(response => {
          this.searchResults = response.data.slice(0, 5);
        })
        .catch(error => console.error(error));
    },

    searchTags: debounce(function() {
      if (this.tag.length < 2) {
        this.searchResults = [];
        return;
      }
      this.searchTagsApi(this.tag);
    }, 1000),

    addTagFromSearch(tag) {
      if (this.tagsList.find((t) => t.name === tag.name)) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'response',
          text: 'Такой тег уже есть',
        });
        return;
      }
      if (this.tagsList.length > 10) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'response',
          text: 'Можно добавить максимум 10 тэгов',
        });
        console.log('Я сработал в методе addTagFromSearch')
        return;
      }
      this.tagsList.push(tag);
      this.tag = '';
      this.searchResults = [];
      this.$emit('change-tags', this.tagsList);
    },

    addTag() {
      if (this.tag.length <= 0) return;
      const existingTag = this.tags.find((tag) => tag.name === this.tag);
      if (existingTag) {
        this.addTagFromSearch(existingTag);
        return;
      }

      const newTag = {
        name: this.tag,
      };

      if (this.tagsList.some((tag) => tag.name === newTag.name)) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'response',
          text: 'Тэг уже добавлен',
        });
        return;
      }

      if (this.tagsList.length >= 10) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'response',
          text: 'Можно добавить максимум 10 тэгов',
        });
        console.log('Я сработал в методе addTag')
        return;
      }

      this.tagsList.push(newTag);
      this.tag = '';
      this.$emit('change-tags', this.tagsList);
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'
.add-tags
  position relative

.add-tags__search-results
  position: absolute
  top 24px
  left 0
  background-color #fbfbfb
  border-radius: 0 0 5px 5px;
  width 86%
  max-height 250px
  overflow-y auto
  box-shadow 0px 4px 4px rgba(0, 0, 0, 0.15)
  transition all .2s ease-in-out

.add-tags__search-item
  font-family "Roboto"
  padding 10px
  cursor pointer
  font-size 13px
  transition background-color .2s ease-in-out
  @media (any-hover: hover)
    &:hover
      background-color #ededed

.add-tags__input
  border-bottom 1px solid rgba(0, 0, 0, 0.12)
  padding-bottom 5px
  font-size 13px
  color steel-gray
  margin-bottom 15px

  &::placeholder
    color #B0B0BC

.add-tags__block
  margin 0 -4px 10px
  min-height 32px

.add-tags__item
  display inline-block
  align-items center
  color eucalypt
  font-size 13px
  background-color #F5F7FB
  padding 5px
  margin 0 5px 10px
  border-radius 5px

.add-tags__delete
  margin-left 5px
  color #B0B0BC
  font-size 10px
  font-weight 600
  cursor pointer

.fade-enter-active, .fade-leave-active
  transition opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0


</style>
