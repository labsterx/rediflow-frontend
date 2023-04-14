<template>
  <div></div>
</template>

<script>
import { config } from '@/config'
export default {
  data () {
    return {
    }
  },
  methods: {
    init () {
      // this.$store.state.myAddress = null
      localStorage.removeItem(config.localStorageKey.login)
      this.$router.push({ name: config.defaultRedirect.publicHome })
    }
  },
  created () {
    this.init()
  }
}
</script>