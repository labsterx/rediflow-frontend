<template>
  <HeaderApp />

  <v-main>
    <v-container>

      <div v-if="loading">
        <Preloader />
      </div>

      <div v-else>

        <div class="my-2">
          {{ videoTitle }}
          <UserSummary
            class="ml-2" 
            :address="ownerAddress"
          />
        </div>

        <div v-if="videoURL">

          <div v-if="isPaidAsset">

            <SuperfluidMoneyStreaming
              v-if="!thisIsMyself"
              ref="superfluidComponent"
              :recipientAddress="ownerAddress"
              superTokenName="fUSDCx"
              :flowRate="10"
              :keepCheckingStatus="false"
              :statusCheckingInterval="60000"
              @streaming-money-status-update="onStreamingMoneyStatusUpdate"
            />

            <div v-if="isPaying || thisIsMyself">
              <VideoPlayer
                :src="videoURL"
                :title="videoTitle"
                :width="videoWidth"
                :height="videoHeight"
                style="max-width: 100%;"
              />              
            </div>

            <div v-else>
              <v-card class="mx-3 my-3 px-3 py-3">
                <v-img
                  src="/images/video-cover-paid-content.jpg"
                  :aspect-ratio="16/9"
                ></v-img>
              </v-card>
            </div>

          </div>

        </div>

        <div v-else>
          <div class="my-2">Video is not ready yet</div>
          <div><v-btn @click="checkUploadedAssetStatus">Check Status</v-btn></div>
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
import VideoPlayer from "@/components/VideoPlayer.vue"
import UserSummary from "@/components/ui/UserSummary.vue"
import SuperfluidMoneyStreaming from "@/components/SuperfluidMoneyStreaming.vue"
import axios from '@/axios'
import { config } from '@/config/index.js'
export default {
  components: {
    HeaderApp,
    FooterApp,
    Preloader,
    VideoPlayer,
    UserSummary,
    SuperfluidMoneyStreaming,
  },
  data: () => ({
    loading: true,
    ownerAddress: null,
    myAddress: null,
    videoURL: null,
    videoWidth: null,
    videoHeight: null,
    videoTitle: null,
    videoInfo: null,
    playbackInfo: null,
    isPaidAsset: false,
    isPaying: false,
  }),
  computed: {
    assetId() {
      return this.$route.params.assetId
    },
    thisIsMyself() {
      return this.myAddress === this.ownerAddress
    },
  },
  methods: {
    async init() {

      if (!window.ethereum) {
        console.log('Please install MetaMask!');
        return;
      }

      console.log('init')
      this.loading = true;

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      this.myAddress = account.toLowerCase();

      await this.getAssetInfo();

      this.loading = false;
    },

    onStreamingMoneyStatusUpdate(status) {
      console.log('onStreamingMoneyStatusUpdate', status)
      this.isPaying = status;
    },

    async getAssetInfo() {

      if (!this.assetId) {
        console.log('No assetId');
        return;
      }

      const requestUrl = config.backendAPIURL + '/livepeer/asset/' + this.assetId;

      try {
        
        const res = await axios.get(requestUrl);
        console.log(res.data)
        this.videoInfo = res.data;
        this.videoTitle = res.data.name;
        this.ownerAddress = res.data.ownerAddress;

        if (!res.data.playbackId) {
          console.log('No playbackId');
          return;
        }
        const playbackId = res.data.playbackId;
        this.isPaidAsset = true;  // HACK!

        const url1 = 'https://livepeer.studio/api/playback/' + playbackId;
        const res1 = await axios.get(url1);
        console.log(res1.data)
        this.playbackInfo = res1.data.meta;
        this.videoURL = res1.data.meta.source[0].url

        const localSavedJwtToken = localStorage.getItem(config.localStorageKey.login)
        if (localSavedJwtToken) {
          this.videoURL = this.videoURL + '?accessKey=' + localSavedJwtToken;
        }
        console.log("videoURL: ", this.videoURL);

        this.videoWidth = res1.data.meta.source[0].width
        this.videoHeight = res1.data.meta.source[0].height

      } catch (error) {
        console.error('Error:', error)
      } finally {
        //
      }

    },

    // ------------------------------------------------------
    // Check Uploaded Asset Status
    // ------------------------------------------------------    
    async checkUploadedAssetStatus() {

      if (!this.assetId) {
        console.log('No assetId');
        return;
      }

      const requestUrl = config.backendAPIURL + '/livepeer/check-asset-status/' + this.assetId;

      try {
        
        const res = await axios.get(requestUrl);
        console.log(res.data)
        if (res.data.playbackId) {
          this.init();
        }

      } catch (error) {
        console.error('Error:', error)
      } finally {
        //
      }

      },      

  },
  created () {
    this.init()
  },

}
</script>
