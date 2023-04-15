<template>
  <HeaderApp />

  <v-main>
    <v-container>

      <v-row no-gutters>
        <v-col>
          <v-sheet class="pa-2 ma-2">


            <div v-if="loading">
              <Preloader />
            </div>

            <div v-else>

              <div class="text-h5 font-weight-bold my-2">
                <v-chip v-if="isPaid" size="small" color="red-darken-3" class="mb-1">Paid</v-chip>
                <v-chip v-else size="small" color="green-darken-3" class="mb-1">Free</v-chip>
                {{ videoTitle }}
              </div>

              <div v-if="videoURL">

                <div v-if="thisIsMyself">
                    <VideoPlayer
                      :src="videoURL"
                      :title="videoTitle"
                      :width="videoWidth"
                      :height="videoHeight"
                      style="max-width: 100%;"
                    /> 
                </div>

                <div v-else>

                  <div v-if="isPaid">

                    <SuperfluidMoneyStreaming v-if="!thisIsMyself"
                      class="my-2"
                      ref="superfluidComponent"
                      :recipientAddress="ownerAddress"
                      :superTokenName="tokenName"
                      :pricePerHour="pricePerHour"
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
                        <v-img
                          src="/images/video-cover-paid-content.jpg"
                          :aspect-ratio="16/9"
                        ></v-img>
                    </div>

                  </div>

                  <div v-else>
                    <VideoPlayer
                      :src="videoURL"
                      :title="videoTitle"
                      :width="videoWidth"
                      :height="videoHeight"
                      style="max-width: 100%;"
                    /> 
                  </div>

                </div>

                <div class="float-left mt-3">
                  By: 
                  <UserSummary
                    class="ml-2" 
                    :address="ownerAddress"
                    :myaddress="myAddress"
                    markself
                  />
                </div>

                <div v-if="thisIsMyself" class="float-right mt-4">
                  <LivepeerVideoUpdate
                    :assetId="assetId"
                    :name="videoTitle"
                    :ownerAddress="ownerAddress"
                    :myAddress="myAddress"
                    :isPaid="isPaid"
                    :isReady="isReady"
                  />
                </div>
                
              </div>

              <div v-else>
                <div class="my-2">Video is not ready yet</div>
                <div><v-btn @click="checkUploadedAssetStatus">Check Status</v-btn></div>
              </div>

            </div>


          </v-sheet>
        </v-col>
        <v-col cols="3">
          <v-sheet class="pa-2 ma-2">
            
            <div v-if="loading">
              <Preloader />
            </div>

            <div v-lese>
              <LivepeerVideoList
                type="new"
                :myAddress="myAddress"
              />
            </div>

          </v-sheet>
        </v-col>
      </v-row>


      

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
import LivepeerVideoUpdate from "@/components/LivepeerVideoUpdate.vue"
import LivepeerVideoList from "@/components/LivepeerVideoList.vue"
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
    LivepeerVideoUpdate,
    LivepeerVideoList,
  },
  data: () => ({
    loading: true,
    ownerAddress: null,
    myAddress: null,
    networkId: null,
    videoURL: null,
    videoWidth: null,
    videoHeight: null,
    videoTitle: null,
    videoInfo: null,
    playbackInfo: null,
    isPaid: null,
    tokenName: null,
    pricePerHour: null,
    isReady: null,
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
      this.networkId = window.ethereum.networkVersion;

      await this.getAssetInfo();

      this.loading = false;
    },

    onStreamingMoneyStatusUpdate(status) {
      console.log('onStreamingMoneyStatusUpdate', status)
      this.isPaying = status;
    },

    // -----------------------------------------------------------------
    // Get Asset Info
    // -----------------------------------------------------------------
    async getAssetInfo() {

      if (!this.assetId) {
        console.log('No assetId');
        return;
      }

      const requestUrl = config.backendAPIURL + '/livepeer/asset/' + this.networkId + '/' + this.assetId;

      try {
        
        const res = await axios.get(requestUrl);
        console.log(res.data)
        this.videoInfo = res.data;
        this.videoTitle = res.data.name;
        this.ownerAddress = res.data.ownerAddress;
        this.isPaid = res.data.isPaid;
        this.isReady = res.data.isReady;

        if (res.data.isPaid) {
          if (res.data.tokenName) {
            this.tokenName = res.data.tokenName;
          }
          if (res.data.pricePerHour) {
            this.pricePerHour = res.data.pricePerHour;
          }
        }

        if (!res.data.playbackId) {
          console.log('No playbackId');
          return;
        }
        const playbackId = res.data.playbackId;
        

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
