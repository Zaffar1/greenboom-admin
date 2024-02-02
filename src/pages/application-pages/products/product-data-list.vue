<template>
  <section class="tables">
    <button @click="goBack" class="btn btn-primary orange-button">
      <i class="mdi mdi-arrow-left"></i> Go Back
    </button>
    <div class="page-header">
      <h3 class="page-title">
        Product Data of ( {{ this.storedProductData.ProductName }} )
        <!-- Product Data of ( {{ this.$route.params.data.ProductName }} ) -->
        <!-- Product Data -->
      </h3>
      <div>
        <b-button
          @click="addProductModal"
          variant="success"
          class="mr-2 orange-button"
          ><i class="mdi mdi-plus"></i>Add Product Data</b-button
        >
      </div>
    </div>
    <div>
      <h3>Description:</h3>
      {{ this.storedProductData.description }}
      <p
        v-html="breakLineAfterWords(this.storedProductData.description, 15)"
      ></p>
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
                :placeholder="
                  'Search ' + this.storedProductData.ProductName + ' Data'
                "
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
            >
              <template #cell(name)="data">
                <!-- name & profile -->
                <img :src="data.item.profile" class="mr-2" alt="image" />
                {{ data.item.name }}
              </template>

              <!-- when no item found -->
              <template #empty="">
                <p class="text-muted text-center">{{ noItems }}</p>
              </template>

              <!-- status -->
              <template v-slot:cell(status)="data">
                <!-- <span v-html="data.value"></span> -->
                <toggle-button
                  @change="changeStatus(data.item)"
                  :value="data.item.status == 'Active'"
                />
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
                  @click="openEditModal(data.item)"
                  :ref="'btn' + data.index"
                  class="mr-2 mdi mdi-pencil text-muted icon-sm"
                ></i> -->
                <i
                  @click="deleteItem(data.item.id)"
                  :ref="'btnDelete' + data.index"
                  class="mr-2 mdi orange-button mdi-delete icon-sm p-2 rounded"
                ></i>
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(viewDetail)="data">
                <div>
                  <button
                    @click="viewDetails(data.item)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-eye"></i> View
                  </button>
                </div>
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

    <b-modal v-model="showDetailsModal" title="Product Details" hide-footer>
      <!-- Display product details inside the modal -->
      <div v-if="selectedProductData" class="details-modal-content">
        <!-- You can customize the layout based on your data structure -->
        <div class="detail-row">
          <label><strong>Product Title:</strong></label>
          <span>{{ this.storedProductData.title }}</span>
        </div>
        <div class="detail-row">
          <label><strong>SkuNum:</strong></label>
          <span>{{ selectedProductData.sku_num }}</span>
        </div>
        <div class="detail-row">
          <label><strong>Size:</strong></label>
          <span>{{ selectedProductData.size }}</span>
        </div>
        <div class="detail-row">
          <label><strong>Dimensions:</strong></label>
          <span>{{ selectedProductData.dimensions }}</span>
        </div>
        <!-- <div class="detail-row">
          <label
            ><strong>Absorbency/{{ selectedProductData.case }}:</strong></label
          >
          <span
            >{{ selectedProductData.Absorbency }}/{{
              selectedProductData.case
            }}</span
          >
        </div> -->
        <div class="detail-row">
          <label><strong>Qty/Case:</strong></label>
          <span
            >{{ selectedProductData.qty_case }}/{{
              selectedProductData.qty_case
            }}</span
          >
        </div>
        <div class="detail-row">
          <label><strong>Added Remediation Material:</strong></label>
          <span>{{ selectedProductData.added_remediation_material }}</span>
        </div>
        <div class="detail-row">
          <label><strong>Product Dimensions (LHW):</strong></label>
          <span>{{ selectedProductData.product_dimensions_size }}</span>
        </div>
        <div class="detail-row">
          <label><strong>Product Dimensions (LHW):</strong></label>
          <span>{{ selectedProductData.product_dimensions_cm }}</span>
        </div>
        <div class="detail-row">
          <label><strong>Packaging Dimensions (LHW):</strong></label>
          <span>{{ selectedProductData.packaging_dimensions_size }}</span>
        </div>
        <div class="detail-row">
          <label><strong>Packaging Dimensions (LHW):</strong></label>
          <span>{{ selectedProductData.packaging_dimensions_cm }}</span>
        </div>
        <div class="detail-row">
          <label><strong>Weight/Product</strong></label>
          <span
            >{{ selectedProductData.weight_product }}/{{
              selectedProductData.product
            }}</span
          >
        </div>
        <!-- <div class="detail-row">
          <label><strong>Product:</strong></label>
          <span>{{ selectedProductData.product }}</span>
        </div> -->

        <!-- Add more details as needed -->
      </div>
      <p v-else>No product details available.</p>
    </b-modal>

    <div v-if="isModalOpen" class="modal">
      <span @click="closeModal" class="close">&times;</span>
      <video :src="videoSource" controls></video>
      <p v-if="!videoSource">No video source provided</p>
    </div>

    <b-modal v-model="addProductModel" title="Add Product Data" hide-footer>
      <form @submit.prevent="submitAddForm">
        <b-form-group label="Sku Num" label-for="editInputSku">
          <b-form-input
            v-model="addSkuNum"
            id="editInputSku"
            placeholder="Type Sku Num"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Title Remediation" label-for="editInputSku">
          <b-form-input
            v-model="addTitleRemediation"
            id="editInputSku1"
            placeholder="Type title remediation"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Sub Description" label-for="editInputTitle">
          <b-form-input
            v-model="addSubDescription"
            id="editInputTitle"
            placeholder="Type sub description (comma-separated)"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Sku Rem" label-for="editInputSku">
          <b-form-input
            v-model="addSkuRem"
            id="editInputSku2"
            placeholder="Type sku remediation"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Size" label-for="editInputSize">
          <b-form-input
            v-model="addSize"
            id="editInputSize"
            placeholder="Type Size"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Dimensions" label-for="editInputDimensions">
          <b-form-input
            v-model="addDimensions"
            id="editInputDimensions"
            placeholder="Type Dimensions"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Absorbency Bag" label-for="editInputDimensions">
          <b-form-input
            v-model="addAbsorbencyBag"
            id="editInputDimensions"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Absorbency Drum" label-for="editInputDimensions">
          <b-form-input
            v-model="addAbsorbencyDrum"
            id="editInputDimensions"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Absorbency Pillow" label-for="editInputDimensions">
          <b-form-input
            v-model="addAbsorbencyPillow"
            id="editInputDimensions"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Absorbency Sock" label-for="editInputDimensions">
          <b-form-input
            v-model="addAbsorbencySock"
            id="editInputDimensions"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Absorbency Boom" label-for="editInputDimensions">
          <b-form-input
            v-model="addAbsorbencyBoom"
            id="editInputDimensions"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Absorbency Mat" label-for="editInputDimensions">
          <b-form-input
            v-model="addAbsorbencyMat"
            id="editInputDimensions"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Absorbency Kit" label-for="editInputDimensions">
          <b-form-input
            v-model="addAbsorbencyKit"
            id="editInputDimensions"
            placeholder="Optional"
          ></b-form-input>
        </b-form-group>
        <!-- <b-form-group label="Select Absorbency" label-for="selectOption1">
          <b-form-select
            v-model="selectedOption1"
            id="selectOption1"
            :options="selectOptions1"
            
          ></b-form-select>
        </b-form-group> -->
        <b-form-group label="Capacity" label-for="editInputQty">
          <b-form-input
            v-model="addCapacity"
            id="editInputQty"
            placeholder="Type capacity"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Qty Case" label-for="editInputQty">
          <b-form-input
            v-model="addQtyCase"
            id="editInputQty"
            placeholder="Type qty case"
          ></b-form-input>
        </b-form-group>
        <!-- <b-form-group label="Case" label-for="editInputCase">
          <b-form-input
            v-model="addCase"
            id="editInputCase"
            
          ></b-form-input>
        </b-form-group> -->
        <b-form-group
          label="Select Added Remediation Material"
          label-for="selectOption"
        >
          <b-form-select
            v-model="selectedOption"
            id="selectOption"
            :options="selectOptions"
          ></b-form-select>
        </b-form-group>
        <b-form-group
          label="Product Dimensions(LHW) Size"
          label-for="editInputProductDimensionsSize"
        >
          <b-form-input
            v-model="addProductDimensionsSize"
            id="editInputProductDimensionsSize"
            placeholder="Type product dimension size"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Product Dimensions(LHW) Cm"
          label-for="editInputProductDimensionsCm"
        >
          <b-form-input
            v-model="addProductDimensionsCm"
            id="editInputProductDimensionsCm"
            placeholder="Type product dimension cm"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Packaging Dimensions(LHW) Size"
          label-for="editInputPackagingDimensionsSize"
        >
          <b-form-input
            v-model="addPackagingDimensionsSize"
            id="editInputPackagingDimensionsSize"
            placeholder="Type packaging dimension size"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Packaging Dimensions(LHW) Cm"
          label-for="editInputPackagingDimensionsCm"
        >
          <b-form-input
            v-model="addPackagingDimensionsCm"
            id="editInputPackagingDimensionsCm"
            placeholder="Type packaging dimension cm"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Weight Product" label-for="editInputWeight">
          <b-form-input
            v-model="addWeightProduct"
            id="editInputWeight"
            placeholder="Type wight product"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Total Weight Product" label-for="editInputWeight">
          <b-form-input
            v-model="addTotalWeightProduct"
            id="editInputWeight"
            placeholder="Type total weight product"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Total Weight Case" label-for="editInputWeight">
          <b-form-input
            v-model="addTotalWeightCase"
            id="editInputWeight"
            placeholder="Type total weight case"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Total Weight Kit" label-for="editInputWeight">
          <b-form-input
            v-model="addTotalWeightKit"
            id="editInputWeight"
            placeholder="Type total weight kit"
          ></b-form-input>
        </b-form-group>

        <!-- <b-form-group label="Product" label-for="editInputProduct">
          <b-form-input
            v-model="addProduct"
            id="editInputProduct"
            
          ></b-form-input>
        </b-form-group> -->

        <b-button type="submit" variant="success" class="orange-button"
          >Save Changes</b-button
        >
      </form>
    </b-modal>

    <!-- Modal for perfect sale media -->
    <b-modal
      v-model="showEditModal"
      title="Edit Perfect Sale Media"
      hide-footer
    >
      <form @submit.prevent="submitEditForm">
        <b-form-group label="Title" label-for="editInputTitle">
          <b-form-input
            v-model="editedTitle"
            id="editInputTitle"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Upload file" label-for="editInputFile">
          <b-form-file
            v-model="editedFile"
            id="editInputFile"
            :state="Boolean(editedFile)"
            placeholder="Choose a file..."
          ></b-form-file>
        </b-form-group>
        <!-- You can add more fields as needed -->

        <b-button type="submit" variant="success">Save Changes</b-button>
      </form>
    </b-modal>
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
  computed: {
    isScriptsTitle() {
      return this.$route.params.title === "scripts";
    },
    // productDetail() {
    //   return this.$store.getters.getProductDetail;
    // },
  },
  data: function () {
    return {
      isScriptsTitle: true,
      isModalOpen: false,
      videoSource: "", // Set a default video source
      sortBy: "name",
      perPage: 10,
      currentPage: 1,
      sortDesc: false,
      sortByFormatted: true,
      filterByFormatted: true,
      filter: "",
      sortable: true,
      addProductModel: false,
      addTitle: "",
      addSize: "",
      addAbsorbencyBag: "",
      addAbsorbencyDrum: "",
      addAbsorbencyPillow: "",
      addAbsorbencySock: "",
      addAbsorbencyBoom: "",
      addAbsorbencyMat: "",
      addAbsorbencyKit: "",
      addDimensions: "",
      addPackagingDimensionsCm: "",
      addPackagingDimensionsSize: "",
      addProductDimensionsCm: "",
      addProductDimensionsSize: "",
      addQtyCase: "",
      addCapacity: "",
      addWeightProduct: "",
      addTotalWeightProduct: "",
      addTotalWeightCase: "",
      addTotalWeightKit: "",
      addProduct: "",
      addSkuNum: "",
      addSkuRem: "",
      addTitleRemediation: "",
      addSubDescription: "",
      addFile: null,
      showEditModal: false,
      showDetailsModal: false,
      editedTitle: "",
      editedFile: null,
      storedProductData: JSON.parse(localStorage.getItem("productDataDetail")),
      selectedProductData: "",
      // Add a property to store the current edited item
      editedItem: null,
      selectedOption: null, // Add a data property for the selected option
      selectedOption1: null,
      selectOptions: [
        // Define the options for the select field
        { value: "yes", text: "Yes" },
        { value: "no", text: "No" },
        // Add more options as needed
      ],
      selectOptions1: [
        // Define the options for the select field
        { value: "absorbency_bag", text: "Absorbency Bag" },
        { value: "absorbency_drum", text: "Absorbency Drum" },
        { value: "pillow", text: "Pillow" },
        { value: "mat", text: "Mat" },
        { value: "boom", text: "Boom" },
        { value: "sock", text: "Sock" },
        // Add more options as needed
      ],
      fields: [
        { key: "sku_num", sortable: true },
        // { key: "product_name", sortable: true },
        // { key: "title", sortable: true },
        { key: "size", sortable: true },
        { key: "dimensions", sortable: true },
        // { key: "Absorbency", sortable: true },
        // { key: "qty/case", sortable: true },
        // { key: "weight_product", sortable: true },
        // { key: "product", sortable: true },
        { key: "viewDetail", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getProductData", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  created() {
    // Access the ID from the route parameters
    const id = this.$route.params.id;
    const title = this.$route.params.title;
    console.log(this.$route.params.title);
    // Call the fetchDataById method with the ID
    // this.fetchDataById(id);
  },
  methods: {
    ...mapActions(["fetchProductData"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        // let baseUrl = "http://localhost:8000/";
        let baseUrl = "https://virtualrealitycreators.com/green-boom/";
        // let baseUrl = "http://18.224.159.123/green-boom/";
        obj.id = element.id;
        obj.sku_num = element.sku_num;
        obj.size = element.size;
        // obj.file = baseUrl.concat(element.file); // Assuming element.file is the correct property for the file path
        obj.sku_num = element.sku_num; // Assuming element.file_type is the correct property for the file type
        obj.dimensions = element.dimensions;
        obj.AbsorbencyBag = element.absorbency_bag;
        obj.AbsorbencyDrum = element.absorbency_drum;
        obj.AbsorbencyPillow = element.absorbency_pillow;
        obj.AbsorbencyBoom = element.absorbency_boom;
        obj.AbsorbencySock = element.absorbency_sock;
        obj.AbsorbencyMat = element.absorbency_mat;
        obj.AbsorbencyKit = element.absorbency_kit;
        obj.capacity = element.capacity;
        obj.qty_case = element.qty_case;
        obj.case = element.case;
        obj.added_remediation_material = element.added_remediation_material;
        obj.packaging_dimensions_cm = element.packaging_dimensions_cm;
        obj.packaging_dimensions_size = element.packaging_dimensions_size;
        obj.product_dimensions_cm = element.product_dimensions_cm;
        obj.product_dimensions_size = element.product_dimensions_size;
        obj.weight_product = element.weight_product;
        obj.product = element.product;
        obj.product_id = element.product_id;
        // obj.status = `<label class="badge ${
        //   element.status === "Active" ? "badge-success" : "badge-danger"
        // }">${element.status}</label>`;
        // obj.role_id = element.role?.id;
        // obj.status_id = element.status?.id;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });
    },
    breakLineAfterWords(text, words) {
      if (!text) return "";
      const wordArray = text.split(" ");
      const resultArray = [];
      for (let i = 0; i < wordArray.length; i += words) {
        resultArray.push(wordArray.slice(i, i + words).join(" "));
      }
      return resultArray.join("<br>");
    },
    //////// View in modal Start
    // viewDetails(item) {
    //   // Set the selected product data
    //   this.selectedProductData = item;
    //   console.log("all_data", this.selectedProductData);
    //   // Open the details modal
    //   this.showDetailsModal = true;
    // },
    ////// End
    viewDetails(item) {
      // console.log("item data", item);
      console.log("product_id", item.product_id);
      // console.log("id", item.id);
      this.$router.push({
        name: "product-detail",
        params: { id: item.product_id, size: item.size },
      });
    },

    async changeStatus(item) {
      try {
        // Note the use of await here
        let result = await API.post(
          `${endpoints.perfectSales.perfectSaleMediaStatus}/${item.id}`
        );

        // Check the result or handle the response as needed
        if (result.status === 200) {
          // Toggle the status locally in the items array
          const updatedItems = this.items.map((perfectSale) => {
            if (perfectSale.id === item.id) {
              perfectSale.status =
                perfectSale.status === "Active" ? "InActive" : "Active";
            }
            return perfectSale;
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

    openModal(videoUrl) {
      console.log(videoUrl);
      this.videoSource = videoUrl;
      this.isModalOpen = true;
    },
    addProductModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      //   this.addTitle = item.title;
      this.addSize = item.size;
      this.addSkuNum = item.sku_num;
      this.addSkuRem = item.sku_rem;
      this.addTitleRemediation = item.title_remediation;
      this.addSubDescription = item.sub_description;
      this.addDimensions = item.dimensions;
      this.addAbsorbencyBag = item.AbsorbencyBag;
      this.addAbsorbencyDrum = item.AbsorbencyDrum;
      this.addAbsorbencyPillow = item.AbsorbencyPillow;
      this.addAbsorbencySock = item.AbsorbencySock;
      this.addAbsorbencyBoom = item.AbsorbencyBoom;
      this.addAbsorbencyMat = item.AbsorbencyMat;
      this.addAbsorbencyKit = item.AbsorbencyKit;
      this.addPackagingDimensionsCm = item.packaging_dimensions_cm;
      this.addPackagingDimensionsSize = item.packaging_dimensions_size;
      this.addProductDimensionsCm = item.product_dimensions_cm;
      this.addProductDimensionsSize = item.product_dimensions_size;
      this.addQtyCase = item.qty_case;
      this.addCapacity = item.capacity;
      this.addWeightProduct = item.weight_product;
      this.addTotalWeightProduct = item.total_weight_product;
      this.addTotalWeightCase = item.total_weight_case;
      this.addTotalWeightKit = item.total_weight_kit;
      // this.addProduct = item.product;
      //   this.addFile = null;
      this.addProductModel = true;
    },

    openEditModal(item) {
      // Set initial values when opening the modal
      this.editedItem = item;
      this.editedTitle = item.title;
      this.editedFile = null; // Clear the file input
      this.showEditModal = true;
    },

    async submitAddForm() {
      const addFormData = new FormData();
      addFormData.append("title", this.addTitle);

      try {
        const addFormData = new FormData();
        const product_id = this.$route.params.id;
        const product_type = this.storedProductData.product_type;
        const subDescriptionArray = this.addSubDescription.split(",");
        // console.log("product data after add", product_id);
        addFormData.append("product_id", product_id);
        addFormData.append("size", this.addSize);
        addFormData.append("sku_num", this.addSkuNum);
        addFormData.append("sku_rem", this.addSkuRem);
        addFormData.append("title_remediation", this.addTitleRemediation);
        addFormData.append(
          "sub_description",
          JSON.stringify(subDescriptionArray)
        );
        addFormData.append("dimensions", this.addDimensions);
        addFormData.append("absorbency_bag", this.addAbsorbencyBag);
        addFormData.append("absorbency_drum", this.addAbsorbencyDrum);
        addFormData.append("absorbency_pillow", this.addAbsorbencyPillow);
        addFormData.append("absorbency_sock", this.addAbsorbencySock);
        addFormData.append("absorbency_boom", this.addAbsorbencyBoom);
        addFormData.append("absorbency_mat", this.addAbsorbencyMat);
        addFormData.append("absorbency_kit", this.addAbsorbencyKit);
        addFormData.append(
          "product_dimensions(LHW)1",
          this.addProductDimensionsSize
        );
        addFormData.append(
          "product_dimensions(LHW)2",
          this.addProductDimensionsCm
        );
        addFormData.append(
          "packaging_dimensions(LHW)1",
          this.addPackagingDimensionsSize
        );
        addFormData.append(
          "packaging_dimensions(LHW)2",
          this.addPackagingDimensionsCm
        );
        addFormData.append("added_remediation_material", this.selectedOption);
        // addFormData.append("case_data", this.selectedOption1);
        addFormData.append("qty_case", this.addQtyCase);
        addFormData.append("capacity", this.addCapacity);
        addFormData.append("weight_product", this.addWeightProduct);
        addFormData.append("total_weight_product", this.addTotalWeightProduct);
        addFormData.append("total_weight_case", this.addTotalWeightCase);
        addFormData.append("total_weight_kit", this.addTotalWeightKit);
        // addFormData.append("product", this.addProduct);

        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(
          endpoints.products.addProductData,
          addFormData
        );

        if (result.status === 200) {
          this.addProductModel = false; // Close the modal after success

          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated training media data
          const product_id = this.$route.params.id;
          await this.fetchProductData(product_id);

          // Update the component's data with the latest data
          this.getProductData.length > 0
            ? this.setItems(this.getProductData)
            : (this.noItems = "No product data found.");

          Swal.fire("Success!", "Product data successfully added.", "success");
        }
      } catch (error) {
        // Handle error
        console.error("Error adding product data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding data",
        });
      }
    },

    async submitEditForm() {
      const editedFormData = new FormData();
      editedFormData.append("title", this.editedTitle);
      editedFormData.append("product_id", this.$route.params.id);
      if (this.editedFile) {
        editedFormData.append("file", this.editedFile);
      }

      // Add an identifier for the edited item (e.g., item ID) to the form data
      editedFormData.append("id", this.editedItem.id); // Change "itemId" to "id"
      console.log("media id", this.editedItem.id);
      console.log("params id", this.$route.params.id);
      try {
        // Attempt to make the API request
        await API.post(endpoints.perfectSales.editScriptData, editedFormData);

        // Handle success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "product data edited successfully",
        }).then(() => {
          // Redirect to the same page after Swal success message
          // this.$router.go(); // This will reload the current route
        });

        // Close the modal after success
        this.showEditModal = false;

        // Fetch updated training media data
        const product_id = this.$route.params.id;
        await this.fetchProductData(product_id);

        // Update the component's data with the latest data
        this.items = [];
        this.getProductData.length > 0
          ? this.setItems(this.getProductData)
          : (this.noItems = "No product data found.");
      } catch (error) {
        // Handle error
        console.error("Error editing perfect sale data:", error);

        // Display an error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while editing the perfect sale data",
        });
      }
    },

    // openModal(videoUrl) {
    //   // Replace with a known video URL for testing
    //   this.videoSource =
    //     "http://localhost:8000/storage/trainingMedia/1701965964.mp4";
    //   this.isModalOpen = true;
    // },
    closeModal() {
      this.isModalOpen = false;
    },
    openPdf(pdfUrl) {
      // Open the PDF file in a new window or tab
      window.open(pdfUrl, "_blank");
    },
    openWord(wordUrl) {
      // Open the WORD file in a new window or tab
      window.open(wordUrl, "_blank");
    },
    openPowerPoint(PowerPointUrl) {
      // Open the POWERPOINT file in a new window or tab
      window.open(PowerPointUrl, "_blank");
    },
    scriptData(Script, id) {
      console.log("View media with ID:", Script.id);
      console.log("Route ID:", Script.id);
      // perform the necessary actions with Script and id
      this.$router.push({
        name: "script-media",
        params: { id: Script.id, title: Script.title },
      });
    },
    deleteItem(itemId) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this product data!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Make an API request to delete the item
            const response = await API.delete(
              `${endpoints.products.deleteProductData}/${itemId}`
            );

            if (response.status === 200) {
              Swal.fire(
                "Deleted!",
                "product data has been deleted.",
                "success"
              );

              // Fetch updated training media data
              const product_id = this.$route.params.id;
              await this.fetchProductData(product_id);

              // Update the component's data with the latest data
              this.items = [];
              this.getProductData.length > 0
                ? this.setItems(this.getProductData)
                : (this.noItems = "No product data found.");

              // Navigate back to the same page
              // this.$router.go();
            } else {
              // Handle other status codes or error conditions
              console.error("Error deleting product data:", response);
              Swal.fire(
                "Error!",
                "An error occurred during deletion.",
                "error"
              );
            }
          } catch (error) {
            // Handle any errors during deletion
            console.error("Error deleting training media:", error);
            Swal.fire("Error!", "An error occurred during deletion.", "error");
          }
        }
      });
    },
    goBack() {
      // Use Vue Router to navigate back to the previous page
      this.$router.go(-1); // This will go back one step in the history
      // Alternatively, you can use this.$router.push('/your-route') to navigate to a specific route
    },
  },
  async mounted() {
    const storedProductData = JSON.parse(
      localStorage.getItem("productDataDetail")
    );
    console.log("Stored Product Data:", storedProductData);
    const id = this.$route.params.id;
    console.log("perfect sale id", id);
    await this.fetchProductData(id);
    this.getProductData.length > 0
      ? this.setItems(this.getProductData)
      : (this.noItems = "No product data found.");
  },
  //   async fetchDataById(id) {
  //     try {×

  //       // Do something with the fetched data, e.g., update component state
  //       //   this.$dataById = data; // Assuming you have a data property to store the fetched data
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   },
};
</script>
<style scoped>
.btn-success:not(.btn-light):focus,
.btn-success:not(.btn-light):active {
  background: #ff002d;
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
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d; /* Change the background color as needed */
  color: #fff; /* Change the text color as needed */
  border: 1px solid #6c757d; /* Change the border color as needed */
  padding: 10px 15px; /* Adjust padding as needed */
  border-radius: 5px; /* Adjust border radius as needed */
  cursor: pointer;
}

/* Example styles for the icon */
.btn-secondary i {
  margin-right: 5px; /* Adjust margin as needed */
}
.btn-primary {
  background-color: #6c757d; /* Change the background color as needed */
  color: #fff; /* Change the text color as needed */
  border: 1px solid #6c757d; /* Change the border color as needed */
  padding: 10px 15px; /* Adjust padding as needed */
  border-radius: 5px; /* Adjust border radius as needed */
  cursor: pointer;
}

/* Example styles for the icon */
.btn-primary i {
  margin-right: 5px; /* Adjust margin as needed */
}

.orange-button {
  background-color: #ff002d;
  border-color: orange;
  color: white;
}

.details-modal-content {
  max-width: 400px; /* Adjust the maximum width as needed */
  margin: auto;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.details-modal-content label {
  font-weight: bold;
}

.details-modal-content span {
  flex: 1;
  margin-left: 10px;
}
</style>
