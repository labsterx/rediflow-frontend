<template>
<div class="text-center">

  <v-card
    class="mx-auto pa-12 pb-8"
    elevation="8"
    max-width="448"
    rounded="lg"
    :loading="loading"
  >


    <div v-if="shortUserAddress" class="text-center mb-4">
      <div class="mb-2">
        <v-avatar color="info" size="40">
          <v-icon x-large icon="mdi-account-circle"></v-icon>
        </v-avatar>
      </div>
      {{ shortUserAddress }}
    </div>

    <div v-if="isMetaMaskInstalled && isMetaMaskConnected" class="px-3 text-center">

      <NetworkSwitchBtn 
        class="mx-auto text-center"
        :supportedNetworks="supportedNetworks"
        :localStorageKeyForLogin="localStorageKeyForLogin"
        :logOutRedirectRoute="logOutRedirectRoute"
      />

    </div>

    <!-- Wallet not available -->
    <div v-if="!isMetaMaskInstalled">
    
      <div class="text-center mb-4">
        <v-icon large color="error">mdi-alert-circle-outline</v-icon>
      </div>
      <div>
        Please Install MetaMask Plugin First.
      </div>
    </div>
      

    <!-- Wallet not connected -->
    <div v-if="isMetaMaskInstalled && !isMetaMaskConnected" class="px-3 text-center">
      
      <v-btn 
        block
        class="mb-8"
        color="blue"
        size="large"
        @click="connectWallet"
        :disabled="loading"
      >
        Enable Ethereum
      </v-btn>
      <div v-show="error.connectWallet" class="login-error-section mt-2">
        {{ error.connectWallet }}
      </div>
    </div>

    <!-- Network Not Supported -->
    <div  v-if="isMetaMaskInstalled && isMetaMaskConnected && !isNetworkSupported"  class="px-3 text-center">
      <div class="text-center mb-4">
        <v-icon large color="error">mdi-alert-circle-outline</v-icon>
      </div>
      <div>
        Sorry, this network is not supported. We support the following network(s):<br />
        <v-chip v-for="(item, i) in supportedNetworkNames" :key = "i" class="mx-1 my-1">
          {{item}}
        </v-chip>
      </div>
    </div>


      <!-- Login with wallet -->
      <div v-if="isMetaMaskInstalled && isMetaMaskConnected && isNetworkSupported" class="px-3 text-center">


        <v-btn 
          block
          class="mb-8"
          color="blue"
          size="large"
          @click="logInBackend"
          :disabled="loading"
        >
          Sign In Using MetaMask
        </v-btn>

        <div v-show="error.login" class="login-error-section mt-2">
          {{ error.login }}
        </div>

      </div>

    </v-card>

</div>
</template>

