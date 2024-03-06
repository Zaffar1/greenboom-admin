<template>
  <div id="app">
    <!-- <b-modal id="video-modal" title="Video Player"></b-modal> -->
    <!-- <b-modal id="video-modal" title="Video Player" hide-footer></b-modal> -->

    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "app",
  components: {},
  methods: {
    ...mapActions(["verifyUser", "logoutUser"]),
  },
  async mounted() {
    let response = await this.verifyUser();
    if (response != true) {
      this.logoutUser();
      this.$router.push({ name: "base" });
    }
  },
};
</script>

<style lang="scss">
@import "../node_modules/@mdi/font/css/materialdesignicons.min.css";
@import "../node_modules/flag-icon-css/css/flag-icon.min.css";
@import "../node_modules/font-awesome/css/font-awesome.min.css";
@import "../node_modules/simple-line-icons/css/simple-line-icons.css";
@import "../node_modules/ti-icons/css/themify-icons.css";
@import "../node_modules/sweetalert2/dist/sweetalert2.min.css";
@import "../node_modules/vue-snotify/styles/material.css";
@import "../node_modules/codemirror/lib/codemirror.css";
@import "../node_modules/fullcalendar/dist/fullcalendar.css";
@import "../node_modules/c3/c3.min.css";
@import "../node_modules/chartist/dist/chartist.min.css";
@import "./assets/scss/style";

.popUp {
  padding: 10px 15px;
}
</style>
