<script>
import HeaderPublic from '@/components/ui/HeaderPublic.vue'
import FooterPublic from '@/components/ui/FooterPublic.vue'
import MetaMaskLoginForm from '@/components/ui/MetaMaskLoginForm.vue'
import { config } from '@/config/index.js'

export default {
  data() {
    return {
      config: config,
    }
  },
  components: {
    HeaderPublic,
    FooterPublic,
    MetaMaskLoginForm,
  },
  created() {
    console.log('login')
  }
}
</script>

<template>
  <HeaderPublic />

  <v-main>
    <v-container>


      <MetaMaskLoginForm class="my-4"
        :supportedNetworks="config.supportedNetworks"
        :localStorageKeyForLogin="config.localStorageKey.login"
        :backendLogInUrl="config.backendLogInURL"
        :backendLogInMessage="config.backendLogInMessage"
        :logInSuccessRedirectRoute="config.defaultRedirect.appHome"
        :logOutRedirectRoute="config.defaultRedirect.login"
      />


    </v-container>
  </v-main>

  <FooterPublic />
</template>

<style>
</style>
