<template>
  <section class="app-footer">
    <footer class="footer">
      <div class="container-fluid clearfix">
        <span
          class="text-muted d-block text-center text-sm-left d-sm-inline-block"
          >Copyright © {{ this.year }}
          <a
            href="https://www.greenboom.com/"
            target="_blank"
            style="color: red"
            >GreenBoom</a
          >. All rights reserved.</span
        >
        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"
          >Hand-crafted & made with <i class="mdi mdi-heart text-danger"></i>by <a href="https://codment.com/" target="blank" style="color: red"
            >Codment</a
          ></span
        >
      </div>
    </footer>
  </section>
</template>

<script>
export default {
  name: "app-footer",
  data() {
    return {
      year: null,
    };
  },
  mounted() {
    let date = new Date();
    this.year = date.getFullYear();
  },
};
</script>
