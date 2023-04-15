<template>
  
  <v-row no-gutters v-if="!loading">
    <v-col
      v-for="(item, i) in videoList"
      :key="item.assetId"
      md3 sm4 xs12
    >

      <LivepeerVideoSummaryCard
        :key = "'videocard' + i"
        :assetId="item.assetId"
        :name="item.name"
        :ownerAddress="item.ownerAddress"
        :myAddress="myAddress"
        :isPaid="item.isPaid"
      >
      </LivepeerVideoSummaryCard>

    </v-col>
  </v-row>
 
</template>

<script>
import axios from '@/axios'
import { config } from '@/config/index.js'
import LivepeerVideoSummaryCard from '@/components/LivepeerVideoSummaryCard.vue'
export default {
  props: {
    type: { type: String, default: 'ByOwner'},
    onlyShowReady: { type: Boolean, default: true},
    ownerAddress: { type: String},
    myAddress: { type: String, default: ''},
  },
  data: () => ({
    loading: true,
    videoList: null,
  }),  
  components: {
    LivepeerVideoSummaryCard
  },   
  computed: {
  },  
  methods: {
    
    async init() {
      this.loading = true;
      if (this.type === 'ByOwner') {
        await this.getVideoListByOwner()
      }
      else if (this.type === 'featured') {
        await this.getFeaturedVideoList()
      }
      else if (this.type === 'new') {
        await this.getNewVideoList()
      }      
      this.loading = false
    },

    async getVideoListByOwner() {

      if (!this.ownerAddress) {
        console.log('No ownerAddress');
        return;
      }

      const requestUrl = config.backendAPIURL + '/livepeer/assets-by-owner/' + this.ownerAddress;
      this.videoList = [];
      
      try {
        
        const res = await axios.get(requestUrl);
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          if (this.onlyShowReady) {
            if (res.data[i].isReady) {
              this.videoList.push(res.data[i])
            }
          } else {
            this.videoList.push(res.data[i])
          }
        }

      } catch (error) {
        console.error('Error:', error)
      } finally {
        //
      }

    },

    async getFeaturedVideoList() {
  
      const requestUrl = config.backendAPIURL + '/livepeer/featured-videos';
      this.videoList = [];

      try {
        
        const res = await axios.get(requestUrl);
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          if (this.onlyShowReady) {
            if (res.data[i].isReady) {
              this.videoList.push(res.data[i])
            }
          } else {
            this.videoList.push(res.data[i])
          }
        }

      } catch (error) {
        console.error('Error:', error)
      } finally {
        //
      }

    },

  async getNewVideoList() {
  
    const requestUrl = config.backendAPIURL + '/livepeer/new-videos';
    this.videoList = [];

    try {
      
      const res = await axios.get(requestUrl);
      console.log(res.data)
      for (let i = 0; i < res.data.length; i++) {
        if (this.onlyShowReady) {
          if (res.data[i].isReady) {
            this.videoList.push(res.data[i])
          }
        } else {
          this.videoList.push(res.data[i])
        }
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
  }
}
</script>

<style scoped>
</style>