<template>
  <HeaderApp />

  <v-main>
    <v-container>

      <h1>This is User Page</h1>

      <div v-if="loading">
        <Preloader />
      </div>

      <div v-else>

        <div class="mt-4">
          User Address: {{ userAddress }}
          <span v-if="thisIsMyself"> (myself)</span>
        </div>

        <UserVideoPricing
          :networkId="networkId"
          :userAddress="userAddress"
          :myAddress="myAddress"
        />

        <SuperfluidMoneyStreaming
          v-if="!thisIsMyself"
          :recipientAddress="userAddress"
          superTokenName="fDAIx"
          :flowRate="10"
        />

        <div class="mt-4">
          <h2>Videos</h2>
        <LivepeerVideoList
          type="ByOwner"
          :onlyShowReady="!thisIsMyself"
          :ownerAddress="userAddress" 
        />
        </div>

        <div v-if="thisIsMyself">
          <LivepeerAssetUploader
            :userAddress="myAddress"
            @new-video-ready="init" 
          />
        </div>

      </div>



    </v-container>
  </v-main>

  <FooterApp />

</template>


<script>
import HeaderApp from "@/components/ui/HeaderApp.vue"
import FooterApp from "@/components/ui/FooterApp.vue"
import Preloader from "@/components/ui/Preloader.vue"
import SuperfluidMoneyStreaming from "@/components/SuperfluidMoneyStreaming.vue"
import LivepeerAssetUploader from "@/components/LivepeerAssetUploader.vue"
import VideoPlayer from "@/components/VideoPlayer.vue"
import LivepeerVideoList from "@/components/LivepeerVideoList.vue"
import UserVideoPricing from "@/components/UserVideoPricing.vue"
export default {
  components: {
    HeaderApp,
    FooterApp,
    Preloader,
    SuperfluidMoneyStreaming,
    LivepeerAssetUploader,
    VideoPlayer,
    LivepeerVideoList,
    UserVideoPricing
},
  data: () => ({
    loading: true,
    userAddress: null,
    myAddress: null,
    networkId: null,
    thisIsMyself: false,
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

      if ('userAddress' in this.$route.params) {
        this.userAddress = this.$route.params.userAddress
        if (this.userAddress.toLowerCase() == this.myAddress.toLowerCase()) {
          this.thisIsMyself = true
        }
        else {
          this.thisIsMyself = false
        }
      }
      else {
        this.userAddress = this.myAddress.toLowerCase()
        this.thisIsMyself = true
      }

      this.loading = false;
    },


  },
  created () {
    this.init()
  },

}
</script>
