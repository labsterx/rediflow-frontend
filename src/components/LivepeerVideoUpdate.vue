<template>
  
  <div>

    <!----------- BEGIN Update Video ---------->
    <v-dialog
      v-model="dialogUpdateVideo"
      persistent
      width="500"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          size="small"
          color="grey-darken-4"
          variant="flat"
          v-bind="props"
          class="mx-2"
        >
          Update Video Info
        </v-btn>
      </template>
      <v-card
        title="Update Video Info"  
      >
        <template v-slot:append>
          <div class="me-n2">
            <v-btn
              @click="dialogUpdateVideo = false"
              icon="$close"
              density="comfortable"
              variant="plain"
            ></v-btn>
          </div>
        </template>
        <v-card-text>

          <v-text-field 
            v-model="fileNameInput"
            variant="outlined" 
            density="compact" 
            label="Video Title"
            required
          ></v-text-field>

          <v-checkbox 
            v-model="isPaidInput"
            label="Video is paid content"
          ></v-checkbox>

          <v-btn
            :loading="updateVideoLoading"
            :disabled="updateVideoLoading"
            @click="updateVideo"
            block
            class="text-none mb-4"
            color="grey-darken-4"
            size="x-large"
            variant="flat"
          >
            Update
          </v-btn>

        </v-card-text>
      </v-card>
    </v-dialog>
    <!----------- END Update Video ---------->

    <!----------- BEGIN Delete Video ---------->
    <v-dialog
      v-model="dialogDeleteVideo"
      persistent
      width="500"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          size="small"
          color="pink-darken-2"
          variant="flat"
          v-bind="props"
          class="mx-2"
        >
          Delete Video
        </v-btn>
      </template>
      <v-card
        title="Are you sure you want to delete this video?"  
      >
        <template v-slot:append>
          <div class="me-n2">
            <v-btn
              @click="dialogDeleteVideo = false"
              icon="$close"
              density="comfortable"
              variant="plain"
            ></v-btn>
          </div>
        </template>
        <v-card-text>

        <v-btn
          :loading="deleteVideoLoading"
          :disabled="deleteVideoLoading"
          @click="deleteVideo"
          block
          class="text-none mb-4"
          color="pink-darken-4"
          size="x-large"
          variant="flat"
        >
          Delete
        </v-btn>

        </v-card-text>
      </v-card>
    </v-dialog>
    <!----------- END Delete Video ---------->    

  </div>
 
</template>

<script>
import axios from '@/axios'
import { config } from '@/config/index.js'
export default {
  props: {
    assetId: { type: String, required: true },
    name: { type: String },
    ownerAddress: { type: String, required: true},
    myAddress: { type: String, required: true},
    isPaid: { type: Boolean, required: true },
    isReady: { type: Boolean, required: true },
  },
  data: () => ({
    dialogUpdateVideo: false,
    dialogDeleteVideo: false,
    updateVideoLoading: false,
    deleteVideoLoading: false,
    fileNameInput: null,
    isPaidInput: null,
  }),  
  components: {
  },   
  computed: {
  },  
  methods: {
    
    async init() {
      this.fileNameInput = this.name;
      this.isPaidInput = this.isPaid;
    },

    async updateVideo() {
      
      console.log('updateVideo()');

      this.updateVideoLoading = true;

      const requestUrl = config.backendAPIURL + '/livepeer/update-video-info/' + this.myAddress + '/' + this.assetId;

      const requestData = {
        name: this.fileNameInput,
        isPaid: this.isPaidInput,
      };
      // console.log(requestData);

      try {
        
        const res = await axios.post(requestUrl, requestData);
        console.log(res)
        this.dialogUpdateVideo = false
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.updateVideoLoading = false;
      }
    },

    async deleteVideo() {
      
      console.log('deleteVideo()');

      this.deleteVideoLoading = true;

      const requestUrl = config.backendAPIURL + '/livepeer/delete-video/' + this.myAddress + '/' + this.assetId;

      try {
        
        const res = await axios.post(requestUrl);
        console.log(res)
        this.dialogDeleteVideo = false
        this.$router.push({ name: 'UserDefault' })
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.deleteVideoLoading = false;
      }
    }


  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
</style>  