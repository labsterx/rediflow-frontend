<template>
<span>
  <v-chip 
    class="my-1"
    size="small"
    v-if="!isNullAddress" 
    :id="'user-summary-' + address"
    :to="{ name: 'User', params: { userAddress: address } }"
  >
    <v-icon left color="success">mdi-account</v-icon>
    <span v-if="isMyself && markself">
      <span v-for="digit in frontdigits">&nbsp;</span>
      <span>Myself</span>
      <span v-for="digit in enddigits">&nbsp;</span>
    </span>
    <span v-else>
      <span v-if="fulladdress">{{ address }}</span>
      <span v-else>{{ shortAddress }}</span>
    </span>
  </v-chip>
  <v-chip v-if="isNullAddress">
    <v-icon left color="success">mdi-account-outline</v-icon>
    <span>NULL</span>
  </v-chip>
</span>
</template>

<script>

export default {
  props: {
    address: { type: String },
    myaddress: { type: String, default: '' },
    fulladdress: { type: Boolean, default: false },
    markself: { type: Boolean, default: false },
    frontdigits: { type: Number, default: 4 },
    enddigits: { type: Number, default: 4 },
    variant: { type: String, default: 'default' },
  },
  data () {
    return {}
  },
  computed: {
    shortAddress: function () {
      const frontToKeep = parseInt(this.frontdigits)
      const endToKeep = parseInt(this.enddigits)
      const endIndexStart = this.address.length - endToKeep
      return this.address.substring(0, frontToKeep) + '...' + this.address.substring(endIndexStart)
    },
    isMyself: function() {
      return (this.myaddress && this.myaddress.toLowerCase() == this.address.toLowerCase())
    },
    isNullAddress: function () {
      if (!this.address) {
        return true
      }
      else if (this.address.toLowerCase() == '0x0000000000000000000000000000000000000000') {
        return true
      }
      else {
        return false
      }
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
