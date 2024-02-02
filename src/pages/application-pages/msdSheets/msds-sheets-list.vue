<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Msds Sheets List</h3>
      <b-button
        @click="addMsdSheetModal"
        variant="success"
        class="mr-2 orange-button"
      >
        <i class="mdi mdi-plus"></i> Add Msds Sheet
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
                <!-- <i
                  v-b-modal.modallg
                  @click="openEditModal(data.item)"
                  :ref="'btn' + data.index"
                  class="mr-2 mdi mdi-pencil btn orange-button icon-sm"
                ></i> -->
                <i
                  @click="deleteItem(data.item.id)"
                  :ref="'btnDelete' + data.index"
                  class="mr-2 mdi orange-button mdi-delete icon-sm p-2 rounded"
                ></i>
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(Media)="data">
                <div>
                  <button
                    @click="openPdf(data.item.file)"
                    class="btn btn-secondary orange-button"
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
            accept=".pdf, .mp4, .doc, .docx, .ppt, .pptx, .xls, .xlsx"
            @change="handleFileChange"
            required
            ref="fileInputRef"
          ></b-form-file>
        </b-form-group>
        <!-- You can add more fields as needed -->

        <b-button
          type="submit"
          variant="success"
          class="orange-button"
          :disabled="isLoading"
        >
          {{ isLoading ? "Uploading..." : "Upload" }}
        </b-button>
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
    ...mapGetters(["getMsdSheets", "getDefaultImage", "getImageUrl"]),
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
    ...mapActions(["fetchMsdSheets"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        // let baseUrl = "http://localhost:8000/";
        let baseUrl = "https://virtualrealitycreators.com/green-boom/";
        // let baseUrl = "http://18.224.159.123/green-boom/";
        obj.id = element.id;
        obj.title = element.title;
        obj.file = baseUrl.concat(element.file); // Assuming element.file is the correct property for the file path
        obj.description = element.description; // Assuming element.file_type is the correct property for the file type
        // obj.status = `<label class="badge ${
        //   element.status === "Active" ? "badge-success" : "badge-danger"
        // }">${element.status}</label>`;
        obj.type = element.file_type;
        obj.status = element.status;
        // obj.role_id = element.role?.id;
        obj.status_id = element.status?.id;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });
    },
    openModal(videoUrl) {
      console.log(videoUrl);
      this.videoSource = videoUrl;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    openPdf(pdfUrl) {
      // Open the PDF file in a new window or tab
      window.open(pdfUrl, "_blank");
    },

    addMsdSheetModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addDescription = item.description;
      this.addFile = null;
      this.addMsdModel = true;
      this.isLoading = false;
    },
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
    resetFileInput() {
      // Reset the file input value to allow re-selection of the same file
      const fileInput =
        this.$refs.fileInputRef.$el.querySelector("input[type='file']");
      fileInput.value = null;
    },
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
          endpoints.msdSheets.addMsdSheet,
          addFormData
        );

        if (result.status === 200) {
          this.addMsdModel = false; // Close the modal after success
          this.isLoading = false;
          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated msd sheet data
          await this.fetchMsdSheets();

          // Update the component's data with the latest data
          this.getMsdSheets.length > 0
            ? this.setItems(this.getMsdSheets)
            : (this.noItems = "No Msds Sheet Found.");

          Swal.fire("Success!", "Msds Sheet successfully added.", "success");
        }
      } catch (error) {
        // Handle error
        console.error("Error adding msds sheet:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding msds sheet",
        });
      }
    },

    openEditModal(item) {
      // Set initial values when opening the modal
      this.editedItem = item;
      this.editedTitle = item.title;
      this.editedDescription = item.description;
      this.editedFile = null; // Clear the file input
      this.showEditModal = true;
    },

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
        await API.post(endpoints.msdSheets.editMsdSheet, editedFormData);

        // Handle success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "MsdSheet edited successfully",
        }).then(() => {
          // Redirect to the same page after Swal success message
          // this.$router.go(); // This will reload the current route
        });

        this.showEditModal = false; // Close the modal after success
        await this.fetchMsdSheets();

        // Update the component's data with the latest data
        this.items = [];
        this.getMsdSheets.length > 0
          ? this.setItems(this.getMsdSheets)
          : (this.noItems = "No MsdSheet Found.");
      } catch (error) {
        // Handle error
        console.error("Error editing MsdSheet:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while editing the msd sheet",
        });
      }
    },

    async changeStatus(item) {
      try {
        // Note the use of await here
        let result = await API.post(
          `${endpoints.msdSheets.msdSheetStatus}/${item.id}`
        );

        // Check the result or handle the response as needed
        if (result.status === 200) {
          // Toggle the status locally in the items array
          const updatedItems = this.items.map((msdSheet) => {
            if (msdSheet.id === item.id) {
              msdSheet.status =
                msdSheet.status === "Active" ? "InActive" : "Active";
            }
            return msdSheet;
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

    view(itemId) {
      console.log(itemId);
    },
    deleteItem(itemId) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this msd sheet!",
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
              `${endpoints.msdSheets.deleteMsdSheet}/${itemId}`
            );

            if (response.status === 200) {
              Swal.fire("Deleted!", "MsdSheet has been deleted.", "success");

              // Fetch updated msds sheet data
              await this.fetchMsdSheets();

              // Update the component's data with the latest data
              this.items = [];
              this.getMsdSheets.length > 0
                ? this.setItems(this.getMsdSheets)
                : (this.noItems = "No MsdSheets Found.");

              // Navigate back to the same page
              // this.$router.go();
            } else {
              // Handle other status codes or error conditions
              console.error("Error deleting msd sheet:", response);
              Swal.fire(
                "Error!",
                "An error occurred during deletion.",
                "error"
              );
            }
          } catch (error) {
            // Handle any errors during deletion
            console.error("Error deleting msd sheet:", error);
            Swal.fire("Error!", "An error occurred during deletion.", "error");
          }
        }
      });
    },
  },
  async mounted() {
    // const id = this.$route.params.id;
    await this.fetchMsdSheets();
    this.getMsdSheets.length > 0
      ? this.setItems(this.getMsdSheets)
      : (this.noItems = "No MsdSheet Found.");
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
