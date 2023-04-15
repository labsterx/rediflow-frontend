<template>

  <div v-if="loading">
    <Preloader />
  </div>
  <div v-else>
    
    <div class="float-left">
      <strong>Video Pricing</strong>:
      <span v-if="currrentPricingInfo"> {{ currrentPricingInfo.pricePerHour.toString() }} {{ currrentPricingInfo.tokenName }}</span>
      <span v-else> Free </span>
    </div>

    <div v-if="isMyself" class="float-right">

      <div v-if="currrentPricingInfo">
      
          <!----------- BEGIN Update Pricing ---------->
          <v-dialog
            v-model="dialogUpdatePricing"
            persistent
            width="500"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="blue-darken-2"
                class="mx-2"
                size="small"
                variant="flat"
              >
                Update Pricing
              </v-btn>
            </template>
            <v-card
              title="Add Pricing Info"  
            >
              <template v-slot:append>
                <div class="me-n2">
                  <v-btn
                    @click="dialogUpdatePricing = false"
                    icon="$close"
                    density="comfortable"
                    variant="plain"
                  ></v-btn>
                </div>
              </template>
              <v-card-text>

                  <v-select
                      :items="tokenNameInputChoices"
                      label="Token to Charge"
                      variant="outlined"
                      v-model="tokenNameInput"
                      required
                    ></v-select>

                  <v-text-field
                    solo
                    variant="outlined"
                    label="Price Per Hour"
                    type="number"
                    step="any"
                    v-model="pricePerHourInput"
                    :suffix="tokenNameInput ? '&nbsp;' + tokenNameInput : ''"
                    required
                  ></v-text-field>

                  <v-btn
                    block
                    :loading="addOrUpdatePricingLoading"
                    :disabled="addOrUpdatePricingLoading"
                    class="text-none mb-4"
                    color="indigo-darken-3"
                    size="x-large"
                    variant="flat"
                    @click="addOrUpdatePricing('update')"
                  >
                    Update Pricing
                  </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!----------- END Update Pricing ---------->

          <!----------- BEGIN Delete Pricing ---------->
          <v-dialog
            v-model="dialogDeletePricing"
            persistent
            width="500"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="pink-darken-2"
                class="mx-2"
                size="small"
                variant="flat"                
              >
                Delete Pricing
              </v-btn>
            </template>
            <v-card
              title="Are You Sure?"  
            >
              <template v-slot:append>
                <div class="me-n2">
                  <v-btn
                    @click="dialogDeletePricing = false"
                    icon="$close"
                    density="comfortable"
                    variant="plain"
                  ></v-btn>
                </div>
              </template>
              <v-card-text  class="text-center">

                  <v-btn
                    :loading="deletePricingLoading"
                    :disabled="deletePricingLoading"
                    class="text-none mb-4 mx-2"
                    color="red-darken-3"
                    size="x-large"
                    variant="flat"
                    @click="deletePricing"
                  >
                    Yes, Delete
                  </v-btn>

                  <v-btn
                    class="text-none mb-4 mx-2"
                    color="grey"
                    size="x-large"
                    variant="flat"
                    @click="dialogDeletePricing = false"
                  >
                    Cancel
                  </v-btn>

              </v-card-text>
            </v-card>
          </v-dialog>
          <!----------- END Delete Pricing ---------->

        </div>

        <div v-else>

          <div>No Price Set</div>

          <!----------- BEGIN Add Pricing ---------->
          <v-dialog
            v-model="dialogAddPricing"
            persistent
            width="500"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                v-bind="props"
              >
                Add Pricing
              </v-btn>
            </template>
            <v-card
              title="Add Pricing Info"  
            >
              <template v-slot:append>
                <div class="me-n2">
                  <v-btn
                    @click="dialogAddPricing = false"
                    icon="$close"
                    density="comfortable"
                    variant="plain"
                  ></v-btn>
                </div>
              </template>
              <v-card-text>

                  <v-select
                      :items="tokenNameInputChoices"
                      label="Token to Charge"
                      variant="outlined"
                      v-model="tokenNameInput"
                      required
                    ></v-select>

                  <v-text-field
                    solo
                    variant="outlined"
                    label="Price Per Hour"
                    type="number"
                    step="any"
                    v-model="pricePerHourInput"
                    :suffix="tokenNameInput ? '&nbsp;' + tokenNameInput : ''"
                    required
                  ></v-text-field>

                  <v-btn
                    block
                    :loading="addOrUpdatePricingLoading"
                    :disabled="addOrUpdatePricingLoading"
                    class="text-none mb-4"
                    color="indigo-darken-3"
                    size="x-large"
                    variant="flat"
                    @click="addOrUpdatePricing('add')"
                  >
                    Add Pricing Info
                  </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!----------- END Add Pricing ---------->
        
      </div><!-- v-if="currentPricingInfo"-->
      
    </div><!--v-if="isMyself"-->


  </div>
