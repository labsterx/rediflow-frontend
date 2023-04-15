<template>
  <video 
    ref="videoPlayer"
    :width="width"
    :height="height"
    class="video-js vjs-default-skin vjs-fluid"
  ></video>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default {
  name: 'VideoPlayer',
  props: {
    src: { type: String, required: true},
    type: { type: String, default: 'video/mp4'},
    title: { type: String, default: ''},
    width: { type: Number, default: 640 },
    height: { type: Number, default: 360 },
  },
  mounted() {
    console.log('VideoPlayer: ', this.src);
    this.player = videojs(this.$refs.videoPlayer, {
      sources: [{
        src: this.src,
        type: this.type
      }],
      controls: true,
      autoplay: false,
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>

<style scoped>

</style>