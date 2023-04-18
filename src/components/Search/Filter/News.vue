<template>
  <div>
    <div class="search-filter">
      <div class="search-filter__block">
        <label class="search__label" for="search-news-author">Автор:</label>
        <input class="search__input search-news-author" type="text" placeholder="Введите автора" id="search-news-author" v-model="author" />
      </div>
      <div class="search-filter__block time">
        <label class="search__label">Время публикации:</label>
        <select class="select search-filter__select" v-model="dateFrom">
          <option value="null">За все время</option>
          <option value="year">За последний год</option>
          <option value="month">За последний месяц</option>
          <option value="week">За последнюю неделю</option>
        </select>
      </div>
      <div class="search-filter__block tags">
        <add-tags :placeholder="`Введите для поиска`" :allowManualAddition="false" :tags="updateTags" @change-tags="onChangeTags" />
      </div>
    </div>
    <div class="search-filter__block btn-news">
      <button-hover @click.native="onSearchNews">Применить</button-hover>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import AddTags from '@/components/News/AddTags';

export default {
  name: 'SearchFilterNews',
  components: { AddTags },

  data: () => ({
    updateTags: [],
    dateFrom: 'null',
    dateTo: 0,
    page: 1,
    itemPerPage: 5,
    author: '',
  }),

  computed: {
    ...mapGetters('global/search', ['getNewsQueryParams', 'searchText']),
  },

  // watch: {
  //   '$route.query.tags': {
  //     immediate: true,
  //     handler(value) {
  //       if (value) {
  //         this.updateTags = value.split(',');
  //       }
  //     },
  //   },
  // },


  methods: {
    ...mapActions('global/search', ['searchNews']),

    onChangeTags(tags) {
      this.updateTags = tags;
      const dataTagsSplit = tags.map(tag => tag.name);
      this.$router.replace({
        query: {
          ...this.$route.query,
          tags: dataTagsSplit.join(','),
        },
      });
    },

    onSearchNews() {
      const dataTags = this.updateTags;
      const dataTagsSplit = dataTags.map(tag => tag.name);
      const dateFrom = this.dateFrom === 'null' ? 0 : moment().subtract(1, this.dateFrom).valueOf();
      const dateTo = this.dateTo = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      const formattedDateFrom = moment(dateFrom).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      let searchQuery = Object.assign({}, this.getNewsQueryParams, {
        dateFrom: formattedDateFrom,
        dateTo: dateTo,
        author: this.author,
        tags: dataTagsSplit.join(','),
        text: this.searchText,
        withFriends: true,
      });
      console.log(formattedDateFrom);
      console.log(dateTo);
      this.searchNews(searchQuery);
    },
  },
};
</script>

<style lang="stylus">
  .search-news-author
    width 200px
  .search-filter__block .add-tags__search-results
    top 100%
    border-radius 5px
    max-width 200px

</style>
