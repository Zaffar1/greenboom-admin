<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Perfect Sales Pitch List</h3>
      <!-- <router-link :to="{ name: 'add-training' }"> -->
      <b-button
        @click="addTrainingModal"
        variant="success"
        class="mr-2 orange-button btn-secondary"
      >
        <i class="mdi mdi-plus"></i> Add Perfect Sale
      </b-button>
      <!-- </router-link> -->
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
                placeholder="Search Perfect Sale Call"
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
                <!-- <img :src="data.item.profile" class="mr-2" alt="image" /> -->
                {{ data.item.title }}
              </template>

              <!-- when no item found -->
              <template #empty="">
                <p class="text-muted text-center">{{ noItems }}</p>
              </template>

              <!-- status -->
              <template #cell(status)="data">
                <!-- <span v-html="data.value"></span> -->
                <toggle-button
                  @change="changeStatus(data.item)"
                  :value="data.item.status == 'Active'"
                />
              </template>
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
                <i
                  v-b-modal.modallg
                  @click="openEditModal(data.item)"
                  :ref="'btn' + data.index"
                  class="mr-2 mdi mdi-pencil orange-button icon-sm p-2 rounded"
                ></i>
                <i
                  @click="deleteItem(data.item.id)"
                  :ref="'btnDelete' + data.index"
                  class="mr-2 mdi orange-button mdi-delete icon-sm p-2 rounded"
                ></i>
                <span v-html="data.value"></span>
              </template>
              <template #cell(PerfectSaleMedia)="data">
                <button
                  @click="viewMedia(data.item.PerfectSaleMedia)"
                  class="btn btn-secondary orange-button"
                >
                  <i class="mr-2 mdi mdi-eye icon-sm orange-button"></i>View
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
    <b-modal v-model="addModel" title="Add Perfect Sale" hide-footer>
      <form @submit.prevent="submitAddForm">
        <b-form-group label="Title" label-for="editInputTitle">
          <b-form-input
            v-model="addTitle"
            id="editInputTitle"
            required
          ></b-form-input>
        </b-form-group>
        <!-- You can add more fields as needed -->

        <b-button
          type="submit"
          variant="success"
          class="orange-button popUp"
          :disabled="isLoading"
        >
          {{ isLoading ? "Adding..." : "Add" }}
        </b-button>
      </form>
    </b-modal>
    <!-- Modal for editing video -->
    <b-modal v-model="showEditModal" title="Edit Perfect Sale" hide-footer>
      <form @submit.prevent="submitEditForm">
        <b-form-group label="Title" label-for="editInputTitle">
          <b-form-input
            v-model="editedTitle"
            id="editInputTitle"
            required
          ></b-form-input>
        </b-form-group>
        <b-button
          type="submit"
          variant="success"
          class="orange-button popUp"
          :disabled="isLoading"
          >{{ isLoading ? "Updating..." : "Update" }}</b-button
        >
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
      isLoading: false,
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
      addModel: false,
      showEditModal: false,
      editedTitle: "",
      // Add a property to store the current edited item
      editedItem: null,
      addTitle: "",
      fields: [
        { key: "title", sortable: true },
        { key: "status", sortable: true },
        { key: "created_at", sortable: true },
        { key: "PerfectSaleMedia", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getPerfectSales", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  methods: {
    ...mapActions(["fetchPerfectSales", "fetchPerfectSaleId"]),
    generateViewButton(id) {
      return `<button @click="viewMedia(${id})">View</button>`;
    },
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        let baseUrl = "http://localhost:8000/";
        obj.id = element.id;
        obj.title = element.title;
        obj.PerfectSaleMedia = {
          id: element.id,
          title: element.title,
        };
        obj.status = element.status;
        // obj.button = `<button @click="playVideo('${obj.file}')">View</button>`;
        // obj.status = `<label class="badge ${
        //   element.status === "Active" ? "badge-success" : "badge-danger"
        // }">${element.status}</label>`;
        // obj.status_id = element.status?.id;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });

      console.log("mister", this.items);
    },
    /**
     * Opens a modal for adding a new perfect sale entry.
     * Sets initial values and prepares the modal for user input.
     * @param {Object} item - The item to be added as a perfect sale.
     */
    addTrainingModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addModel = true;
      this.isLoading = false;
    },
    /**
     * Submits the form data for adding a new perfect sale entry.
     * Sends a POST request to the server and handles the response accordingly.
     * Displays success or error messages based on the response.
     */
    async submitAddForm() {
      this.isLoading = true;
      const addFormData = new FormData();
      addFormData.append("title", this.addTitle);

      try {
        const result = await API.post(
          endpoints.perfectSales.addPerfectSale,
          addFormData
        );

        if (result.status === 200) {
          this.addModel = false; // Close the modal after success
          this.isLoading = false;
          // Fetch updated training data
          await this.fetchPerfectSales();

          // Update the component's data with the latest data
          this.items = [];
          this.getPerfectSales.length > 0
            ? this.setItems(this.getPerfectSales)
            : (this.noItems = "No Perfect Sale Found.");
          console.log("submit data", this.items);
          Swal.fire("Success!", "Perfect Sale successfully added.", "success");
        }
      } catch (error) {
        // Handle error
        console.error("Error adding training:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding training",
        });
      }
    },
    /**
     * Redirects to the detail page of a specific perfect sale media.
     * @param {Object} PerfectSaleMedia - The media associated with the perfect sale.
     * @param {number} id - The ID of the perfect sale media.
     */
    viewMedia(PerfectSaleMedia, id) {
      console.log("View media with ID:", PerfectSaleMedia.id);
      console.log("Route ID:", PerfectSaleMedia.id);
      // perform the necessary actions with PerfectSaleMedia and id
      this.$router.push({
        name: "perfect-sale-media",
        params: { id: PerfectSaleMedia.id, title: PerfectSaleMedia.title },
      });
    },
    /**
     * Opens a modal for viewing a video.
     * Sets the video source and opens the modal.
     * @param {string} videoUrl - The URL of the video to be viewed.
     */
    openModal(videoUrl) {
      this.videoSource = videoUrl;
      this.isModalOpen = true;
    },
    /**
     * Closes the currently open modal.
     */
    closeModal() {
      this.isModalOpen = false;
    },
    /**
     * Opens a modal for editing a perfect sale entry.
     * Sets initial values and prepares the modal for user input.
     * @param {Object} item - The item to be edited as a perfect sale.
     */
    openEditModal(item) {
      this.isLoading = false;
      // Set initial values when opening the modal
      this.editedItem = item;
      this.editedTitle = item.title;
      this.showEditModal = true;
    },
    /**
     * Submits the form data for editing a perfect sale entry.
     * Sends a POST request to the server with the edited data and handles the response.
     * Closes the edit modal upon success and updates the component's data with the latest entries.
     * @throws {Error} Throws an error if there is an issue editing the perfect sale entry.
     */
    async submitEditForm() {
      this.isLoading = true;
      const editedFormData = new FormData();
      editedFormData.append("title", this.editedTitle);
      // editedFormData.append("description", this.editedDescription);
      if (this.editedFile) {
        editedFormData.append("file", this.editedFile);
      }

      // Add an identifier for the edited item (e.g., item ID) to the form data
      editedFormData.append("id", this.editedItem.id); // Change "itemId" to "id"

      try {
        await API.post(endpoints.perfectSales.editPerfectSale, editedFormData);

        // Handle success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Perfect Sale edited successfully",
        }).then(() => {
          // Redirect to the same page after Swal success message
          // this.$router.go(); // This will reload the current route
        });

        this.showEditModal = false; // Close the modal after success
        await this.fetchPerfectSales();

        // Update the component's data with the latest data
        this.items = [];
        this.getPerfectSales.length > 0
          ? this.setItems(this.getPerfectSales)
          : (this.noItems = "No Perfect Sale Found.");
      } catch (error) {
        // Handle error
        console.error("Error editing training:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while editing the training",
        });
      }
    },
    /**
     * Logs the ID of the perfect sale item being viewed.
     * @param {number} itemId - The ID of the perfect sale item.
     */
    view(itemId) {
      console.log(itemId);
    },

    /**
     * Deletes a perfect sale item based on its ID.
     * Prompts the user for confirmation before deletion.
     * Updates the component's data with the latest entries upon successful deletion.
     * @param {number} itemId - The ID of the perfect sale item to be deleted.
     * @throws {Error} Throws an error if there is an issue deleting the perfect sale item.
     */
    async deleteItem(itemId) {
      console.log(itemId);
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this perfect sale!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          // Perform the deletion operation
          await this.fetchPerfectSaleId(itemId);

          // If the deletion is successful, fetch updated data
          await this.fetchPerfectSales();

          // Update the component's data with the latest data
          this.items = [];
          this.getPerfectSales.length > 0
            ? this.setItems(this.getPerfectSales)
            : (this.noItems = "No Perfect Sale Found.");

          Swal.fire("Deleted!", "Perfect sale has been deleted.", "success");
          // Redirect to the desired route
          // this.$router.push("/user/training-list");
        } catch (error) {
          // Handle any errors during deletion or data fetching
          console.error("Error deleting item or fetching data:", error);
          Swal.fire("Error!", "An error occurred during deletion.", "error");
        }
      }
    },
    /**
     * Changes the status of a perfect sale item (e.g., from active to inactive or vice versa).
     * Sends a POST request to the server to update the status.
     * Updates the local status and displays a success message upon successful status change.
     * @param {Object} item - The perfect sale item whose status is to be changed.
     * @throws {Error} Throws an error if there is an issue changing the status of the perfect sale item.
     */
    async changeStatus(item) {
      try {
        // Note the use of await here
        let result = await API.post(
          `${endpoints.perfectSales.perfectSalesStatus}/${item.id}`
        );

        // Check the result or handle the response as needed
        if (result.status === 200) {
          // Toggle the status locally in the items array
          const updatedItems = this.items.map((training) => {
            if (training.id === item.id) {
              training.status =
                training.status === "Active" ? "InActive" : "Active";
            }
            return training;
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
    // openVideoModal(videoUrl) {
    //   console.log("Opening video modal with URL:", videoUrl);
    //   this.currentVideo = videoUrl;
    //   this.$bvModal.show("video-modal");
    //   console.log("Video modal shown", this.currentVideo);
    // },

    // resetModal() {
    //   this.currentVideo = null;
    // },
  },
  /**
   * Lifecycle hook called when the component is mounted.
   * Fetches the list of perfect sales data and updates the component's data accordingly.
   * If no perfect sales are found, sets a message indicating so.
   */
  async mounted() {
    await this.fetchPerfectSales();
    // console.log("mounted all training", this.getPerfectSales.length);
    console.log("mounted all training", this.getPerfectSales);
    this.getPerfectSales.length > 0
      ? this.setItems(this.getPerfectSales)
      : (this.noItems = "No Perfect Sale Found.");
  },
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
  z-index: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff; /* Change the background color as needed */
  color: #fff; /* Change the text color as needed */
  border: 1px solid #007bff; /* Change the border color as needed */
  padding: 10px 15px; /* Adjust padding as needed */
  border-radius: 5px; /* Adjust border radius as needed */
  cursor: pointer;
  margin-right: 10px; /* Adjust margin as needed */
}

/* Example styles for the icon */
.mdi {
  font-size: 18px; /* Adjust the font size as needed */
}

.orange-button {
  background-color: #ff002d;
  border-color: orange;
  color: white;
}
</style>
