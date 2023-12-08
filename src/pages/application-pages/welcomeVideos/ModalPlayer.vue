<!-- ModalPlayer.vue -->

<template>
  <modal name="video-modal" :adaptive="true">
    <video ref="videoPlayer" controls>
      <source :src="videoSource" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </modal>
</template>

<script>
export default {
  props: ["videoSource"],
  watch: {
    videoSource(newSource) {
      // Reset video playback when the source changes
      this.$refs.videoPlayer.load();
    },
  },
};
</script>

<style scoped>
/* Add your styling here if needed */
</style>
