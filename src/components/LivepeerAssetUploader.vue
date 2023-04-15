<template>

<v-dialog
  v-model="dialogFileUpload"
  persistent
  width="500"
>
  <template v-slot:activator="{ props }">
    <v-btn
      color="primary"
      v-bind="props"
    >
      Upload New Video
    </v-btn>
  </template>
  <v-card
    title="New Video Upload"
    :loading="uploadRequestLoading || doUplaodLoading || (uploadURL && !videoReady)"
  >
    <template v-slot:append>
      <div class="me-n2">
        <v-btn
          @click="dialogFileUpload = false"
          icon="$close"
          density="comfortable"
          variant="plain"
        ></v-btn>
      </div>
    </template>
    <v-card-text>

    <!---------- Begin Step 1 --------->
    <div v-if="!uploadURL" class="mt-4">

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
        :loading="uploadRequestLoading"
        :disabled="uploadRequestLoading || !fileNameInput"
        @click="sendUploadRequest"
        block
        class="text-none mb-4"
        color="indigo-darken-3"
        size="x-large"
        variant="flat"
      >
        Next
      </v-btn>

    </div><!-- v-if="!uploadURL" -->
    <!---------- End Step 1 --------->
    
    <!---------- Begin Step 2 --------->
    <div v-if="uploadURL && !fileUploaded" class="mt-4">

      <v-file-input
      accept="video/*"
      placeholder="Choose video file to upload"
      prepend-icon="mdi-camera"
      label="VideoFile"
      id="fileInput"
      ></v-file-input>
      <v-btn
        v-show="!doUplaodLoading"
        :loading="doUplaodLoading"
        :disabled="doUplaodLoading"    
        @click="doResumableUpload"
        block
        class="text-none mb-4"
        color="indigo-darken-3"
        size="x-large"
        variant="flat"
      >Upload Video File</v-btn>

      <div v-if="doUplaodLoading && !fileUploaded" class="my-4">
        <div>Upload Progress:</div>
        <v-progress-linear 
          :model-value="uploadPercentage"  class="my-4"
          color="blue-grey"
          height="25"
        >
        </v-progress-linear>
      </div>

    </div><!--  v-if="uploadURL" -->

    <div v-if="fileUploaded && !videoReady" class="mt-4">
      <div>File uploaded successfully. Processing video...</div>
      <div>Processing Progress:</div>
      <v-progress-linear class="my-4"
        :model-value="remoteProcessingPercentage"
        color="blue-grey"
        height="25"
      >
      </v-progress-linear>
    </div><!--  v-if="fileUploaded" -->

    <!---------- End Step 2 --------->

    <!---------- Begin Video Ready -------->
    <div v-if="videoReady" class="mt-4">
      <div class="text-center">
        <div>
          <v-icon
            color="success"
            icon="mdi-check-circle"
            size="x-large"
          ></v-icon>
        </div>
        <div>Congratulations! Your video is ready!</div>
        <div class="my-4">
          <v-btn  
            @click="dialogFileUpload = false"
            block
            class="text-none mb-4"
            color="indigo-darken-3"
            size="x-large"
            variant="flat"
          >Close</v-btn>
        </div>
      </div>
    </div>
    <!---------- End Video Ready -------->
    </v-card-text>
  </v-card>
</v-dialog>


</template>

<script>
import { ref } from 'vue'
import axios from '@/axios'
import * as tus from 'tus-js-client'
import { config } from '@/config/index.js'
export default {
  setup() {
    const loading = ref(false);
    const dialogFileUpload = ref(false);
    const fileNameInput = ref(null);
    const isPaidInput = ref(false);
    const uploadPercentage = ref(0);
    const uploadRequestLoading = ref(false);
    const doUplaodLoading = ref(false);
    const uploadURL = ref(null);
    const tusEndpoint = ref(null);
    const assetId = ref(null);
    const fileUploaded = ref(false);
    const assetRemoteStatus = ref(null);
    return { loading, dialogFileUpload, fileNameInput, isPaidInput, uploadPercentage, uploadRequestLoading, doUplaodLoading, uploadURL, tusEndpoint, assetId, fileUploaded, assetRemoteStatus };
  },  
  components: {
  },   
  props: {
    userAddress: { type: String, required: true },
  },
  computed: {
    remoteProcessingPercentage() {
      if (this.assetRemoteStatus && this.assetRemoteStatus.progress) {
        return Math.ceil(this.assetRemoteStatus.progress * 100)
      }
      else {
        return 0
      }
    },
    videoReady() {
      if (this.assetRemoteStatus && this.assetRemoteStatus.phase && this.assetRemoteStatus.phase=='ready') {
        return true
      }
      else {
        return false
      }
    },
    
  },  
  methods: {
    
    async init() {
      
    },

    // ------------------------------------------------------
    // Upload Request
    // ------------------------------------------------------
    async sendUploadRequest() {

      this.uploadRequestLoading = true;

      const requestUrl = config.backendAPIURL + '/livepeer/upload-request';

      const requestData = {
        name: this.fileNameInput,
        userAddress: this.userAddress,
        isPaid: this.isPaidInput,
      };

      try {
        
        const res = await axios.post(requestUrl, requestData);
        console.log(res.data)
        this.uploadURL = res.data.uploadURL;
        this.tusEndpoint = res.data.tusEndpoint;
        this.assetId = res.data.assetId;

      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.uploadRequestLoading = false;
      }

    },

    // ------------------------------------------------------
    // Upload File
    // ------------------------------------------------------
    async doResumableUpload() {

      this.doUplaodLoading = true;

      const input = document.getElementById('fileInput');
      const file = input.files[0];

      const that = this;
      const upload = new tus.Upload(file, {
        endpoint: this.tusEndpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type,         
        },
        uploadSize: file.size,
        onError(err) {
          console.error('Error uploading file:', err);
          that.doUplaodLoading = false;
        },
        onProgress(bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          that.uploadPercentage = percentage;
          // console.log('Uploaded ' + percentage + '%');
        },
        onSuccess() {
          console.log('Upload finished:', upload.url);
          that.fileUploaded = true;
          that.doUplaodLoading = false;

          // call that.checkUploadedAssetStatus() every 10 seconds until that.assetRemoteStatus.phase is 'ready'
          const interval = setInterval(async () => {
            await that.checkUploadedAssetStatus();
            if (that.assetRemoteStatus.phase === 'ready') {
              clearInterval(interval);
              that.$emit('newVideoReady', that.assetId);
            }
          }, 5000);

        }
      });
      const previousUploads = await upload.findPreviousUploads();
      if (previousUploads.length > 0) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();

    },

    // ------------------------------------------------------
    // Check Uploaded Asset Status
    // ------------------------------------------------------    
    async checkUploadedAssetStatus() {

      if (!this.assetId) {
        return;
      }

      const requestUrl = config.backendAPIURL + '/livepeer/check-asset-status/' + this.assetId;

      try {
        
        const res = await axios.get(requestUrl);
        console.log(res.data)
        this.assetRemoteStatus = res.data.status;

      } catch (error) {
        console.error('Error:', error)
      } finally {
        //
      }

    },    

  },
  created () {
    // this.init()
  }
}
</script>

<style scoped>
</style>