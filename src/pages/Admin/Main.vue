<!-- eslint-disable vue/html-indent -->
<template>
  <div class="admin__pages">
    <h1 class="admin__title">{{ activeComponent.text }}</h1>
    <div class="admin__pages-container">
      <component :is="activeComponent.component" />
      <admin-side-bar v-model="activeComponent.component" @change-component="onChange" />
    </div>
  </div>
</template>

<script>
import AdminSideBar from '../Admin/SidebarStatistics.vue';
import AdminStatistics from '../Admin/Statistics.vue';
import AdminPosts from '../Admin/Posts.vue';
import AdminLikes from '../Admin/Likes.vue';
import AdminComments from '../Admin/Comments.vue';
import AdminUsers from '../Admin/Users.vue';

export default {
  name: 'AdminPanel',
  components: {
    AdminSideBar,
    AdminStatistics,
    AdminPosts,
    AdminLikes,
    AdminComments,
    AdminUsers
  },
  data: () => ({
    activeComponent: { component: 'admin-statistics', text: 'Общая' },
    info: null
  }),

  methods: {
    onChange(item) {
      this.activeComponent = item;
    },
  },
}
</script>

<style lang="stylus">
.panel
  box-shadow 0px 2px 8px rgba(0, 0, 0, 0.08)
  border-radius 10px
  overflow hidden
  background #FFFFFF
.panel__title
  font-family 'Exo 2'
  font-style normal
  font-weight 200
  font-size 30px
  line-height 24px
  margin-bottom 30px

.panel-publications
  padding 30px 40px

.panel-dynamics__title
  display block
  font-family 'Exo', Arial, sans-serif
  font-weight 700
  font-size 20px
  line-height 30px
  color #575757

.panel-publications__top
  display flex
  align-items center
  max-height 130px
  min-height 130px
  justify-content space-between
  padding 30px
  background #21A45D

.panel__graphics
  padding 30px
  &-circle
    display grid
    padding 30px
    grid-template-columns repeat(2, 1fr)
    gap 40px
    &-left
      height 315px
      width 100%

.first__circle
  border-right 2px dashed #ebebeb

.first__graph
  border-bottom 2px dashed #ebebeb

.panel-dynamics__graph
  height 300px

.panel-publications__info
  color #fff
  font-weight 600
  span:nth-child(1)
    font-size 20px
    line-height 30px
    margin-right 10px
  span:nth-child(2)
    font-size 39px
    line-height 58px
.main-layout__header.admin
  .main-layout__user-name
    color #333
  .main-layout__user-post
    color green
.admin
  &__pages
    padding 40px
    &-container
      display grid
      grid-template-columns 1000px 1fr
      align-items flex-start
      gap 40px
    &-list
      display grid
      grid-template-columns repeat(2, 1fr)
      gap 17px
    &-item
      display flex
      align-items center
      background #fff
      min-height 145px
      max-height 145px
      border-radius 10px
      overflow hidden
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08)
    &-img
      display flex
      flex-direction column
      justify-content center
      align-items center
      background #21A45D
      height 100%
      width 148px
    &-info
      display flex
      flex-direction column
      padding 23px
      font-family 'Open Sans'
    &-title
      font-style normal
      font-weight 300
      font-size 18px
      line-height 30px
    &-statistic
      font-weight 600
      font-size 40px
      line-height 48px
</style>
