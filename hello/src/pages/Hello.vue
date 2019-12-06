<style lang="sass">
#app {
  position: relative;
  height: 100%;
  font-size: 0.24rem;
  overflow: hidden;

  button {
    background: #0DAF52;
    color: #fff;
  }
}
</style>

<template>
  <div id="app">
    Hello World: {{hello}}

    <button @click="$router.push('/hello/index')">跳转页面1</button>
    <button @click="$router.push('/hello/newreq')">跳转页面2</button>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
let {Vue, Vuex, store, router, global} = bapp;
let {mapState, mapActions} = Vuex;
let { $_platform, $_company_id } = global;

export default {
  data() {
    return {
      hello: 'Hello World',
      $_platform
    }
  },
  computed: {

  },
  methods: {

  },
  created() {

  },
  components: {

  }
}
</script>