</template>

<script>
import Preloader from "@/components/ui/Preloader.vue"
import axios from '@/axios'
import { config } from '@/config/index.js'
export default {
  components: {
    Preloader
  },    
  props: {
    networkId: { type: String },
    userAddress: { type: String },
    myAddress: { type: String, default: '' },
  },
  data () {
    return {
      loading: true,
      addOrUpdatePricingLoading: false,
      deletePricingLoading: false,
      currrentPricingInfo: null,
      dialogAddPricing: false,
      dialogUpdatePricing: false,
      dialogDeletePricing: false,
      tokenNameInput: null,
      pricePerHourInput: null,
    }
  },
  computed: {
    isMyself: function() {
      return (this.myAddress && this.myAddress.toLowerCase() == this.userAddress.toLowerCase())
    },
    tokenNameInputChoices: function() {
      return config.superfluid.tokenAccepted[this.networkId]
    }
  },
  methods: {
    
    async init() {
      this.tokenNameInput = null;
      this.pricePerHourInput = null;
      this.currrentPricingInfo = null;
      await this.getPricing();
    },

    //--------------------------------------------------------
    //
    //--------------------------------------------------------
    async getPricing() {

      const requestUrl = config.backendAPIURL + '/livepeer/pricing/' + this.networkId + '/' + this.userAddress;

      this.loading = true;

      try {
        
        const res = await axios.get(requestUrl);
        if (res.data) {
          console.log("Pricing Info: ", res.data)
          this.currrentPricingInfo = {
            tokenName: res.data.tokenName,
            pricePerHour: res.data.pricePerHour,
          }
          this.tokenNameInput = res.data.tokenName;
          this.pricePerHourInput = res.data.pricePerHour;
        }

      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.loading = false;
      }

    },       

    //--------------------------------------------------------
    //
    //--------------------------------------------------------
    async addOrUpdatePricing(type) {

      type = type.trim()
      if (!type || ! (type == 'update' || type == 'add')) {
        console.log('wrong input type: ', type)
        return
      }

      this.addOrUpdatePricingLoading = true;

      const requestUrl = config.backendAPIURL + '/livepeer/pricing/' + type + '/' + this.networkId + '/' + this.userAddress;

      const requestData = {
        tokenName: this.tokenNameInput,
        pricePerHour: this.pricePerHourInput,
      };
      // console.log(requestData);

      try {
        
        const res = await axios.post(requestUrl, requestData);
        console.log(res)
        await this.init();
        this.dialogAddPricing = false
        this.dialogUpdatePricing = false
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.addOrUpdatePricingLoading = false;
      }

    },   

    //--------------------------------------------------------
    //
    //--------------------------------------------------------
    async deletePricing() {

      this.deletePricingLoading = true;

      const requestUrl = config.backendAPIURL + '/livepeer/pricing/delete/' + this.networkId + '/' + this.userAddress;
      console.log('requestUrl: ', requestUrl)

      try {
        
        const res = await axios.post(requestUrl);
        console.log(res)
        await this.init();
        this.dialogDeletePricing = false
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.deletePricingLoading = false;
      }

  }, 

  },

  created () {
    this.init()
  }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
