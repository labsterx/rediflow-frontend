<template>
  
  <div v-if="loading">
    <Preloader />
  </div>

  <div v-else>
    
    <v-btn v-if="isStreaming" 
      class="mr-3"
      prepend-icon="mdi-check-circle" 
      size="small"
      color="green-lighten-4"
      variant="flat"
    >
      Currently Paying
    </v-btn>

    <v-btn v-else
      class="mr-3"
      size="small"
      color="grey-lighten-2"
      variant="flat"
    >
      Currently Not Paying
    </v-btn>


    <!----------- BEGIN Start Paying Dialog ---------->
    <v-dialog
      v-if="!isStreaming"
      v-model="dialogStartPaying"
      persistent
      width="500"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          prepend-icon="mdi-menu-right"
          size="small"
          color="green-darken-2"
          variant="flat"
          v-bind="props"
          class="mx-2"
        >
          Start Paying
        </v-btn>
      </template>
      <v-card
        title="Ready to pay to watch video?"  
      >
        <template v-slot:append>
          <div class="me-n2">
            <v-btn
              @click="dialogStartPaying = false"
              icon="$close"
              density="comfortable"
              variant="plain"
            ></v-btn>
          </div>
        </template>
        <v-card-text>

          <v-alert
            color="amber-lighten-4"
            icon="mdi-bitcoin"
            prominent
          >
            <span class="text-body-2">In order to watch this video and other videos owned by this creator, you will need to pay a small amount of cryptocurrency, which will be charged to your account every second unless you stop paying. You can stop paying at any time.</span>
          </v-alert>
        <div class="text-body-2 mt-3">
          <p>You will pay to: 
            <UserSummary
              class="ml-2"
              fulladdress
              :address="recipientAddress"
            />
          </p>
          <p>You will pay in this token:
            <v-chip size="small">{{ superTokenName }}</v-chip> 
          </p>
          <p>Price: <strong>{{ pricePerHour }}</strong> {{ superTokenName }} per hour
            (<strong>{{ flowRate.toFixed(6) }}</strong> {{ superTokenName }} per second)
          </p>
        </div>

        <v-btn
          :loading="startStreamLoading"
          :disabled="startStreamLoading"
          block
          class="text-none my-4"
          color="green-darken-4"
          size="x-large"
          variant="flat"
          @click="startMoneyStreaming"
          
        >
          Start Paying
        </v-btn>

        </v-card-text>
      </v-card>
    </v-dialog>
    <!----------- END Start Paying Dialog ---------->   



    <v-btn
      v-if="isStreaming"
      :loading="stopStreamLoading"
      :disabled="stopStreamLoading"
      prepend-icon="mdi-stop-circle"
      size="small"
      color="pink-darken-2"
      variant="flat"
      @click="stopMoneyStreaming"
    >
      Stop Paying
    </v-btn>


  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { Framework } from "@superfluid-finance/sdk-core";
