<style lang="sass" scoped>

</style>

<template>
<div class="container">
  列表页面
  <header>全局store: {{timeNow}}, 专属store: {{testName}}</header>
</div>
</template>

<script>
let { Vuex, global } = bapp;
let { $_width } = global;
let { mapState: gmapState, mapActions: gmapActions, createNamespacedHelpers } = Vuex;
const { mapState, mapActions } = createNamespacedHelpers(`${APP_NAME}/feedback`)
export default {
  name: 'helloList',
  data() {
    return {

    }
  },
  computed: {
    ...gmapState('cms', {
      timeNow: state => {
        return state.timeNow;
      }
    }),
    ...mapState({
      testName: state => {
        return state.name;
      }
    })
  },
  methods: {
    ...mapActions(['getNewGoodReqList']),
  }
};
</script>
