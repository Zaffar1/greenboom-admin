<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Sales Tips List</h3>
      <b-button @click="addMsdSheetModal" variant="success" class="mr-2">
        <i class="mdi mdi-plus"></i> Add Sales Tip
      </b-button>
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
                placeholder="Search Msds Sheet"
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
                <i
                  v-b-modal.modallg
                  @click="openEditModal(data.item)"
                  :ref="'btn' + data.index"
                  class="mr-2 mdi mdi-pencil text-muted icon-sm"
                ></i>
                <i
                  @click="deleteItem(data.item.id)"
                  :ref="'btnDelete' + data.index"
                  class="mr-2 mdi mdi-delete text-danger icon-sm"
                ></i>
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(Media)="data">
                <div>
                  <button
                    @click="openPdf(data.item.file)"
                    class="btn btn-secondary"
                  >
                    <i class="mdi mdi-file-pdf"></i>Open Pdf
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
    <!-- <div v-if="isModalOpen" class="modal">
        <span @click="closeModal" class="close">&times;</span>
        <video :src="videoSource" controls></video>
        <p v-if="!videoSource">No video source provided</p>
      </div> -->

    <!-- Add Msd Sheet -->
    <b-modal v-model="addMsdModel" title="Add Msd Sheet" hide-footer>
      <form @submit.prevent="submitAddForm">
        <b-form-group label="Title" label-for="editInputTitle">
          <b-form-input
            v-model="addTitle"
            id="editInputTitle"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description" label-for="editInputTitle">
          <b-form-input
            v-model="addDescription"
            id="editInputTitle"
            required
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
        <!-- You can add more fields as needed -->

        <b-button type="submit" variant="success">Save Changes</b-button>
      </form>
    </b-modal>

    <!-- Edit Msd Sheet -->
    <b-modal v-model="showEditModal" title="Edit Msd Sheet" hide-footer>
      <form @submit.prevent="submitEditForm">
        <b-form-group label="Title" label-for="editInputTitle">
          <b-form-input
            v-model="editedTitle"
            id="editInputTitle"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description" label-for="editInputDescription">
          <b-form-input
            v-model="editedDescription"
            id="editInputDescription"
            required
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
        <!-- You can edit more fields as needed -->

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
  data: function () {
    return {
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
      addMsdModel: false,
      showEditModal: false,
      addTitle: "",
      addDescription: "",
      addFile: null,
      // Add a property to store the current edited item
      // addItem: null,
      editedTitle: "",
      editedDescription: "",
      editedFile: null,
      fields: [
        { key: "title", sortable: true },
        { key: "description", sortable: true },
        { key: "status", sortable: true },
        { key: "created_at", sortable: true },
        { key: "Media", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },

  // Maps getters from Vuex store
  computed: {
    ...mapGetters(["getSalesTips", "getDefaultImage", "getImageUrl"]),
    // Computes the number of rows in the items array
    rows() {
      return this.items.length;
    },
  },

  created() {
    // Access the ID from the route parameters
    const id = this.$route.params.id;

    // Call the fetchDataById method with the ID
    this.fetchDataById(id);
  },
  methods: {
    // Maps actions from Vuex store
    ...mapActions(["fetchSalesTips"]),
    setItems(data) {
      // Iterate over each element in the data array
      data.forEach((element) => {
        let obj = {};
        let baseUrl = "http://localhost:8000/";
        obj.id = element.id;
        obj.title = element.title;
        obj.file = baseUrl.concat(element.file); // Assuming element.file is the correct property for the file path
        obj.description = element.description; // Assuming element.file_type is the correct property for the file type
        // obj.status = `<label class="badge ${
        //   element.status === "Active" ? "badge-success" : "badge-danger"
        // }">${element.status}</label>`;
        obj.status = element.status;
        obj.role_id = element.role?.id;
        obj.status_id = element.status?.id;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });
    },

    // Opens modal to play video
    openModal(videoUrl) {
      console.log(videoUrl);
      this.videoSource = videoUrl;
      this.isModalOpen = true;
    },

    // Closes modal
    closeModal() {
      this.isModalOpen = false;
    },

    // Opens PDF file in new window/tab
    openPdf(pdfUrl) {
      // Open the PDF file in a new window or tab
      window.open(pdfUrl, "_blank");
    },

    // Initializes modal to add MSD sheet
    addMsdSheetModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addDescription = item.description;
      this.addFile = null;
      this.addMsdModel = true;
    },

    // Submits form to add MSD sheet
    async submitAddForm() {
      try {
        const addFormData = new FormData();
        addFormData.append("title", this.addTitle);
        addFormData.append("description", this.addDescription);
        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(
          endpoints.salesTips.addSalesTip,
          addFormData
        );

        if (result.status === 200) {
          this.addMsdModel = false; // Close the modal after success

          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated msd sheet data
          await this.fetchSalesTips();

          // Update the component's data with the latest data
          this.getSalesTips.length > 0
            ? this.setItems(this.getSalesTips)
            : (this.noItems = "No sales tips found.");

          Swal.fire("Success!", "Sales Tip successfully added.", "success");
        }
      } catch (error) {
        // Handle error
        console.error("Error adding sales tip:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding sales tip",
        });
      }
    },

    // Opens modal to edit sales tip
    openEditModal(item) {
      // Set initial values when opening the modal
      this.editedItem = item;
      this.editedTitle = item.title;
      this.editedDescription = item.description;
      this.editedFile = null; // Clear the file input
      this.showEditModal = true;
    },

    // Submits form to edit sales tip
    async submitEditForm() {
      const editedFormData = new FormData();
      editedFormData.append("title", this.editedTitle);
      editedFormData.append("description", this.editedDescription);
      if (this.editedFile) {
        editedFormData.append("file", this.editedFile);
      }

      // Add an identifier for the edited item (e.g., item ID) to the form data
      editedFormData.append("id", this.editedItem.id); // Change "itemId" to "id"

      try {
        await API.post(endpoints.salesTips.editSalesTip, editedFormData);

        // Handle success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "SalesTip edited successfully",
        }).then(() => {
          // Redirect to the same page after Swal success message
          // this.$router.go(); // This will reload the current route
        });

        this.showEditModal = false; // Close the modal after success
        await this.fetchSalesTips();

        // Update the component's data with the latest data
        this.items = [];
        this.getSalesTips.length > 0
          ? this.setItems(this.getSalesTips)
          : (this.noItems = "No sales tip.");
      } catch (error) {
        // Handle error
        console.error("Error editing sales tip:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while editing the sales tip",
        });
      }
    },

    /**
     * Asynchronously changes the status of a sales tip item.
     * @param {Object} item - The sales tip item to change status for.
     */
    async changeStatus(item) {
      try {
        // Note the use of await here
        let result = await API.post(
          `${endpoints.salesTips.salesTipStatus}/${item.id}`
        );

        // Check the result or handle the response as needed
        if (result.status === 200) {
          // Toggle the status locally in the items array
          const updatedItems = this.items.map((salesTip) => {
            if (salesTip.id === item.id) {
              salesTip.status =
                salesTip.status === "Active" ? "InActive" : "Active";
            }
            return salesTip;
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

    /**
     * Logs the itemId to the console.
     * @param {string} itemId - The ID of the item to view.
     */
    view(itemId) {
      console.log(itemId);
    },

    /**
     * Deletes a sales tip item.
     * @param {string} itemId - The ID of the sales tip item to delete.
     */
    deleteItem(itemId) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this sales tip!",
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
              `${endpoints.salesTips.deleteSalesTip}/${itemId}`
            );

            if (response.status === 200) {
              Swal.fire("Deleted!", "Sales Tip has been deleted.", "success");

              // Fetch updated sales tips data
              await this.fetchSalesTips();

              // Update the component's data with the latest data
              this.items = [];
              this.getSalesTips.length > 0
                ? this.setItems(this.getSalesTips)
                : (this.noItems = "No sales tip found.");

              // Navigate back to the same page
              // this.$router.go();
            } else {
              // Handle other status codes or error conditions
              console.error("Error deleting sales tip:", response);
              Swal.fire(
                "Error!",
                "An error occurred during deletion.",
                "error"
              );
            }
          } catch (error) {
            // Handle any errors during deletion
            console.error("Error deleting sales tip:", error);
            Swal.fire("Error!", "An error occurred during deletion.", "error");
          }
        }
      });
    },
  },

  /**
   * Fetches sales tips data upon component mounting.
   */
  async mounted() {
    // const id = this.$route.params.id;
    await this.fetchSalesTips();
    this.getSalesTips.length > 0
      ? this.setItems(this.getSalesTips)
      : (this.noItems = "No sales tips found.");
  },
};
</script>
<style scoped>
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
</style>