import Preloader from "@/components/ui/Preloader.vue"
import UserSummary from "@/components/ui/UserSummary.vue"
import { ethers } from 'ethers';
import BigNumber from "bignumber.js";
import * as Web3 from 'web3'
export default {
  props: {
    recipientAddress: { type: String },
    superTokenName: { type: String },
    pricePerHour: { type: Number },
    keepCheckingStatus: { type: Boolean, default: false },
    statusCheckingInterval: { type: Number, default: 5000 },
  },
  setup() {
    const loading = ref(true);
    const dialogStartPaying = ref(false);
    const startStreamLoading = ref(false);
    const stopStreamLoading = ref(false);
    const isStreaming = ref(false);
    const SfFramework = reactive({});
    const provider = reactive({});
    const signer = reactive({});
    const signerAddress = ref(null);
    const superSigner = reactive({});
    const chainId = ref(null);
    const superToken = reactive({});
    const currentFlow = reactive({});
    const flowRate = ref(null);
    const tokenBalanceReadable = ref(null);
    const checkStatusInterval = ref(null);
    return { loading, dialogStartPaying, startStreamLoading, stopStreamLoading, isStreaming, SfFramework, provider, signer, signerAddress, superSigner, chainId, superToken, currentFlow, flowRate, tokenBalanceReadable, checkStatusInterval };
  },
  components: {
    Preloader,
    UserSummary
  },  
  computed: {
  },  
  methods: {
    async init() {

      if (!window.ethereum) {
        console.log('Please install MetaMask!');
        return;
      }

      console.log('init');

      this.loading = true;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      // console.log("signer: ", signer);
      const signerAddress = await signer.getAddress();
      console.log("signerAddress: ", signerAddress);
      this.chainId = await window.ethereum.request({ method: "eth_chainId" });
      // console.log("ChainId in Number: ", Number(this.chainId));


      if (this.pricePerHour !== null) {
        this.flowRate = this.pricePerHour / 3600
      }
      else {
        this.flowRate = null
      }

      const SfFramework = await Framework.create({
        chainId: Number(this.chainId),
        provider: provider
      });
      // console.log("SfFramework: ", SfFramework);

      const superToken = await SfFramework.loadSuperToken(this.superTokenName);
      // console.log("SuperToken: ", superToken);

      const superSigner = SfFramework.createSigner({ signer: signer });

      this.superToken = superToken;
      this.SfFramework = SfFramework;
      this.signer = signer;
      this.superSigner = superSigner;
      this.signerAddress = signerAddress;

      await this.checkIfStreaming();
      await this.checkTokenBalance();

      this.loading = false;

      if (this.keepCheckingStatus) {
        this.checkStatusInterval = setInterval(async () => {
          if (this.isStreaming) {
            await this.checkIfStreaming();
          }
        }, this.statusCheckingInterval);
      }

      // call checkTokenBalance() every 5 seconds as long as isStreaming is true
      // setInterval(async () => {
      //   if (this.isStreaming) {
      //     await this.checkTokenBalance();
      //   }
      // }, 300000);


    },

    async checkIfStreaming() {

      console.log('checkIfStreaming');
      const currentFlow = await this.superToken.getFlow({
        sender: await this.signerAddress,
        receiver: this.recipientAddress,
        providerOrSigner: this.superSigner
      });

      console.log(currentFlow);
      if (currentFlow.flowRate != "0") {
        this.isStreaming = true;
      }
      else {
        this.isStreaming = false;
      }

      this.$emit('streamingMoneyStatusUpdate', this.isStreaming);

    },

    async checkTokenBalance() {

      console.log('checkTokenBalance');
      const tokenBalance = await this.superToken.balanceOf({
        account: this.signerAddress,
        providerOrSigner: this.superSigner
      });
      const tokenBalanceReadable = ethers.utils.formatUnits(tokenBalance, 18);
      console.log("tokenBalanceReadable: ", tokenBalanceReadable);
      this.tokenBalanceReadable = tokenBalanceReadable;
    },

    async startMoneyStreaming() {

      this.startStreamLoading = true;

      console.log(this.signerAddress, this.recipientAddress, this.flowRate);
      try {

        const tmpNum = this.flowRate.toFixed(8);
        const weiValue = ethers.utils.parseEther(tmpNum.toString());
        const createFlowOperation = this.superToken.createFlow({
          sender: this.signerAddress,
          receiver: this.recipientAddress,
          flowRate: weiValue,
          // userData?: string
        });

        // console.log(createFlowOperation);
        console.log("Creating your stream...");

        const result = await createFlowOperation.exec(this.superSigner);
        console.log(result);

        console.log(
          `Congrats - you've just created a money stream!
        `);

      } catch (error) {
        console.log(
          "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
        );
        console.error(error);
      } finally {
        // call checkIfStreaming() every 10 seconds until it returns true
        while (this.isStreaming == false) {
          await new Promise(r => setTimeout(r, 2000));
          await this.checkIfStreaming();
        }
        this.startStreamLoading = false;
      }
    },

    async stopMoneyStreaming() {

      this.stopStreamLoading = true;

      try {
        const deleteFlowOperation = this.superToken.deleteFlow({
          sender: this.signerAddress,
          receiver: this.recipientAddress
          // userData?: string
        });

        console.log(deleteFlowOperation);
        console.log("Deleting your stream...");

        const result = await deleteFlowOperation.exec(this.superSigner);
        console.log(result);

        console.log(
          `Congrats - you've just updated a money stream!
        `
        );
      } catch (error) {
        console.log(
          "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
        );
        console.error(error);
      } finally {
        while (this.isStreaming == true) {
          await new Promise(r => setTimeout(r, 2000));
          await this.checkIfStreaming();
        }
        this.stopStreamLoading = false;
      }
    }
  },

  created () {
    this.init()
  }, 

  stop() {
    clearInterval(this.checkStatusInterval);  
  },

}
</script>

