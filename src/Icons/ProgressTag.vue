<template>
  <icon-box width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M18 20V4M6 20V16M12 20V10" :stroke="strokeColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </icon-box>
</template>

<script>
import IconBox from './IconBox.vue';

export default {
  components: { IconBox },
  props: {
    strokeColor: {
      type: String,
      default: '#7ACD78',
    },
  },
};
</script>
