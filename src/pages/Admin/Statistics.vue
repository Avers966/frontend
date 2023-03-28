<!-- eslint-disable vue/html-indent -->
<template>
  <ul class="admin__pages-list">
    <li class="admin__pages-item">
      <div class="admin__pages-img">
        <img src="../../../public/static/img/admin/admin_1.png" alt="Пользователи">
      </div>
      <div class="admin__pages-info">
        <h4 class="admin__pages-title">Пользователей зарегестрировано</h4>
          <span class="admin__pages-statistic">357</span>
      </div>
    </li>
    <li class="admin__pages-item">
      <div class="admin__pages-img">
        <img src="../../../public/static/img/admin/admin_3.png" alt="Публикации">
      </div>
      <div class="admin__pages-info">
        <h4 class="admin__pages-title">Публикаций создано</h4>
        <span class="admin__pages-statistic">115 000 002</span>
      </div>
    </li>
    <li class="admin__pages-item">
      <div class="admin__pages-img">
        <img src="../../../public/static/img/admin/admin_2.png" alt="Комментарии">
      </div>
      <div class="admin__pages-info">
        <h4 class="admin__pages-title">Комментариев оставлено</h4>
        <span class="admin__pages-statistic">99 021</span>
      </div>
    </li>
    <li class="admin__pages-item">
      <div class="admin__pages-img">
        <img src="../../../public/static/img/admin/admin_4.png" alt="Лайки">
      </div>
      <div class="admin__pages-info">
        <h4 class="admin__pages-title">Лайков поставлено</h4>
        <span class="admin__pages-statistic">234 110</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'AdminStatistics',
};
</script>
