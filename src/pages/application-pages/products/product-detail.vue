<template>
  <section class="tables">
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">{{ this.detail.product_name }}</h1>
        <div class="text-right">
          <button @click="goBack" class="btn btn-primary orange-button">
            <i class="mdi mdi-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <div class="user-avatar mb-auto">
              <img
                :src="this.storedProductData.image"
                alt="profile image"
                class="profile-img img-fluid rounded-circle"
                style="max-width: 100%; height: auto"
              />
            </div>
          </div>
          <div class="col-md-8">
            <h1>{{ this.detail.product_name }} Detail</h1>
            <br />
            <label><b>Size :</b></label>
            {{ this.$route.params.size }}
            <br />
            <div
              v-if="this.small?.size[0]?.added_remediation_material == 'yes'"
            >
              <label><b>Sku Rem : </b></label>
              {{ this.small?.title[0]?.sku_rem }}
              <br />
              <label><b>Title : </b></label>
              {{ this.small?.title[0]?.title_remediation }}
              <br />
            </div>
            <label><b>Description : </b></label>
            {{ this.detail.description }}
            <br />
            <label><b>Title : </b></label>
            {{ this.detail.title }}
            <br />
            <div v-if="this.small?.size[0]?.dimensions != null">
              <label><b>Dimensions :</b></label>
              {{ this.small?.size[0]?.dimensions }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.absorbency_bag != null">
              <label><b>Absorbency/Bag :</b></label>
              {{ this.small?.size[0]?.absorbency_bag }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.absorbency_kit != null">
              <label><b>Absorbency/Kit :</b></label>
              {{ this.small?.size[0]?.absorbency_kit }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.absorbency_drum != null">
              <label><b>Absorbency/Drum :</b></label>
              {{ this.small?.size[0]?.absorbency_drum }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.absorbency_boom != null">
              <label><b>Absorbency/Boom :</b></label>
              {{ this.small?.size[0]?.absorbency_boom }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.absorbency_pillow != null">
              <label><b>Absorbency/Pillow :</b></label>
              {{ this.small?.size[0]?.absorbency_pillow }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.absorbency_mat != null">
              <label><b>Absorbency/Mat :</b></label>
              {{ this.small?.size[0]?.absorbency_mat }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.absorbency_sock != null">
              <label><b>Absorbency/Sock :</b></label>
              {{ this.small?.size[0]?.absorbency_sock }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.added_remediation_material != null">
              <label><b>Added Remediation Material :</b></label>
              {{ this.small?.size[0]?.added_remediation_material }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.qty_case != null">
              <label><b>Qty/Case :</b></label>
              {{ this.small?.size[0]?.qty_case }}
              <br />
            </div>
            <div v-if="this.small?.size[0]?.capacity != null">
              <label><b>Capacity :</b></label>
              {{ this.small?.size[0]?.capacity }}
              <br />
            </div>
            <div v-if="this.$route.params.size === 'Small'">
              <!-- <h3>Small Data</h3> -->
              <label><b>Product Dimensions(LHW) :</b> </label>
              {{ small?.dimension[0]?.["product_dimensions(LHW)1"] }}
              <br />
              <label><b>Product Dimensions(LHW) :</b> </label>
              {{ small?.dimension[0]?.["product_dimensions(LHW)2"] }}
              <br />
              <label><b>Packaging Dimensions(LHW) :</b> </label>
              {{ small?.dimension[0]?.["packaging_dimensions(LHW)1"] }}
              <br />
              <label><b>Packaging Dimensions(LHW) :</b> </label>
              {{ small?.dimension[0]?.["packaging_dimensions(LHW)2"] }}
              <br />
              <label><b>Weight Product :</b> </label>
              {{ small?.dimension[0]?.weight_product }}
              <br />
            </div>
            <div v-else-if="this.$route.params.size === 'Medium'">
              <div
                v-if="this.medium?.size[0]?.added_remediation_material == 'yes'"
              >
                <label><b>Sku Rem :</b> </label>
                {{ this.medium?.title[0]?.sku_rem }}
                <br />
                <label><b>Title Rem:</b> </label>
                {{ this.medium?.title[0]?.title_remediation }}
                <br />
              </div>
              <!-- <label><b>Description : </b></label>
              {{ this.detail.description }}
              <br />
              <label><b>Title : </b></label>
              {{ this.detail.title }}
              <br /> -->
              <div v-if="this.medium?.size[0]?.dimensions != null">
                <label><b>Dimensions :</b></label>
                {{ this.medium?.size[0]?.dimensions }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.absorbency_bag != null">
                <label><b>Absorbency/Bag :</b></label>
                {{ this.medium?.size[0]?.absorbency_bag }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.absorbency_kit != null">
                <label><b>Absorbency/Kit :</b></label>
                {{ this.medium?.size[0]?.absorbency_kit }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.absorbency_drum != null">
                <label><b>Absorbency/Drum :</b></label>
                {{ this.medium?.size[0]?.absorbency_drum }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.absorbency_boom != null">
                <label><b>Absorbency/Boom :</b></label>
                {{ this.medium?.size[0]?.absorbency_boom }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.absorbency_pillow != null">
                <label><b>Absorbency/Pillow :</b></label>
                {{ this.medium?.size[0]?.absorbency_pillow }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.absorbency_mat != null">
                <label><b>Absorbency/Mat :</b></label>
                {{ this.medium?.size[0]?.absorbency_mat }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.absorbency_sock != null">
                <label><b>Absorbency/Sock :</b></label>
                {{ this.medium?.size[0]?.absorbency_sock }}
                <br />
              </div>
              <div
                v-if="this.medium?.size[0]?.added_remediation_material != null"
              >
                <label><b>Added Remediation Material :</b></label>
                {{ this.medium?.size[0]?.added_remediation_material }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.qty_case != null">
                <label><b>Qty/Case :</b></label>
                {{ this.medium?.size[0]?.qty_case }}
                <br />
              </div>
              <div v-if="this.medium?.size[0]?.capacity != null">
                <label><b>Capacity :</b></label>
                {{ this.medium?.size[0]?.capacity }}
                <br />
              </div>
              <div v-if="this.$route.params.size === 'Medium'">
                <!-- <h3>medium Data</h3> -->
                <label><b>Product Dimensions(LHW) :</b> </label>
                {{ medium?.dimension[0]?.["product_dimensions(LHW)1"] }}
                <br />
                <label><b>Product Dimensions(LHW) :</b> </label>
                {{ medium?.dimension[0]?.["product_dimensions(LHW)2"] }}
                <br />
                <label><b>Packaging Dimensions(LHW) :</b> </label>
                {{ medium?.dimension[0]?.["packaging_dimensions(LHW)1"] }}
                <br />
                <label><b>Packaging Dimensions(LHW) :</b> </label>
                {{ medium?.dimension[0]?.["packaging_dimensions(LHW)2"] }}
                <br />
                <label><b>Weight Product :</b> </label>
                {{ medium?.dimension[0]?.weight_product }}
                <br />
              </div>
            </div>

            <div v-else-if="this.$route.params.size === 'Large'">
              <div
                v-if="this.large?.size[0]?.added_remediation_material == 'yes'"
              >
                <label><b>Sku Rem :</b> </label>
                {{ this.large?.title[0]?.sku_rem }}
                <br />
                <label><b>Title Rem:</b> </label>
                {{ this.large?.title[0]?.title_remediation }}
                <br />
              </div>
              <!-- <label><b>Description : </b></label>
              {{ this.detail.description }}
              <br />
              <label><b>Title : </b></label>
              {{ this.detail.title }} -->
              <!-- <br /> -->
              <div v-if="this.large?.size[0]?.dimensions != null">
                <label><b>Dimensions :</b></label>
                {{ this.large?.size[0]?.dimensions }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.absorbency_bag != null">
                <label><b>Absorbency/Bag :</b></label>
                {{ this.large?.size[0]?.absorbency_bag }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.absorbency_kit != null">
                <label><b>Absorbency/Kit :</b></label>
                {{ this.large?.size[0]?.absorbency_kit }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.absorbency_drum != null">
                <label><b>Absorbency/Drum :</b></label>
                {{ this.large?.size[0]?.absorbency_drum }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.absorbency_boom != null">
                <label><b>Absorbency/Boom :</b></label>
                {{ this.large?.size[0]?.absorbency_boom }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.absorbency_pillow != null">
                <label><b>Absorbency/Pillow :</b></label>
                {{ this.large?.size[0]?.absorbency_pillow }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.absorbency_mat != null">
                <label><b>Absorbency/Mat :</b></label>
                {{ this.large?.size[0]?.absorbency_mat }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.absorbency_sock != null">
                <label><b>Absorbency/Sock :</b></label>
                {{ this.large?.size[0]?.absorbency_sock }}
                <br />
              </div>
              <div
                v-if="this.large?.size[0]?.added_remediation_material != null"
              >
                <label><b>Added Remediation Material :</b></label>
                {{ this.large?.size[0]?.added_remediation_material }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.qty_case != null">
                <label><b>Qty/Case :</b></label>
                {{ this.large?.size[0]?.qty_case }}
                <br />
              </div>
              <div v-if="this.large?.size[0]?.capacity != null">
                <label><b>Capacity :</b></label>
                {{ this.large?.size[0]?.capacity }}
                <br />
              </div>
              <div v-if="this.$route.params.size === 'Large'">
                <!-- <h3>large Data</h3> -->
                <label><b>Product Dimensions(LHW) :</b> </label>
                {{ large?.dimension[0]?.["product_dimensions(LHW)1"] }}
                <br />
                <label><b>Product Dimensions(LHW) :</b> </label>
                {{ large?.dimension[0]?.["product_dimensions(LHW)2"] }}
                <br />
                <label><b>Packaging Dimensions(LHW) :</b> </label>
                {{ large?.dimension[0]?.["packaging_dimensions(LHW)1"] }}
                <br />
                <label><b>Packaging Dimensions(LHW) :</b> </label>
                {{ large?.dimension[0]?.["packaging_dimensions(LHW)2"] }}
                <br />
                <label><b>Weight Product :</b> </label>
                {{ large?.dimension[0]?.weight_product }}
                <br />
              </div>
            </div>

            <div v-else>
              <h3>No Data Found for Size: {{ size }}</h3>
            </div>
            <div v-if="this.small?.dimension[0]?.total_weight_product != null">
              <label><b>Total Weight Product :</b> </label>
              {{ small?.dimension[0]?.total_weight_product }}
              <br />
            </div>
            <div v-if="this.small?.dimension[0]?.total_weight_case != null">
              <label><b>Total Weight Case :</b> </label>
              {{ small?.dimension[0]?.total_weight_case }}
              <br />
            </div>
            <div v-if="this.small?.dimension[0]?.total_weight_kit != null">
              <label><b>Total Weight Kit :</b> </label>
              {{ small?.dimension[0]?.total_weight_kit }}
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e2e2e2;
  padding: 10px;
}

.card-body {
  padding: 20px;
}
</style>

<script>
import Vue from "vue";
import SortedTablePlugin from "vue-sorted-table";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import Swal from "sweetalert2";
import API from "../../../config/api";
import { endpoints } from "../../../config/endpoints";

Vue.use(SortedTablePlugin, {
  ascIcon: '<i class="mdi mdi-arrow-down"></i>',
  descIcon: '<i class="mdi mdi-arrow-up"></i>',
});

export default {
  computed: {},
  data: function () {
    return {
      storedProductData: JSON.parse(localStorage.getItem("productDataDetail")),
      detail: {},
      description: {},
      small: {},
      medium: {},
      large: {},
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getProductDataDetail", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  created() {
    const id = this.$route.params.id;
    const size = this.$route.params.size;
    this.fetchProductDataDetails();
    // this.baseUrl = "https://virtualrealitycreators.com/green-boom/";
    // Access the ID from the route parameters
    // const id = this.$route.params.id;
    // const title = this.$route.params.title;
    // console.log(this.$route.params.title);
    // Call the fetchDataById method with the ID
    // this.fetchDataById(id);
  },
  methods: {
    ...mapActions(["fetchProductDataDetail"]),

    fetchProductDataDetails() {
      // console.log("id here", this.$route.params.id);
      // this.fetchProductDataDetail();
      const size = this.$route.params.size;
      console.log("size", size);
      API.get(`admin/productDetails/${this.$route.params.id}`).then((resp) => {
        this.detail = resp.data.product_data;
        this.details = resp.data;
        // console.log("Fetched product data:", this.details);
        this.small = resp.data.small;
        this.medium = resp.data.medium;
        this.large = resp.data.large;
        console.log("Fetched product data:", this.detail);
        console.log("Fetched small:", this.small);
        console.log("Fetched medium:", this.medium);
        console.log("Fetched large:", this.large);
        // console.log("description:", this.description);
      });
    },

    goBack() {
      // Use Vue Router to navigate back to the previous page
      this.$router.go(-1); // This will go back one step in the history
      // Alternatively, you can use this.$router.push('/your-route') to navigate to a specific route
    },
  },
  async mounted() {},
};
</script>
<style scoped>
btn-primary:not(.btn-light):focus,
.btn-primary:not(.btn-light):active {
  background: red;
  border-color: orange;
}
.orange-button {
  background-color: red;
  border-color: orange;
  color: white;
}

h1 {
  color: #333;
  background-color: red;
  color: white;
  padding: 15px;
  margin: 0;
  border-radius: 8px 8px 0 0;
}
.card-title {
  color: white;
  font-size: x-large;
}
.card-header {
  background-color: red;
  color: white;
}
</style>
