<template>

  <div class="preloader">
    <div v-if="text" class="preloader-text text-center">{{ text }}</div>
    <v-progress-linear v-if="!circle"
      indeterminate
      :color="iconcolor"
    ></v-progress-linear>
    <v-progress-circular v-if="circle"
      :size="60"
      indeterminate
      style="padding: 50px"
    ></v-progress-circular>
  </div>

</template>

<script>
export default {
  name: 'Preloader',
  props: {
    text: { },
    circle: { type: Boolean, default: false },
    sm: { type: Boolean, default: false },
    iconcolor: { type: String, default: "green" },
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.preloader {
  max-width: 300px;
  margin: 100px auto;
  text-align: center;
  color: #26A65B;
}
.preloader-text {
  margin: 20px;
}
</style>
