<template>

  <section class="carousel">
    <div class="page-header">
      <h3 class="page-title">
        Carousel
      </h3>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">UI Elements</a></li>
          <li class="breadcrumb-item active" aria-current="page">Carousel</li>
        </ol>
      </nav>
    </div>
    <div class="row">
      <div class="col-md-6 grid-margin">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Basic Carousel</h4>
            <b-carousel id="carousel1" controls indicators background="#ababab" :interval="4000" v-model="slide1">
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_1.jpg" alt="slide image">
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_2.jpg" alt="slide image">
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_3.jpg" alt="slide image">
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_4.jpg" alt="slide image">
              </b-carousel-slide>
            </b-carousel>
          </div>
        </div>
      </div>
      <div class="col-md-6 grid-margin">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Carousel With Captions</h4>
            <b-carousel id="carousel2" controls indicators background="#ababab" :interval="3000" v-model="slide2">
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_5.jpg" alt="slide image">
                <h3>Hello world!</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_6.jpg" alt="slide image">
                <h3>Hello world!</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_7.jpg" alt="slide image">
                <h3>Hello world!</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_8.jpg" alt="slide image">
                <h3>Hello world!</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </b-carousel-slide>
            </b-carousel>
          </div>
        </div>
      </div>
      <div class="col-md-6 grid-margin">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Carousel Without Controls</h4>
            <b-carousel id="carousel3" background="#ababab" :interval="2500" v-model="slide3">
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_9.jpg" alt="slide image">
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_8.jpg" alt="slide image">
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_10.jpg" alt="slide image">
              </b-carousel-slide>
              <b-carousel-slide>
                <img slot="img" src="../../assets/images/carousel/banner_11.jpg" alt="slide image">
              </b-carousel-slide>
            </b-carousel>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
export default {
  name: 'carousel',
  data() {
    return {
      slide1: 0,
      slide2: 0,
      slide3: 0
    }
  },
}
</script>

<style scoped lang="scss">
</style>
