<template>
  <section class="product-details">
    <button @click="goBack" class="btn btn-secondary orange-button">
      <i class="mdi mdi-arrow-left"></i> Go Back
    </button>
    <div class="card">
      <div class="card-header">
        <div class="header-content">
          <h1>Order Kit Detail</h1>
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <tbody>
            <tr>
              <td class="col-md-4"><strong>Order Kit:</strong></td>
              <td class="col-md-8">
                <h3>{{ kit?.title }}</h3>
              </td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>Order Kit Description:</strong></td>
              <td class="col-md-8">
                <p>{{ kit?.description }}</p>
              </td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>User Name:</strong></td>
              <td class="col-md-8">{{ detail?.first_name }}</td>
            </tr>
            <!-- Add more rows for other user details -->
            <tr>
              <td class="col-md-4"><strong>User Email:</strong></td>
              <td class="col-md-8">{{ detail?.email }}</td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>User Phone:</strong></td>
              <td class="col-md-8">{{ detail?.phone }}</td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>User Address:</strong></td>
              <td class="col-md-8">{{ detail?.address }}</td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>Company:</strong></td>
              <td class="col-md-8">{{ detail?.company }}</td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>User City:</strong></td>
              <td class="col-md-8">{{ detail?.city }}</td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>User State:</strong></td>
              <td class="col-md-8">{{ detail?.state }}</td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>Zip Code:</strong></td>
              <td class="col-md-8">{{ detail?.zip_code }}</td>
            </tr>
            <tr>
              <td class="col-md-4"><strong>Country:</strong></td>
              <td class="col-md-8">{{ detail?.country }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

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
      detail: {},
      kit: {},
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
    this.fetchKitDetails();
    // this.baseUrl = "https://virtualrealitycreators.com/green-boom/";
    // Access the ID from the route parameters
    // const id = this.$route.params.id;
  },
  methods: {
    // ...mapActions(["fetchProductDataDetail"]),

    /**
     * Fetches the details of a kit from the API based on the route parameter ID.
     * Updates the component's data with the fetched kit details.
     */

    fetchKitDetails() {
      API.get(`admin/kit-detail/${this.$route.params.id}`).then((resp) => {
        this.detail = resp.data.kit_detail;
        this.kit = resp.data.kit;
        console.log("data console", this.detail);
        console.log("data console", this.kit);
      });
    },
    /**
     * Navigates back to the previous page using Vue Router.
     * This method goes back one step in the browser's history.
     * Alternatively, you can use this.$router.push('/your-route') to navigate to a specific route.
     */
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
  /* padding: 15px; */
  margin: 0;
  border-radius: 5px 5px 0 0;
}
.card-body {
  padding: 0px;
}
.card-title {
  color: #ff002d;
  font-size: x-large;
  background-color: transparent !important;
  padding: 0;
  padding: 10px 0;
  font-weight: 500;
  font-size: 26px;
  margin: 0;
}
.card-header {
  background-color: #ff002d;
  color: white;
}
.card {
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* margin: 20px; */
  margin-top: 20px;
}
table h3,
table p {
  margin: 0;
}
.table th,
.table td {
  padding: 20px 10px;
  font-size: unset;
}
</style>
