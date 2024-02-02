<template>
  <section class="tables">
    <button @click="goBack" class="btn btn-primary orange-button">
      <i class="mdi mdi-arrow-left"></i> Go Back
    </button>
    <div class="page-header">
      <h3 class="page-title">Data of ( {{ this.$route.params.title }} )</h3>
      <div>
        <!-- Conditionally show "Add Script Data" button -->
        <b-button
          v-if="this.$route.params.title === 'Scripts'"
          @click="addScriptModal"
          variant="success"
          class="mr-2 orange-button"
        >
          <i class="mdi mdi-plus"></i>Add Data
        </b-button>
        <b-button
          v-else-if="this.$route.params.title === 'Videos'"
          @click="addVideoModal"
          variant="success"
          class="mr-2 orange-button"
        >
          <i class="mdi mdi-plus"></i>Add Video
        </b-button>
        <b-button
          v-else
          @click="addTrainingModal"
          variant="success"
          class="mr-2 orange-button"
        >
          <i class="mdi mdi-plus"></i>Add Data
        </b-button>
      </div>
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
                :placeholder="'Search ' + this.$route.params.title + ' Data'"
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
              <template v-slot:cell(Media)="data">
                <div>
                  <button
                    v-if="data.item.type === 'video'"
                    @click="openModal(data.item.file)"
                    class="btn btn-primary orange-button"
                  >
                    <i class="mdi mdi-play"></i> Play Video
                  </button>

                  <button
                    v-else-if="isScriptsTitle && data.item.type !== 'pdf'"
                    @click="scriptData(data.item)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-eye"></i> View
                  </button>

                  <button
                    v-else-if="data.item.type === 'pdf'"
                    @click="openPdf(data.item.file)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-file-pdf"></i> Open PDF
                  </button>

                  <button
                    v-else-if="['word'].includes(data.item.type)"
                    @click="openWord(data.item.file)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-file-word"></i> Open Word
                  </button>
                  <button
                    v-else-if="['excel'].includes(data.item.type)"
                    @click="openExcel(data.item.file)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-file-excel"></i> Open Excel
                  </button>
                  <button
                    v-else-if="['ppt'].includes(data.item.type)"
                    @click="openPowerPoint(data.item.file)"
                    class="btn btn-primary orange-button"
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
    <div v-if="isModalOpen" class="modal">
      <span @click="closeModal" class="close">&times;</span>
      <video :src="videoSource" controls></video>
      <p v-if="!videoSource">No video source provided</p>
    </div>

    <div>
      <b-modal
        v-model="addMediaModel"
        title="Add Perfect Sale Media"
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

          <!-- Add a condition to check if the route title is not equal to 'scripts' -->
          <!-- If true, show the 'Upload file' field -->
          <b-form-group label="Upload file" label-for="editInputFile">
            <b-form-file
              v-model="addFile"
              id="editInputFile"
              :state="Boolean(addFile)"
              placeholder="Choose a file..."
              accept=".pdf, .mp4, .mov, .avi, .doc, .docx, .ppt, .pptx, .xls, .xlsx"
              @change="handleFileChange"
              required
              ref="fileInputRef"
            ></b-form-file>
          </b-form-group>

          <b-button
            type="submit"
            variant="success orange-button"
            :disabled="isLoadingAddButton"
          >
            <span v-if="isLoadingAddButton">Uploading...</span>
            <span v-else>Upload</span>
          </b-button>
        </form>
      </b-modal>
    </div>
    <div>
      <b-modal v-model="addVideoModel" title="Add Video" hide-footer>
        <form @submit.prevent="submitVideoForm">
          <b-form-group label="Title" label-for="editInputTitle">
            <b-form-input
              v-model="addTitle"
              id="editInputTitle"
              required
            ></b-form-input>
          </b-form-group>

          <!-- Add a condition to check if the route title is not equal to 'scripts' -->
          <!-- If true, show the 'Upload file' field -->
          <b-form-group label="Upload file" label-for="editInputFile">
            <b-form-file
              v-model="addFile"
              id="editInputFile"
              :state="Boolean(addFile)"
              placeholder="Choose a file..."
              accept=".mp4, .mov, .avi"
              @change="handleVideoFileChange"
              required
              ref="fileInputRef"
            ></b-form-file>
          </b-form-group>

          <b-button
            type="submit"
            variant="success orange-button"
            :disabled="isLoadingAddButton"
          >
            <span v-if="isLoadingAddButton">Uploading...</span>
            <span v-else>Upload</span>
          </b-button>
        </form>
      </b-modal>
    </div>
    <b-modal
      v-model="addScriptModel"
      title="Add Perfect Sale Media"
      hide-footer
    >
      <form @submit.prevent="submitAddScriptForm">
        <b-form-group label="Title" label-for="editInputTitle">
          <b-form-input
            v-model="addTitle"
            id="editInputTitle"
            required
          ></b-form-input>
        </b-form-group>

        <b-button
          type="submit"
          variant="success"
          class="orange-button"
          :disabled="isLoading"
        >
          {{ isLoading ? "Adding..." : "Add" }}
        </b-button>
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
    isVideosTitle() {
      return this.$route.params.title === "videos";
    },
    ...mapGetters(["getPerfectSaleMedia", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  data: function () {
    return {
      isLoading: false,
      isLoadingAddButton: false,
      isScriptsTitle: true,
      isVideosTitle: true,
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
      addMediaModel: false,
      addScriptModel: false,
      addVideoModel: false,
      addTitle: "",
      addFile: null,
      showEditModal: false,
      editedTitle: "",
      editedFile: null,
      // Add a property to store the current edited item
      editedItem: null,
      fields: [
        { key: "title", sortable: true },
        ...(this.isScriptsTitle
          ? []
          : [{ key: "type", sortable: true, label: "Type" }]),
        { key: "status", sortable: true },
        { key: "created_at", sortable: true },
        { key: "Media", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  // computed: {
  //   ...mapGetters(["getPerfectSaleMedia", "getDefaultImage", "getImageUrl"]),
  //   rows() {
  //     return this.items.length;
  //   },
  // },
  created() {
    // Access the ID from the route parameters
    const id = this.$route.params.id;
    const title = this.$route.params.title;
    console.log(this.$route.params.title);
    // Call the fetchDataById method with the ID
    // this.fetchDataById(id);
  },
  methods: {
    ...mapActions(["fetchPerfectSaleData"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        // let baseUrl = "http://localhost:8000/";
        let baseUrl = "https://virtualrealitycreators.com/green-boom/";
        // let baseUrl = "http://18.224.159.123/green-boom/";
        obj.id = element.id;
        obj.title = element.title;
        obj.file = baseUrl.concat(element.file); // Assuming element.file is the correct property for the file path
        obj.type = element.file_type; // Assuming element.file_type is the correct property for the file type
        obj.status = element.status;
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
    addTrainingModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addFile = null;
      this.addMediaModel = true;
    },
    addVideoModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addFile = null;
      this.addVideoModel = true;
    },
    addScriptModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addScriptModel = true;
      this.isLoading = false;
    },

    openEditModal(item) {
      // Set initial values when opening the modal
      this.editedItem = item;
      this.editedTitle = item.title;
      this.editedFile = null; // Clear the file input
      this.showEditModal = true;
    },
    handleFileChange() {
      const allowedFormats = [
        "application/pdf", // PDF
        "video/mp4", // MP4
        "video/quicktime", // MOV
        "video/x-msvideo", // AVI
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
            text: "Please select a valid file (pdf, mp4, mov, avi, doc, docx, ppt, pptx, xls, xlsx).",
          });
        }
      }
    },
    handleVideoFileChange() {
      const allowedFormats = [
        "video/mp4", // MP4
        "video/quicktime", // MOV
        "video/x-msvideo", // AVI
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
            text: "Please select a valid file (mp4, mov, avi).",
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
    async submitVideoForm() {
      this.isLoadingAddButton = true;
      const addFormData = new FormData();
      addFormData.append("title", this.addTitle);

      try {
        const addFormData = new FormData();
        const perfect_sale_id = this.$route.params.id;
        console.log("perfect sale after add", perfect_sale_id);
        addFormData.append("title", this.addTitle);
        addFormData.append("perfect_sale_id", perfect_sale_id);
        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(
          endpoints.perfectSales.addPerfectSaleMedia,
          addFormData
        );

        if (result.status === 200) {
          this.addMediaModel = false; // Close the modal after success
          this.isLoadingAddButton = false;
          this.addVideoModel = false;

          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated perfect sale pitch media data
          const perfect_sale_id = this.$route.params.id;
          await this.fetchPerfectSaleData(perfect_sale_id);

          // Update the component's data with the latest data
          this.getPerfectSaleMedia.length > 0
            ? this.setItems(this.getPerfectSaleMedia)
            : (this.noItems = "No perfect sale data found.");

          Swal.fire(
            "Success!",
            "Perfect sale pitch media successfully added.",
            "success"
          );
        }
      } catch (error) {
        // Handle error
        console.error("Error adding perfect sale pitch media:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding perfect sale pitch media",
        });
      }
    },
    async submitAddForm() {
      this.isLoadingAddButton = true;
      const addFormData = new FormData();
      addFormData.append("title", this.addTitle);

      try {
        const addFormData = new FormData();
        const perfect_sale_id = this.$route.params.id;
        console.log("perfect sale after add", perfect_sale_id);
        addFormData.append("title", this.addTitle);
        addFormData.append("perfect_sale_id", perfect_sale_id);
        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(
          endpoints.perfectSales.addPerfectSaleMedia,
          addFormData
        );

        if (result.status === 200) {
          this.addMediaModel = false; // Close the modal after success
          this.isLoadingAddButton = false;
          this.addScriptModel = false;

          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated perfect sale pitch media data
          const perfect_sale_id = this.$route.params.id;
          await this.fetchPerfectSaleData(perfect_sale_id);

          // Update the component's data with the latest data
          this.getPerfectSaleMedia.length > 0
            ? this.setItems(this.getPerfectSaleMedia)
            : (this.noItems = "No perfect sale data found.");

          Swal.fire(
            "Success!",
            "Perfect sale pitch media successfully added.",
            "success"
          );
        }
      } catch (error) {
        // Handle error
        console.error("Error adding perfect sale pitch media:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding perfect sale pitch media",
        });
      }
    },

    async submitAddScriptForm() {
      this.isLoading = true;
      const addFormData = new FormData();
      addFormData.append("title", this.addTitle);

      try {
        const addFormData = new FormData();
        const perfect_sale_id = this.$route.params.id;
        console.log("perfect sale after add", perfect_sale_id);
        addFormData.append("title", this.addTitle);
        addFormData.append("perfect_sale_id", perfect_sale_id);
        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(
          endpoints.perfectSales.addScript,
          addFormData
        );

        if (result.status === 200) {
          this.addMediaModel = false; // Close the modal after success
          this.addScriptModel = false;
          this.isLoading = false;
          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated perfect sale pitch media data
          const perfect_sale_id = this.$route.params.id;
          await this.fetchPerfectSaleData(perfect_sale_id);

          // Update the component's data with the latest data
          this.getPerfectSaleMedia.length > 0
            ? this.setItems(this.getPerfectSaleMedia)
            : (this.noItems = "No perfect sale data found.");

          Swal.fire(
            "Success!",
            "Perfect sale pitch media successfully added.",
            "success"
          );
        }
      } catch (error) {
        // Handle error
        console.error("Error adding perfect sale pitch media:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding perfect sale pitch media",
        });
      }
    },

    async submitEditForm() {
      const editedFormData = new FormData();
      editedFormData.append("title", this.editedTitle);
      editedFormData.append("perfect_sale_id", this.$route.params.id);
      if (this.editedFile) {
        editedFormData.append("file", this.editedFile);
      }

      // Add an identifier for the edited item (e.g., item ID) to the form data
      editedFormData.append("id", this.editedItem.id); // Change "itemId" to "id"
      console.log("media id", this.editedItem.id);
      console.log("params id", this.$route.params.id);
      try {
        // Attempt to make the API request
        await API.post(
          endpoints.perfectSales.editPerfectSaleMedia,
          editedFormData
        );

        // Handle success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Perfect sale data edited successfully",
        }).then(() => {
          // Redirect to the same page after Swal success message
          // this.$router.go(); // This will reload the current route
        });

        // Close the modal after success
        this.showEditModal = false;

        // Fetch updated perfect sale pitch media data
        const perfect_sale_id = this.$route.params.id;
        await this.fetchPerfectSaleData(perfect_sale_id);

        // Update the component's data with the latest data
        this.items = [];
        this.getPerfectSaleMedia.length > 0
          ? this.setItems(this.getPerfectSaleMedia)
          : (this.noItems = "No perfect sale data found.");
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
    openExcel(excelUrl) {
      // Open the EXCEL file in a new window or tab
      window.open(excelUrl, "_blank");
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
        text: "You will not be able to recover this perfect sale pitch media!",
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
              `${endpoints.perfectSales.deletePerfectSaleMedia}/${itemId}`
            );

            if (response.status === 200) {
              Swal.fire(
                "Deleted!",
                "Perfect sale media has been deleted.",
                "success"
              );

              // Fetch updated perfect sale pitch media data
              const perfect_sale_id = this.$route.params.id;
              await this.fetchPerfectSaleData(perfect_sale_id);

              // Update the component's data with the latest data
              this.items = [];
              this.getPerfectSaleMedia.length > 0
                ? this.setItems(this.getPerfectSaleMedia)
                : (this.noItems = "No perfect sale data found.");

              // Navigate back to the same page
              // this.$router.go();
            } else {
              // Handle other status codes or error conditions
              console.error("Error deleting perfect sale media:", response);
              Swal.fire(
                "Error!",
                "An error occurred during deletion.",
                "error"
              );
            }
          } catch (error) {
            // Handle any errors during deletion
            console.error("Error deleting perfect sale pitch media:", error);
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
    const id = this.$route.params.id;
    console.log("perfect sale id", id);
    await this.fetchPerfectSaleData(id);
    this.getPerfectSaleMedia.length > 0
      ? this.setItems(this.getPerfectSaleMedia)
      : (this.noItems = "No perfect sale data found.");
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
</style>
