<script setup>
import HeaderPublic from "@/components/ui/HeaderPublic.vue"
import FooterPublic from "@/components/ui/FooterPublic.vue"
</script>

<template>
  <HeaderPublic />

  <v-main>
    <v-container>

    <v-carousel>
      <v-carousel-item
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        cover
      ></v-carousel-item>

      <v-carousel-item
        src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
        cover
      ></v-carousel-item>

      <v-carousel-item
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        cover
      ></v-carousel-item>
    </v-carousel>

      <h1>This is the Public Home Page</h1>

      <div class="mt-4">
        fdasfsdafasf fdafsda fdafsda
      </div>

    </v-container>
  </v-main>

  <FooterPublic />

</template>
