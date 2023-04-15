<template>
  <HeaderApp />

  <v-main>
    <v-container>


      <div v-if="loading">
        <Preloader />
      </div>

      <div v-else>

        <v-card class="px-4 py-4 mt-3 mb-3">

          <div class="float-left">
            <v-avatar color="blue-lighten-4" size="80" class="mr-4">
              <v-img
                src="/images/account-head.png"
                alt="John"
              ></v-img>
            </v-avatar>
          </div>

          <div class="flat-right pl-4">
            <p><strong>User</strong><span v-if="thisIsMyself"> (myself)</span>:</p> 
            <p>{{ userAddress }}</p>
          </div>

        </v-card>

        <v-card class="px-4 py-4">

         <div>
            <div class="float-left">
              <UserVideoPricing
                :networkId="networkId"
                :userAddress="userAddress"
                :myAddress="myAddress"
              />
          </div>

          <div v-if="!thisIsMyself"
            class="flat-right pl-4 text-right"
          >
            <SuperfluidMoneyStreaming
              :recipientAddress="userAddress"
              superTokenName="fDAIx"
              :flowRate="10"
            />
          </div>

        </div>

        </v-card>


        <div class="mt-4">
          <h3>Videos:
            <LivepeerAssetUploader
              v-if="thisIsMyself"
              :userAddress="myAddress"
              @new-video-ready="init" 
            />

          </h3>

        <LivepeerVideoList
          class="my-4"
          type="ByOwner"
          :onlyShowReady="!thisIsMyself"
          :ownerAddress="userAddress"
          :myAddress="myAddress"
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
import UserSummary from "@/components/ui/UserSummary.vue"
export default {
  components: {
    HeaderApp,
    FooterApp,
    Preloader,
    SuperfluidMoneyStreaming,
    LivepeerAssetUploader,
    VideoPlayer,
    LivepeerVideoList,
    UserVideoPricing,
    UserSummary
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
