<style lang="sass">
#app {
  position: relative;
  height: 100%;
  font-size: 0.24rem;
  overflow: hidden;
}
</style>

<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hello: 'Hello World'
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
