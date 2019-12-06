<style lang="sass" scoped>
button {
  background: #f00;
  color: #fff;
}
</style>

<template>
<div class="container">
  主项目首页：{{ mainTest }}
  <button @click="$router.push('/hello/index')">跳转hello业务线页面</button>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'mainIndex',
  data() {
    return {

    }
  },
  computed: {
    ...mapState('main', {
      mainTest: state => state.mainTest
    }),
  }
};
</script>
