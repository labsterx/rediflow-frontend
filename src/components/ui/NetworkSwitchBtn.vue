<template>

    <v-select
      class="mt-5 text-right rounded-tr rounded-tl"
      prepend-inner-icon="mdi-network-outline"
      v-model="selectedNetwork"
      variant="outlined"
      :items="supportedNetworkList"
      item-title="name"
      item-value="id"
      @update:modelValue="requestNetworkChange"
      label=""
      bg-color="green-lighten-4"
      density="compact"
      solo
      return-object
    ></v-select>

</template>

<script>
import * as Web3 from 'web3'
export default {
  props: {
    supportedNetworks: { type: Object, default: { 1: 'Ethereum Mainnet'} },
    localStorageKeyForLogin: { type: String, default: "userJWT" },
    logOutRedirectRoute: { type: String },    
  },  
  data: () => ({
    selectedNetwork: null,
  }),
  components: {
    Web3,
  },  
  computed: {
    supportedNetworkList: function () {
      const list = []
      for (const networkId in this.supportedNetworks) {
        const name  = this.supportedNetworks[networkId]
        const opt = { id: networkId, name: name }
        list.push(opt)
      }
      return list
    },
    currentNetworkId: function () {
      if (typeof window.ethereum !== 'undefined') {
        return window.ethereum.networkVersion
      }
      else {
        return null
      }
    },
    currentUserAddress: function () {
      if (typeof window.ethereum !== 'undefined') {
        return ethereum.selectedAddress
      }
      else {
        return null
      }
    },
  },  
  methods: {
    async init() {
      console.log('networkswitch init')
      await new Promise(r => setTimeout(r, 500))
      if (!window.ethereum) {
        return
      }

      // console.log(this.supportedNetworkList)
      console.log('networkid:', this.currentNetworkId)

      const localSavedJwtToken = localStorage.getItem(this.localStorageKeyForLogin)
      if (!localSavedJwtToken) {
        this.$router.push({ name: this.logOutRedirectRoute })
      }

      this.setupMetaMaskListner()

      if (!this.selectedNetwork || this.selectedNetwork.id != this.currentNetworkId) {
        for (const networkId in this.supportedNetworks) {
          if (networkId == this.currentNetworkId) {
            this.selectedNetwork = this.supportedNetworks[networkId]
            break
          }
        }
      }


    },

    async requestNetworkChange () {
      console.log('requestNetworkChange')

      if (this.selectedNetwork) {
        if (this.currentNetworkId !== this.selectedNetwork.id) {

          window.web3 = new Web3(window.ethereum)
          const chainIdHex = web3.utils.numberToHex(this.selectedNetwork.id)
          console.log('ChainIdHex: ', chainIdHex)
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainIdHex }],
            });
            // this.loadNetwork(true)
          } catch (switchError) {
            this.init()
          // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              // Do something
            }
          }
        }
      }
    },

    setupMetaMaskListner () {
      console.log('setupMetaMaskListner')
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false
        const that = this
        window.ethereum.on('chainChanged', function (chainId) {
          console.log('Chain change detected.')
          // window.location.reload()
          // that.$router.push({ name: this.logOutRedirectRoute })
          that.logout()
        })
        window.ethereum.on('chainIdChanged', function (chainId) {
          console.log('Chain change detected.')
          // window.location.reload()
          that.logout()
        })
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log('account change detected.')
          // console.log(accounts)
          // localStorage.removeItem(this.localStorageKeyForLogin)
          // window.location.reload()
          that.logout()
        })
      }
    },

    logout () {
      // this.$store.state.myAddress = null
      console.log('logout')
      // console.log('localstorage key: ', this.localStorageKeyForLogin)
      localStorage.removeItem(this.localStorageKeyForLogin)
      console.log("redirect to: ", this.logOutRedirectRoute)
      this.$router.push({ name: this.logOutRedirectRoute })
    },



  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
</style>
