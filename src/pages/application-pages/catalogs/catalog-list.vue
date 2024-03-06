<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Catalogs & Brouchers List</h3>
      <b-button
        @click="addCatalogModal"
        variant="success"
        class="mr-2 orange-button btn-secondary"
      >
        <i class="mdi mdi-plus"></i> Add Catalog
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
                placeholder="Search Catalog & Broucher"
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
                  class="mr-2 mdi mdi-pencil orange-button icon-sm p-2 rounded"
                ></i>
                <i
                  @click="deleteItem(data.item.id)"
                  :ref="'btnDelete' + data.index"
                  class="mr-2 mdi orange-button mdi-delete icon-sm p-2 rounded"
                ></i>
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(Media)="data">
                <div>
                  <!-- <button
                    @click="openPdf(data.item.file)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-file-pdf"></i>Open Pdf
                  </button> -->
                  <button
                    v-if="data.item.type === 'pdf'"
                    @click="openPdf(data.item.file)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-file-pdf"></i> Open PDF
                  </button>
                  <button
                    v-else-if="['excel'].includes(data.item.type)"
                    @click="openExcel(data.item.file)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-file-excel"></i> Open Excel
                  </button>
                  <button
                    v-else-if="['word'].includes(data.item.type)"
                    @click="openWord(data.item.file)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-file-word"></i> Open Word
                  </button>

                  <button
                    v-else-if="['ppt'].includes(data.item.type)"
                    @click="openPowerPoint(data.item.file)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-file-powerpoint"></i> Open PowerPoint
                  </button>
                  <span v-else> Unsupported file type </span>
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

    <!-- Add Catalog -->
    <b-modal
      v-model="addCatalogModel"
      title="Add Catalog & Broucher"
      hide-footer
    >
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
            accept=".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx"
            @change="handleFileChange"
            required
            ref="fileInputRef"
          ></b-form-file>
        </b-form-group>
        <!-- You can add more fields as needed -->

        <b-button
          type="submit"
          variant="success"
          class="orange-button popUp"
          :disabled="isLoading"
        >
          {{ isLoading ? "Uploading..." : "Upload" }}
        </b-button>
      </form>
    </b-modal>

    <!-- Edit Catalog -->
    <b-modal
      v-model="showEditModal"
      title="Edit Catalog & Broucher"
      hide-footer
    >
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
            accept=".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx"
            @change="handleFileChange2"
            ref="fileInputRef2"
          ></b-form-file>
        </b-form-group>
        <!-- You can edit more fields as needed -->

        <b-button
          type="submit"
          variant="success"
          class="orange-button popUp"
          :disabled="isLoading"
        >
          {{ isLoading ? "Updating..." : "Update" }}</b-button
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
      addCatalogModel: false,
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
        { key: "type", sortable: true },
        { key: "status", sortable: true },
        { key: "created_at", sortable: true },
        { key: "Media", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getCatalogs", "getDefaultImage", "getImageUrl"]),
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
    ...mapActions(["fetchCatalogList"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        // let baseUrl = "http://localhost:8000/";
        // let baseUrl = "https://virtualrealitycreators.com/green-boom/";
        // let baseUrl = "http://18.224.159.123/green-boom/";
        let baseUrl = "https://greenboom-bucket.s3.us-east-2.amazonaws.com/";
        obj.id = element.id;
        obj.title = element.title;
        obj.file = baseUrl.concat(element.file); // Assuming element.file is the correct property for the file path
        obj.description = element.description; // Assuming element.file_type is the correct property for the file type
        // obj.status = `<label class="badge ${
        //   element.status === "Active" ? "badge-success" : "badge-danger"
        // }">${element.status}</label>`;
        obj.type = element.file_type;
        obj.status = element.status;
        obj.role_id = element.role?.id;
        obj.status_id = element.status?.id;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });
    },
    /**
     * Opens a modal to display a video.
     * Sets the video source and opens the modal.
     *
     * @param {string} videoUrl The URL of the video to be displayed.
     */
    openModal(videoUrl) {
      console.log(videoUrl);
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
     * Opens a PDF file in a new window or tab.
     *
     * @param {string} pdfUrl The URL of the PDF file to be opened.
     */
    openPdf(pdfUrl) {
      // Open the PDF file in a new window or tab
      window.open(pdfUrl, "_blank");
    },
    /**
     * Opens an Excel file in a new window or tab.
     *
     * @param {string} excelUrl The URL of the Excel file to be opened.
     */
    openExcel(excelUrl) {
      // Open the EXCEL file in a new window or tab
      window.open(excelUrl, "_blank");
    },
    /**
     * Opens a Word document in a new window or tab.
     *
     * @param {string} wordUrl The URL of the Word document to be opened.
     */
    openWord(wordUrl) {
      // Open the WORD file in a new window or tab
      window.open(wordUrl, "_blank");
    },
    /**
     * Opens a PowerPoint presentation in a new window or tab.
     *
     * @param {string} powerPointUrl The URL of the PowerPoint presentation to be opened.
     */
    openPowerPoint(PowerPointUrl) {
      // Open the POWERPOINT file in a new window or tab
      window.open(PowerPointUrl, "_blank");
    },
    /**
     * Opens a modal to add a new catalog or brochure.
     * Sets initial values and opens the modal.
     *
     * @param {object} item The item to be added.
     */
    addCatalogModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addDescription = item.description;
      this.addFile = null;
      this.addCatalogModel = true;
      this.isLoading = false;
    },
    /**
     * Handles the change event when selecting a file.
     * Validates the file format and displays an error message if invalid.
     */
    handleFileChange() {
      const allowedFormats = [
        "application/pdf", // PDF
        "application/msword", // DOC
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
        "application/vnd.ms-powerpoint", // PPT
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
        "application/vnd.ms-excel", // XLS
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      ];

      const fileInput =
        this.$refs.fileInputRef.$el.querySelector("input[type='file']");
      const selectedFile = fileInput.files[0];

      if (selectedFile) {
        if (!allowedFormats.includes(selectedFile.type)) {
          // Clear the file input and show an error message
          this.addFile = null;
          this.resetFileInput();
          Swal.fire({
            icon: "error",
            title: "Invalid File Format",
            text: "Please select a valid file (pdf, doc, docx, ppt, pptx, xls, xlsx).",
          });
        }
      }
    },
    /**
     * Resets the file input field to allow re-selection of the same file.
     */
    resetFileInput() {
      // Reset the file input value to allow re-selection of the same file
      const fileInput =
        this.$refs.fileInputRef.$el.querySelector("input[type='file']");
      fileInput.value = null;
    },
    /**
     * Handles the change event when selecting a file.
     * Validates the file format and displays an error message if invalid.
     */
    handleFileChange2() {
      const allowedFormats = [
        "application/pdf", // PDF
        "application/msword", // DOC
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
        "application/vnd.ms-powerpoint", // PPT
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
        "application/vnd.ms-excel", // XLS
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      ];

      const fileInput =
        this.$refs.fileInputRef2.$el.querySelector("input[type='file']");
      const selectedFile = fileInput.files[0];

      if (selectedFile) {
        if (!allowedFormats.includes(selectedFile.type)) {
          // Clear the file input and show an error message
          this.editedFile = null;
          this.resetFileInput2();
          Swal.fire({
            icon: "error",
            title: "Invalid File Format",
            text: "Please select a valid file (pdf, doc, docx, ppt, pptx, xls, xlsx).",
          });
        }
      }
    },
    /**
     * Resets the file input field to allow re-selection of the same file.
     */
    resetFileInput2() {
      // Reset the file input value to allow re-selection of the same file
      const fileInput =
        this.$refs.fileInputRef2.$el.querySelector("input[type='file']");
      fileInput.value = null;
    },
    /**
     * Submits the form to add a new catalog or brochure.
     * Sends a request to the API and handles the response.
     */
    async submitAddForm() {
      try {
        this.isLoading = true;
        const addFormData = new FormData();
        addFormData.append("title", this.addTitle);
        addFormData.append("description", this.addDescription);
        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(
          endpoints.catalogs.addCatalog,
          addFormData
        );

        if (result.status === 200) {
          this.addCatalogModel = false; // Close the modal after success
          this.isLoading = false;
          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated msd sheet data
          await this.fetchCatalogList();

          // Update the component's data with the latest data
          this.getCatalogs.length > 0
            ? this.setItems(this.getCatalogs)
            : (this.noItems = "Catalog & Brouchers Found.");

          Swal.fire(
            "Success!",
            "Catalog & Broucher successfully added.",
            "success"
          );
        }
      } catch (error) {
        // Handle error
        console.error("Error adding catalog & broucher:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding catalog & broucher",
        });
      }
    },
    /**
     * Opens a modal to edit an existing catalog or brochure.
     * Sets initial values and opens the modal.
     *
     * @param {object} item The item to be edited.
     */
    openEditModal(item) {
      // Set initial values when opening the modal
      this.editedItem = item;
      this.editedTitle = item.title;
      this.editedDescription = item.description;
      this.editedFile = null; // Clear the file input
      this.showEditModal = true;
      this.isLoading = false;
    },
    /**
     * Submits the form to edit an existing catalog or brochure.
     * Sends a request to the API and handles the response.
     */
    async submitEditForm() {
      // console.log(this.editedItem.id);
      this.isLoading = true;
      const editedFormData = new FormData();
      editedFormData.append("title", this.editedTitle);
      editedFormData.append("description", this.editedDescription);
      if (this.editedFile) {
        editedFormData.append("file", this.editedFile);
      }

      // Add an identifier for the edited item (e.g., item ID) to the form data
      editedFormData.append("id", this.editedItem.id); // Change "itemId" to "id"

      try {
        await API.post(endpoints.catalogs.editCatalog, editedFormData);

        // Handle success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Catalog & Broucher edited successfully",
        }).then(() => {
          // Redirect to the same page after Swal success message
          // this.$router.go(); // This will reload the current route
        });

        this.showEditModal = false; // Close the modal after success
        await this.fetchCatalogList();

        // Update the component's data with the latest data
        this.items = [];
        this.getCatalogs.length > 0
          ? this.setItems(this.getCatalogs)
          : (this.noItems = "No catalog & broucher found.");
      } catch (error) {
        // Handle error
        console.error("Error editing catalog & broucher:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while editing the catalog & broucher",
        });
      }
    },
    /**
     * Changes the status of an item (e.g., catalog or brochure) between Active and Inactive.
     * Sends a request to the API to update the status and updates the local items array accordingly.
     *
     * @param {object} item The item whose status is to be changed.
     */
    async changeStatus(item) {
      try {
        // Note the use of await here
        let result = await API.post(
          `${endpoints.msdSheets.msdSheetStatus}/${item.id}`
        );

        // Check the result or handle the response as needed
        if (result.status === 200) {
          // Toggle the status locally in the items array
          const updatedItems = this.items.map((catalog) => {
            if (catalog.id === item.id) {
              catalog.status =
                catalog.status === "Active" ? "InActive" : "Active";
            }
            return catalog;
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
     * Logs the ID of the item for viewing.
     *
     * @param {number} itemId The ID of the item to view.
     */
    view(itemId) {
      console.log(itemId);
    },
    /**
     * Deletes an item (e.g., catalog or brochure) after confirmation from the user.
     * Sends a request to the API to delete the item and updates the local items array accordingly.
     *
     * @param {number} itemId The ID of the item to delete.
     */
    deleteItem(itemId) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this catalog!",
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
              `${endpoints.catalogs.deleteCatalog}/${itemId}`
            );

            if (response.status === 200) {
              Swal.fire(
                "Deleted!",
                "Catalog & Broucher has been deleted.",
                "success"
              );

              // Fetch updated msds sheet data
              await this.fetchCatalogList();

              // Update the component's data with the latest data
              this.items = [];
              this.getCatalogs.length > 0
                ? this.setItems(this.getCatalogs)
                : (this.noItems = "No catalog & broucher found.");

              // Navigate back to the same page
              // this.$router.go();
            } else {
              // Handle other status codes or error conditions
              console.error("Error deleting catalog & broucher:", response);
              Swal.fire(
                "Error!",
                "An error occurred during deletion.",
                "error"
              );
            }
          } catch (error) {
            // Handle any errors during deletion
            console.error("Error deleting catalog & broucher:", error);
            Swal.fire("Error!", "An error occurred during deletion.", "error");
          }
        }
      });
    },
  },
  /**
   * Lifecycle hook called when the component is mounted.
   * Fetches the catalog list data and sets the component's items accordingly.
   */
  async mounted() {
    // const id = this.$route.params.id;
    await this.fetchCatalogList();
    console.log("hello", this.fetchCatalogList);
    this.getCatalogs.length > 0
      ? this.setItems(this.getCatalogs)
      : (this.noItems = "No catalog & broucher found.");
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
.orange-button {
  background-color: #ff002d;
  border-color: orange;
  color: white;
}
</style>
