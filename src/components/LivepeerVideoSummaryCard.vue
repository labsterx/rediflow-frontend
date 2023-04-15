<template>
  
  <div class="py-1 px-2">

    <v-card
      class="video-summary-card mx-auto my-2"
      :to="{ name: 'Video', params: { assetId: assetId } }"
    >

        <v-img
          :src="thumbnailURL"
          class="align-end text-white"
          :aspect-ratio="16/9"
          cover
        >
          <v-card-title>{{ name }}</v-card-title>
        </v-img>


        <div class="py-2">
          <v-avatar class="float-left">
            <v-img v-if="isPaid"
              src="/images/icon-paid.png"
              class="free-paid-icon mr-n3"
            ></v-img>
            <v-img v-else
              src="/images/icon-free.png"
              class="free-paid-icon mr-n3"
            ></v-img>            
          </v-avatar>
          <v-chip v-if="isPaid" variant="text" class="my-1">Paid</v-chip>
          <v-chip v-else variant="text" class="my-1">Free</v-chip>
          <UserSummary  class="float-right mr-3 my-1"
            :address="ownerAddress"
            :myaddress="myAddress"
            markself
          />
        </div>

    </v-card>

  </div>
 
</template>

<script>
import axios from '@/axios'
import { config } from '@/config/index.js'
import UserSummary from "@/components/ui/UserSummary.vue"
export default {
  props: {
    assetId: { type: String, required: true },
    name: { type: String },
    thumbnailURL: { type: String, default: '/images/video-thumbnail-default.jpg'},
    ownerAddress: { type: String},
    myAddress: { type: String},
    isPaid: { type: Boolean, default: false},
  },
  data: () => ({
  }),  
  components: {
    UserSummary
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