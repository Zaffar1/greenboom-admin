<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Product List</h3>
      <b-button
        @click="addProductModal"
        variant="success"
        class="mr-2 orange-button"
      >
        <i class="mdi mdi-plus"></i> Add Product
      </b-button>
      <!-- <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="javascript:void(0);">Table</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Advanced Table
              </li>
            </ol>
          </nav> -->
    </div>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title"></h4>
            <div class="float-right">
              <!-- search field -->
              <b-input
                v-model="filter"
                placeholder="Search User"
                id="user-search"
                style="padding: 10px"
              ></b-input>
            </div>
            <b-table
              :items="items"
              id="table-list"
              responsive
              :per-page="perPage"
              :current-page="currentPage"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              show-empty
              :filter="filter"
              striped
              hover
              ><template #cell(image)="data">
                <div>
                  <img
                    :src="data.item.file"
                    class="mr-2"
                    alt="image"
                    style="max-width: 50px; max-height: 50px"
                  />
                </div>
              </template>
              <template #cell(name)="data">
                <!-- name & profile -->
                <!-- <img :src="data.item.profile" class="mr-2" alt="image" /> -->
                {{ data.item.title }}
              </template>
              <template #cell(description)="data">
                <div>
                  {{ generateExcerpt(data.value) }}
                </div>
              </template>
              <!-- status -->
              <template v-slot:cell(status)="data">
                <!-- <span v-html="data.value"></span> -->
                <toggle-button
                  @change="changeStatus(data.item)"
                  :value="data.item.status == 'Active'"
                />
              </template>
              <!-- when no item found -->
              <template #empty="">
                <p class="text-muted text-center">{{ noItems }}</p>
              </template>

              <!-- status -->
              <!-- <template v-slot:cell(status)="data">
                <span v-html="data.value"></span>
              </template> -->
              <template v-slot:cell(file)="data">
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(action)="data">
                <!-- Actions -->

                <!-- <i
                  @click="view(data.item.id)"
                  :ref="'btn' + data.index"
                  class="mr-2 mdi mdi-eye text-muted icon-sm"
                ></i> -->
                <!-- <i
                  v-b-modal.modallg
                  @click="edit(data.item.id)"
                  :ref="'btn' + data.index"
                  class="mr-2 mdi mdi-pencil text-muted icon-sm"
                ></i> -->
                <i
                  @click="deleteItem(data.item.id)"
                  :ref="'btnDelete' + data.index"
                  class="mr-2 mdi mdi-delete text-danger icon-sm"
                ></i>
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(view)="data">
                <button @click="openModal(data.item.file)">View</button>
              </template>
              <template #cell(ProductData)="data">
                <button
                  @click="viewMedia(data.item)"
                  class="btn btn-primary orange-button"
                >
                  <i
                    class="mr-2 mdi mdi-eye text-muted icon-sm orange-button"
                  ></i
                  >View
                </button>
              </template>
            </b-table>
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="table-list"
              align="right"
            >
            </b-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- <button @click="openModal">Open Modal</button> -->

    <div v-if="isModalOpen" class="modal">
      <span @click="closeModal" class="close">&times;</span>
      <video :src="videoSource" controls></video>
    </div>

    <b-modal v-model="addProductModel" title="Add Product" hide-footer>
      <form @submit.prevent="submitAddForm">
        <b-form-group label="Product Name" label-for="editInputTitle">
          <b-form-input
            v-model="addProductName"
            id="editInputTitle"
            required
            placeholder="Type product name"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Product Usage" label-for="editInputTitle">
          <b-form-input
            v-model="addUsage"
            id="editInputTitle"
            placeholder="Type product usage (Optional)"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Title" label-for="editInputTitle">
          <b-form-input
            v-model="addTitle"
            id="editInputTitle"
            required
            placeholder="Type title"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Select Product Type" label-for="selectOption">
          <b-form-select
            v-model="selectedOption"
            id="selectOption"
            :options="selectOptions"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Description1" label-for="editInputTitle">
          <b-form-input
            v-model="addDescription1"
            id="editInputTitle"
            required
            placeholder="Type Description"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description2" label-for="editInputTitle">
          <b-form-input
            v-model="addDescription2"
            id="editInputTitle"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description3" label-for="editInputTitle">
          <b-form-input
            v-model="addDescription3"
            id="editInputTitle"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description4" label-for="editInputTitle">
          <b-form-input
            v-model="addDescription4"
            id="editInputTitle"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description5" label-for="editInputTitle">
          <b-form-input
            v-model="addDescription5"
            id="editInputTitle"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Upload file" label-for="editInputFile">
          <b-form-file
            v-model="addFile"
            id="editInputFile"
            :state="Boolean(addFile)"
            placeholder="Choose a file..."
            required
          ></b-form-file>
        </b-form-group>

        <b-button type="submit" variant="success" class="orange-button"
          >Save Changes</b-button
        >
      </form>
    </b-modal>
    <!-- v-if="currentVideo" -->
    <!-- <b-modal title="Video Player" @hidden="resetModal" id="video-modal">
        <video width="100%" controls>
          <source :src="currentVideo" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </b-modal> -->
    <div></div>
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
  data: function () {
    return {
      isModalOpen: false,
      videoSource: "", // Set a default video source
      sortBy: "name",
      perPage: 7,
      currentPage: 1,
      sortDesc: false,
      sortByFormatted: true,
      filterByFormatted: true,
      addProductModel: false,
      addTitle: "",
      addFile: "",
      addDescription1: "",
      addDescription2: "",
      addDescription3: "",
      addDescription4: "",
      addDescription5: "",
      addProductName: "",
      addUsage: "",
      filter: "",
      sortable: true,
      selectedOption: null,
      selectOptions: [
        { value: "", text: "Select an option" }, // Empty option
        { value: "loose Sorbent", text: "Loose Sorbent" },
        { value: "loose Sorbent Sheen", text: "Loose Sorbent Sheen" },
        { value: "boom", text: "Boom" },
        { value: "pillow", text: "Pillow" },
        { value: "sock", text: "Sock" },
        { value: "mat", text: "Mat" },
        { value: "spill kit", text: "Spill Kit" },
        { value: "industrial spill kit", text: "Industrial Spill Kit" },
        {
          value: "oil degrading remediation material",
          text: "Oil Degrading Remediation Material",
        },
        // Add more options as needed
      ],
      fields: [
        { key: "image", sortable: true },
        { key: "ProductName", sortable: true },
        { key: "title", sortable: true },
        // { key: "description", sortable: true },
        { key: "status", sortable: true },
        // { key: "file", sortable: true },
        { key: "created_at", sortable: true },
        { key: "ProductData", sortable: true },
        // { key: "view", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getProducts", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  methods: {
    ...mapActions(["fetchProducts", "deleteProduct"]),
    // ...mapMutations(["setProductDetail"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        let baseUrl = "https://virtualrealitycreators.com/green-boom/";
        // let baseUrl = "http://18.224.159.123/green-boom/";
        obj.id = element.id;
        obj.image = baseUrl + element.file;
        obj.ProductName = element.product_name;
        obj.title = element.title;
        obj.description = element.description1;
        obj.price = element.price;
        obj.product_type = element.product_type;
        obj.file = baseUrl.concat(element.file);
        // obj.button = `<button @click="playVideo('${obj.file}')">Play Video</button>`;
        // obj.status = `<label class="badge ${
        //   element.status === "Active" ? "badge-success" : "badge-danger"
        // }">${element.status}</label>`;
        obj.status = element.status;
        obj.status_id = element.status?.id;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });

      console.log("mister", this.items);
    },
    generateExcerpt(text) {
      if (!text) return ""; // Handle cases where text is null or undefined
      if (text.length > 10) {
        const words = text.split(" ");
        const excerpt = words.slice(0, 10).join(" ");
        return `${excerpt}...`;
      } else {
        return text;
      }
    },
    async changeStatus(item) {
      try {
        // Note the use of await here
        let result = await API.post(
          `${endpoints.products.productStatus}/${item.id}`
        );

        // Check the result or handle the response as needed
        if (result.status === 200) {
          // Toggle the status locally in the items array
          const updatedItems = this.items.map((product) => {
            if (product.id === item.id) {
              product.status =
                product.status === "Active" ? "InActive" : "Active";
            }
            return product;
          });

          // Update the items array with the new data
          this.items = updatedItems;

          // Show success message
          Swal.fire("Success!", "Status successfully changed.", "success");
        } else {
          // Handle other status codes or error conditions
          console.error("Error updating user status:", result);
        }
      } catch (error) {
        // Handle any errors during deletion or data fetching
        console.error("Error updating user status:", error);
        Swal.fire("Error!", "An error occurred during status update.", "error");
      }
    },
    viewMedia(ProductData, id) {
      localStorage.setItem("productDataDetail", JSON.stringify(ProductData));
      // this.$store.commit('setProductDetail', ProductData);
      console.log("all_data:", ProductData);
      console.log("View media with ID:", ProductData.id);
      console.log("Route ID:", ProductData.id);
      console.log("Route Title:", ProductData.ProductName);
      // perform the necessary actions with ProductData and id
      this.$router.push({
        name: "product-data",
        params: { id: ProductData.id, data: ProductData },
      });
    },

    // openModal(videoUrl) {
    //   this.videoSource = videoUrl;
    //   this.isModalOpen = true;
    // },
    // closeModal() {
    //   this.isModalOpen = false;
    // },
    // view(itemId) {
    //   console.log(itemId);
    // },
    async deleteItem(itemId) {
      console.log(itemId);
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          // Perform the deletion operation
          await this.deleteProduct(itemId);
          // Show success message
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          // If the deletion is successful, fetch updated data
          await this.fetchProducts();

          // Update the component's data with the latest data
          this.items = [];
          this.getProducts.length > 0
            ? this.setItems(this.getProducts)
            : (this.noItems = "No Product Found.");
        } catch (error) {
          // Handle any errors during deletion or data fetching
          console.error("Error deleting item or fetching data:", error);
          Swal.fire("Error!", "An error occurred during deletion.", "error");
        }
      }
    },

    addProductModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addProductName = item.product_name;
      this.addUsage = item.usage;
      this.addTitle = item.title;
      this.addDescription1 = item.description1;
      this.addDescription2 = item.description2;
      this.addDescription3 = item.description3;
      this.addDescription4 = item.description4;
      this.addDescription5 = item.description5;
      this.addFile = null;
      this.addProductModel = true;
    },

    async submitAddForm() {
      try {
        const addFormData = new FormData();
        addFormData.append("product_name", this.addProductName);
        addFormData.append("usage", this.addUsage);
        addFormData.append("title", this.addTitle);
        addFormData.append("description1", this.addDescription1);
        addFormData.append("description2", this.addDescription2);
        addFormData.append("description3", this.addDescription3);
        addFormData.append("description4", this.addDescription4);
        addFormData.append("description5", this.addDescription5);
        addFormData.append("product_type", this.selectedOption);
        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(
          endpoints.products.addProduct,
          addFormData
        );

        if (result.status === 200) {
          this.addProductModel = false; // Close the modal after success

          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated product
          await this.fetchProducts();

          // Update the component's data with the latest data
          this.getProducts.length > 0
            ? this.setItems(this.getProducts)
            : (this.noItems = "No Product Found.");

          Swal.fire("Success!", "Product successfully added.", "success");
        }
      } catch (error) {
        // Handle error
        console.error("Error adding video:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding video",
        });
      }
    },
  },
  async mounted() {
    await this.fetchProducts();
    console.log("all products", this.getProducts.length);
    this.getProducts.length > 0
      ? this.setItems(this.getProducts)
      : (this.noItems = "No Product Found.");
  },
};
</script>
<style scoped>
.btn-success:not(.btn-light):focus,
.btn-success:not(.btn-light):active {
  background: red;
  border-color: orange;
}
.modal video {
  width: 100%;
  height: 100%;
}
.modal {
  display: block;
  position: fixed;
  width: 50%;
  height: 70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  z-index: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.orange-button {
  background-color: red;
  border-color: orange;
  color: white;
}
</style>
