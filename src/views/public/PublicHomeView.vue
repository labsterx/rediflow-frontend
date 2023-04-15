<script setup>
import HeaderPublic from "@/components/ui/HeaderPublic.vue"
import FooterPublic from "@/components/ui/FooterPublic.vue"
</script>

<template>
  <HeaderPublic />

  <v-container fluid class="cover-banner pt-5">

      <div class="mx-auto text-center" style="max-width: 800px; padding-top: 100px; padding-bottom: 100px">
        <h1 class="text-color-accent" style="color: #FFF; margin-top: 40px; margin-bottom: 20px">Pay-As-You-Watch: Your Ticket to Web3-Powered Video Streaming!</h1>

        <div class="mx-auto text-center">
          <v-col cols="auto">
            <v-btn to="/login/" size="x-large" dark color="red-darken-2">Enter</v-btn>
          </v-col>
        </div>
      </div>

</v-container>

<v-container fluid style="background-color: #FFF; ">
  <div class="mx-auto text-center my-4" style="max-width: 800px; color: rgb(155, 155, 155);">
    <h2>RediFlow: The Future of Web3 Video Streaming. Pay-as-you-Watch, Stream with Privacy using Your Crypto Wallet, and Fair Compensation for Content Creators!</h2>
  </div>
</v-container>

<v-container fluid style=" background-color: #EDEDED">
<div style="max-width: 900px; margin-top: 10px; margin-bottom: 30px; padding-top: 30px; padding-bottom: 30px;" class="mx-auto mb-4" >
  <v-row no-gutters>
    <v-col>
      <v-card class="pa-5 mx-2" color="blue-lighten-4">
      <h2 class="mb-3 text-center">Pay-as-you-Watch</h2>
      <div>
        Seamlessly pay with cryptocurrencies for private and convenient video streaming. Use your crypto wallet, pay only when you are watching!
      </div>
    </v-card>
    </v-col>

    <v-col>
      <v-card class="pa-5 mx-2"  color="orange-lighten-4">
      <h2 class="mb-3 text-center">Seamless Streaming</h2>
      <div>
        Enjoy high-quality streaming with Livepeer's robust video infrastructure, ensuring smooth playback and an exceptional viewing experience.
      </div>
    </v-card>
    </v-col>
    <v-col>
      <v-card class="pa-5 mx-2"  color="green-lighten-4">
      <h2 class="mb-3 text-center">Fair Compensation</h2>
      <div>
        Content creators receive real-time payments with Superfluid's streaming payment technology, providing greater control and monetization opportunities.
        </div>
      </v-card>
    </v-col>
  </v-row>
</div>
</v-container>

<div class="lime lighten-5 mx-auto text-center my-4" style="margin-top: 10px; padding-top: 60px; padding-bottom: 60px;">
  <h1 class="grey--text mb-6">Powered By</h1>
  <v-row style="max-width: 900px;" class="mx-auto">
    <v-col class="px-3 py-5 text-center mx-2">
      <v-img src="/images/logo-superfluid.jfif" style="width: 350px; max-width: 300px"></v-img>
    </v-col>
    <v-col class="px-3 py-5 text-center mx-2">
      <v-img src="/images/logo-livepeer.png" style="width: 250px; max-width: 300px"></v-img>
    </v-col>
    <v-col class="px-3 py-5 text-center mx-2">
      <v-img src="/images/logo-graph.jpg" style="width: 200px; max-width: 200px"></v-img>
    </v-col>
  </v-row>
</div>

  <FooterPublic />

</template>

<script>
</script>

<style scoped>
.cover-banner {
  background: linear-gradient( rgba(0,0,0,0.45),rgba(0,0,0,0.55) ),url(/images/cover-bg.jpg) 50% 0px no-repeat;
  padding-top: 200px;
}
.text-color-accent {
    background-image: linear-gradient(270deg, #3bd3e9, #ff4980);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 45px;
}
</style>