<script>
import { Buffer } from 'buffer'
import axios from '@/axios'
import Preloader from "@/components/ui/Preloader.vue"
import { useShortAddress } from '@/composables/shortAddress'
import NetworkSwitchBtn from '@/components/ui/NetworkSwitchBtn.vue'
export default {
  props: {
    supportedNetworks: { type: Object, default: { 1: 'Ethereum Mainnet'} },
    localStorageKeyForLogin: { type: String, default: "userJWT" },
    backendLogInUrl: { type: String },
    backendLogInMessage: { type: String },
    logInSuccessRedirectRoute: { type: String },
    logOutRedirectRoute: { type: String },
  },  
  components: {
    Preloader,
    NetworkSwitchBtn,
  },
  data: () => ({
    loading: false,
    error: {
      connectWallet: null,
      login: null
    },
  }),
  computed: {
    currentNetworkId: function () {
      if (typeof window.ethereum !== 'undefined') {
        return ethereum.networkVersion
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
    shortUserAddress: function () {
      if (this.currentUserAddress) {
        return useShortAddress(this.currentUserAddress, 8, 8)
      }
      else {
        return null
      }
    },
    supportedNetworkNames: function () {
      return Object.values(this.supportedNetworks)
    },
    isMetaMaskInstalled: function () {
      if (typeof window.ethereum !== 'undefined') {
        return true
      }
      else {
        return false
      }
    },
    isMetaMaskConnected: function () {
      return window.ethereum && window.ethereum.selectedAddress
    },
    isNetworkSupported: function () {
      if (this.isMetaMaskConnected) {
        const networkId = parseInt(window.ethereum.networkVersion)
        console.log('networkid: ' + networkId)
        if (this.supportedNetworks[networkId]) {
          return true
        }
        else {
          return false
        }
      }
      else {
        return false
      }
    },
  },
  methods: {
    async init() {
      // console.log(window.ethereum)
      // this.initializationDone = false

      const localStoredInfo = localStorage.getItem(this.localStorageKeyForLogin)
      if (localStoredInfo) {
        // console.log(localStoredInfo)
        this.$router.push({ name: this.logInSuccessRedirectRoute })
      }
      
      console.log('currentNetworkId: ', this.currentNetworkId)
      console.log('currentUserAddress: ', this.currentUserAddress)

      // this.shortUserAddress = useShortAddress(this.currentUserAddress)
      this.setupMetaMaskListner()
      // if (this.isMetaMaskInstalled && this.isNetworkSupported) {
      //   await this.loadNetwork(true)
      // }
      // this.initializationDone = true
    },

    setupMetaMaskListner () {
      console.log('setupMetaMaskListner')
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false
        const that = this
        // window.ethereum.on('networkChanged', function (chainId) {
        //   console.log('Chain change detected.')
        //   that.init()
        // })
        window.ethereum.on('chainChanged', function (chainId) {
          console.log('Chain change detected.')
          window.location.reload()
          // that.logout()
        })
        window.ethereum.on('chainIdChanged', function (chainId) {
          console.log('Chain change detected.')
          window.location.reload()
          // that.logout()
        })
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log('account change detected.')
          // console.log(accounts)
          localStorage.removeItem(this.localStorageKeyForLogin)
          window.location.reload()
          // that.logout()
        })
      }
    },



    async connectWallet() {
      try {
        this.loading = true
        this.error.connectWallet = null
        // await window.ethereum.enable()
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]
        console.log('account: ', account)
        // if (this.isMetaMaskInstalled & this.isNetworkSupported) {
        //   await this.loadNetwork()
        // }
        // console.log(this.network)
        // console.log('defaultAccount', defaultAccount)
        this.setupMetaMaskListner()
        this.loading = false
      } catch (error) {
        console.error(error)
        this.error.connectWallet = "Wallect Connection Error"
        this.loading = false
      }
    },

    async logInBackend () {

      console.log('loginBackend')
      this.loading = true
      this.error.login = null

      localStorage.removeItem(this.localStorageKeyForLogin)

      // // await this.loadNetwork()
      // // console.log(this.network)

      // // console.log(config)
      const url = this.backendLogInUrl
      const siginInMessage = this.backendLogInMessage
      // console.log('siginInMessage: ', siginInMessage)
      const myAddress = this.currentUserAddress
      // console.log('myAddress', myAddress)
      // console.log('ethereum Address', window.web3.eth.defaultAccount )
      const networkId = this.currentNetworkId

      // Use wallet to get the signature
      let sign = null
      try {
        const from = myAddress
        window.Buffer = Buffer
        const msg = `0x${window.Buffer.from(siginInMessage, 'utf8').toString('hex')}`;
        sign = await window.ethereum.request({
          method: 'personal_sign',
          params: [msg, from, 'Please Sign In'],
        });
        // console.log(sign)
      } catch (err) {
        console.log(err)
        if (err.code && err.code === 4001) {
          this.error.login = "Access Denied"
        }
        else {
          this.error.login = "Login Error"
        }
        this.loading = false
        return
      }

      // Log in backend
      const loginData = {
        user: myAddress,
        sig: sign,
        networkid: networkId
      }

      try {
        const res = await axios.post(url, loginData)
        console.log(res)
        const jwtToken = res.data.token
        // console.log(jwtToken)
        localStorage.setItem(this.localStorageKeyForLogin, jwtToken)

        if (this.$route.query && this.$route.query.redirect &&
          !this.$route.query.redirect.toLowerCase().includes('logout') &&
          !this.$route.query.redirect.toLowerCase().includes('login')) {
          const redirectPath = this.$route.query.redirect
          console.log('redirect: ' + redirectPath)
          this.$router.push({ path: redirectPath})
        }
        else {
          this.$router.push({ name: this.logInSuccessRedirectRoute })
        }
      } catch (err) {
        console.log(err)
        this.error.login = "login Error"
        return
      } finally {
        this.loading = false
      }
    },

    logout () {
      // this.$store.state.myAddress = null
      console.log('logout')
      console.log('localstorage key: ', this.localStorageKeyForLogin)
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
.login-error-section {
  background-color: #FFCCBC;
  padding: 10px;
  font-size: 0.8rem;
  line-height: 1.2rem;
}
</style>
