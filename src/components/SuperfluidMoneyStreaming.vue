<template>
  
  <div v-if="loading">
    <Preloader />
  </div>

  <div v-else>
    
    <v-banner
      lines="one"
      color="teal"
    >
      <template v-slot:prepend>
        <v-avatar
          color="teal"
          icon="mdi-account-filter"
        ></v-avatar>
      </template>

      <v-banner-text>
        Superfluid Money Streaming:
        <span v-if="startStreamLoading || stopStreamLoading">Updating...</span>
        <span v-else>
          <span v-if="isStreaming">ON</span>
          <span v-else>OFF</span>
        </span>
        <div v-if="isStreaming">
          <span>Current Balance of {{ superTokenName }} {{  tokenBalanceReadable }}</span><br />
        </div>
      </v-banner-text>

      <v-banner-actions>

        <v-btn
          class="mx-3"
          v-if="isStreaming" 
          prepend-icon="mdi-check-circle" 
          variant="plain"
        >
          Currently Paying
        </v-btn>

        <v-btn
          v-else 
          class="mx-3"
          variant="plain"
        >
          Currently Not Paying
        </v-btn>

        <v-btn
          v-if="!isStreaming"
          :loading="startStreamLoading"
          :disabled="startStreamLoading"
          color="success"
          variant="tonal"
          @click="startMoneyStreaming"
          
        >
          Start Paying
        </v-btn>

        <v-btn
          v-else
          :loading="stopStreamLoading"
          :disabled="stopStreamLoading"
          color="teal"
          variant="tonal"
          @click="stopMoneyStreaming"
        >
          Stop Paying
        </v-btn>
      </v-banner-actions>
    </v-banner>

  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { Framework } from "@superfluid-finance/sdk-core";
import Preloader from "@/components/ui/Preloader.vue"
import { ethers } from 'ethers';
export default {
  props: {
    recipientAddress: { type: String },
    superTokenName: { type: String },
    flowRate: { type: Number, default: 1 },
    keepCheckingStatus: { type: Boolean, default: false },
    statusCheckingInterval: { type: Number, default: 5000 },
  },
  setup() {
    const loading = ref(true);
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
    const tokenBalanceReadable = ref(null);
    const checkStatusInterval = ref(null);
    return { loading, startStreamLoading, stopStreamLoading, isStreaming, SfFramework, provider, signer, signerAddress, superSigner, chainId, superToken, currentFlow, tokenBalanceReadable, checkStatusInterval };
  },
  components: {
    Preloader
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

        const createFlowOperation = this.superToken.createFlow({
          sender: this.signerAddress,
          receiver: this.recipientAddress,
          flowRate: this.flowRate
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

