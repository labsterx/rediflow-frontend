<template>
  <HeaderApp />

  <v-main>
    <v-container>

      <h1>This is App Home Page</h1>

      <div class="mt-4">

        <LivepeerVideoList
          type="featured"
        />
    
      </div>

    </v-container>
  </v-main>

  <FooterApp />

</template>

<script>
import HeaderApp from "@/components/ui/HeaderApp.vue"
import FooterApp from "@/components/ui/FooterApp.vue"
import Preloader from "@/components/ui/Preloader.vue"
import LivepeerVideoList from "@/components/LivepeerVideoList.vue"
import axios from '@/axios'
import { config } from '@/config/index.js'
export default {
  components: {
    HeaderApp,
    FooterApp,
    Preloader,
    LivepeerVideoList,
},
  data: () => ({
    loading: true,
  }),
  computed: {

  },
  methods: {
    async init() {
      
      if (!window.ethereum) {
        console.log('Please install MetaMask!');
        return;
      }

      this.loading = true;

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      this.myAddress = account.toLowerCase();
      this.networkId = window.ethereum.networkVersion;

      this.loading = false;
    },


  },
  created () {
    this.init()
  },

}
</script>




