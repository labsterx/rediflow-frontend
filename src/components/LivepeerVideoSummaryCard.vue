<template>
  
  <div class="py-1 px-2">

    <v-card
      class="video-summary-card mx-auto my-2"
      :to="{ name: 'Video', params: { assetId: assetId } }"
    >

        <v-img
          :src="thumbnailURL"
          :aspect-ratio="16/9"
        ></v-img>

        <v-card-title>
          <v-avatar>
            <v-img v-if="isPaid"
              src="/images/icon-paid.png"
              class="free-paid-icon"
            ></v-img>
            <v-img v-else
              src="/images/icon-free.png"
              class="free-paid-icon"
            ></v-img>            
          </v-avatar>
          {{ name }}
        </v-card-title>

    </v-card>

  </div>
 
</template>

<script>
import axios from '@/axios'
import { config } from '@/config/index.js'
export default {
  props: {
    assetId: { type: String, required: true },
    name: { type: String },
    thumbnailURL: { type: String, default: '/images/video-thumbnail-default.jpg'},
    ownerAddress: { type: String},
    isPaid: { type: Boolean, default: false},
  },
  data: () => ({
  }),  
  components: {
  },   
  computed: {
  },  
  methods: {
    
    async init() {
    },

  },
  created () {
    // this.init()
  }
}
</script>

<style scoped>
.video-summary-card {
  max-width: 255px;
  min-width: 255px;
}
.free-paid-icon {
  width: 26px;
  height: 26px;
}
</style>  