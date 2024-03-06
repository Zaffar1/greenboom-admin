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
          class="mr-2 orange-button btn-secondary"
        >
          <i class="mdi mdi-plus"></i>Add Data
        </b-button>
        <b-button
          v-else-if="this.$route.params.title === 'Videos'"
          @click="addVideoModal"
          variant="success"
          class="mr-2 orange-button btn-secondary"
        >
          <i class="mdi mdi-plus"></i>Add Video
        </b-button>
        <b-button
          v-else
          @click="addTrainingModal"
          variant="success"
          class="mr-2 orange-button btn-secondary"
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
                  class="mr-2 orange-button mdi mdi-pencil icon-sm p-2 rounded"
                ></i> -->
                <i
                  v-if="isScriptsTitle2"
                  v-b-modal.modallg
                  @click="openEditModal2(data.item)"
                  :ref="'editBtn1' + data.index"
                  class="mr-2 mdi mdi-pencil orange-button icon-sm p-2 rounded"
                ></i>

                <!-- Another Button (Second Button) -->
                <i
                  v-else
                  v-b-modal.modallg
                  @click="openEditModal(data.item)"
                  :ref="'editBtn' + data.index"
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
                  <button
                    v-if="data.item.type === 'video'"
                    @click="openModal(data.item.file)"
                    class="btn btn-primary orange-button"
                  >
                    <i class="mdi mdi-play"></i> Play Video
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
                  <button
                    v-else-if="isScriptsTitle && data.item.type !== 'pdf'"
                    @click="scriptData(data.item)"
                    class="btn btn-secondary orange-button"
                  >
                    <i class="mdi mdi-eye"></i> View
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
      <video :src="videoSource" controls autoplay></video>
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
          <b-form-group label="Upload thumbnail" label-for="editInputFile">
            <b-form-file
              v-model="addThumbnail"
              id="editInputthumbnail"
              :state="Boolean(addThumbnail)"
              placeholder="Choose a file..."
              accept=".png, .jpg, .jpeg"
              @change="handleFileChange2"
              ref="fileInputRef2"
              :required="isVideoFileType(addFile)"
            ></b-form-file>
          </b-form-group>
          <b-button
            type="submit"
            variant="success orange-button popUp"
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
          <b-form-group label="Upload thumbnail" label-for="editInputFile">
            <b-form-file
              v-model="addThumbnail"
              id="editInputthumbnail"
              :state="Boolean(addThumbnail)"
              placeholder="Choose a file..."
              accept=".png, .jpg, .jpeg"
              @change="handleThumbnail2"
              ref="fileInputRef2"
              required
            ></b-form-file>
          </b-form-group>
          <b-button
            type="submit"
            variant="success orange-button popUp"
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
          class="orange-button popUp"
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
            accept=".pdf, .mp4, .mov, .avi, .doc, .docx, .ppt, .pptx, .xls, .xlsx"
            placeholder="Choose a file..."
            @change="handleFileChange"
          ></b-form-file>
        </b-form-group>
        <b-form-group label="Upload Thumbnail" label-for="editInputFile1">
          <b-form-file
            v-model="editedThumbnail"
            id="editInputFile1"
            :state="Boolean(editedThumbnail)"
            placeholder="Choose a file..."
            accept=".png, .jpg, .jpeg"
            @change="handleFileChange2"
            ref="fileInputRef2"
            :required="isVideoFileType(editedFile)"
          ></b-form-file>
        </b-form-group>
        <!-- You can add more fields as needed -->
        <b-button
          type="submit"
          variant="success"
          class="orange-button popUp"
          :disabled="isLoading"
          >{{ isLoading ? "Updating..." : "Update" }}</b-button
        >
      </form>
    </b-modal>

    <b-modal
      v-model="showEditModal2"
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

        <!-- You can add more fields as needed -->
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
  computed: {
    isScriptsTitle() {
      console.log(this.$route.params.title);
      this.script = this.$route.params.title;
      return this.$route.params.title === "Scripts";
    },
    isScriptsTitle2() {
      console.log(this.$route.params.title);
      this.script = this.$route.params.title;
      return this.$route.params.title === "Scripts";
    },
    shouldShowSecondButton() {
      // Add conditions for when to show the second button
      // For example, you might use a different route parameter or condition
      return this.$route.params.title !== "Scripts";
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
    const isScriptsTitle2 = this.$route.params.title === "Scripts";

    const fields = [
      { key: "title", sortable: true },
      ...(isScriptsTitle2 ? [] : [{ key: "type", sortable: true }]),
      { key: "status", sortable: true },
      { key: "created_at", sortable: true },
      { key: "Media", sortable: true },
      { key: "action", sortable: true },
    ];

    return {
      isLoading: false,
      isLoadingAddButton: false,
      isScriptsTitle: true,
      script: null,
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
      addThumbnail: null,
      showEditModal: false,
      showEditModal2: false,
      editedTitle: "",
      editedFile: null,
      editedThumbnail: null,
      // Add a property to store the current edited item
      editedItem: null,
      fields: fields,
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
  /**
   * Lifecycle hook called when the component is created.
   * Accesses the ID and title from the route parameters.
   * Logs the title parameter.
   * Calls the fetchDataById method with the ID (if uncommented).
   */
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
        //let baseUrl = "https://virtualrealitycreators.com/green-boom/";
        // let baseUrl = "http://18.224.159.123/green-boom/";
        let baseUrl = "https://greenboom-bucket.s3.us-east-2.amazonaws.com/";
        obj.id = element.id;
        obj.title = element.title;
        // obj.file = element.file;
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
    /**
     * Asynchronously changes the status of a perfect sale item.
     * @param {object} item - The perfect sale item whose status is to be changed.
     */
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
    /**
     * Opens the modal for viewing a video.
     * @param {string} videoUrl - The URL of the video to be displayed.
     */
    openModal(videoUrl) {
      console.log(videoUrl);
      this.videoSource = videoUrl;
      this.isModalOpen = true;
    },
    /**
     * Opens the modal for adding a training item.
     * @param {object} item - The training item to be added.
     */
    addTrainingModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addFile = null;
      this.addMediaModel = true;
    },
    /**
     * Opens the modal for adding a video.
     * @param {object} item - The item for which the video is to be added.
     */
    addVideoModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addFile = null;
      this.addThumbnail = null;
      this.addVideoModel = true;
    },
    /**
     * Opens the modal for adding a script.
     * @param {object} item - The item for which the script is to be added.
     */
    addScriptModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addScriptModel = true;
      this.isLoading = false;
    },
    /**
     * Opens the modal for editing an item.
     * @param {object} item - The item to be edited.
     */
    openEditModal(item) {
      // Set initial values when opening the modal
      this.editedItem = item;
      this.editedTitle = item.title;
      this.editedFile = null; // Clear the file input
      this.editedThumbnail = null;
      this.showEditModal = true;
    },
    /**
     * Opens another modal for editing an item.
     * @param {object} item - The item to be edited.
     */
    openEditModal2(item) {
      // Set initial values when opening the modal
      this.editedItem = item;
      this.editedTitle = item.title;
      this.showEditModal2 = true;
      this.isLoading = false;
    },
    // Handles file input change events and validates selected file formats
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
    // Similar to handleFileChange, but specifically for video files.
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
    //  Resets the value of the file input field to allow re-selection of the same file.
    resetFileInput() {
      // Reset the file input value to allow re-selection of the same file
      const fileInput =
        this.$refs.fileInputRef.$el.querySelector("input[type='file']");
      fileInput.value = null;
    },
    // Handles thumbnail file input change events and validates selected file formats.
    handleThumbnail2() {
      const allowedFormats = [
        "image/png", // PNG
        "image/jpeg", // JPEG
        "image/jpg", // JPG
      ];

      const fileInput =
        this.$refs.fileInputRef2.$el.querySelector("input[type='file']");
      const selectedFile = fileInput.files[0];

      if (selectedFile) {
        if (!allowedFormats.includes(selectedFile.type)) {
          // Clear the file input and show an error message
          this.addThumbnail = null;
          this.resetFileInput2();
          Swal.fire({
            icon: "error",
            title: "Invalid File Format",
            text: "Please select a valid image file (png, jpg, jpeg).",
          });
        }
      }
    },
    // Resets the value of the thumbnail file input field.
    resetFileInput2() {
      // Reset the file input value to allow re-selection of the same file
      const fileInput =
        this.$refs.fileInputRef2.$el.querySelector("input[type='file']");
      fileInput.value = null;
    },
    // Submits the form data for adding a video file.
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
        if (this.addThumbnail) {
          addFormData.append("thumbnail", this.addThumbnail);
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
    // Submits the form data for adding various types of files.
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
        if (this.addThumbnail) {
          addFormData.append("thumbnail", this.addThumbnail);
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
        this.isLoadingAddButton = false;
        // Handle error
        console.error("Error adding perfect sale pitch media:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding perfect sale pitch media",
        });
      }
    },
    // Checks if the selected file is a video type.
    isVideoFileType(file) {
      // Check if the selected file is a video type
      return file && /\.(mp4|mov|avi)$/i.test(file.name);
    },
    // esets the value of the file input field.
    resetFileInput2() {
      // Set the file input value to an empty string
      this.$refs.fileInputRef2.$el.querySelector("input[type=file]").value = "";
    },
    // Handles file input change events for thumbnails.
    handleFileChange2() {
      const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];

      const fileInput =
        this.$refs.fileInputRef2.$el.querySelector("input[type='file']");
      const selectedFile = fileInput.files[0];

      if (selectedFile) {
        if (!allowedFormats.includes(selectedFile.type)) {
          // Clear the file input and show an error message
          this.addFile = null;
          this.resetFileInput2();
          Swal.fire({
            icon: "error",
            title: "Invalid File Format",
            text: "Please select a valid image file (png, jpg, jpeg).",
          });
        }
      }
    },
    // Submits the form data for adding a script file.
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
        this.isLoading = false;
        // Handle error
        console.error("Error adding perfect sale pitch media:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding perfect sale pitch media",
        });
      }
    },
    // Submits the form data for editing an existing file.
    async submitEditForm() {
      this.isLoading = true;
      const editedFormData = new FormData();
      editedFormData.append("title", this.editedTitle);
      editedFormData.append("perfect_sale_id", this.$route.params.id);
      if (this.editedFile) {
        editedFormData.append("file", this.editedFile);
      }
      if (this.editedThumbnail) {
        editedFormData.append("file", this.editedThumbnail);
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
          this.isLoading = false;
          // Redirect to the same page after Swal success message
          // this.$router.go(); // This will reload the current route
        });

        // Close the modal after success
        this.showEditModal = false;
        this.showEditModal2 = false;
        // Fetch updated perfect sale pitch media data
        const perfect_sale_id = this.$route.params.id;
        await this.fetchPerfectSaleData(perfect_sale_id);

        // Update the component's data with the latest data
        this.items = [];
        this.getPerfectSaleMedia.length > 0
          ? this.setItems(this.getPerfectSaleMedia)
          : (this.noItems = "No perfect sale data found.");
      } catch (error) {
        this.isLoading = false;
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

    // Closes the modal window.
    closeModal() {
      this.isModalOpen = false;
    },
    //  Opens the respective file types in a new window or tab.
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
    //  Handles navigation to a specific route with script data.
    scriptData(Script, id) {
      console.log("View media with ID:", Script.id);
      console.log("Route ID:", Script.id);
      // perform the necessary actions with Script and id
      this.$router.push({
        name: "script-media",
        params: { id: Script.id, title: Script.title },
      });
    },
    //  Deletes an item after confirmation from the user.
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
    // Navigates back to the previous page.
    goBack() {
      // Use Vue Router to navigate back to the previous page
      this.$router.go(-1); // This will go back one step in the history
      // Alternatively, you can use this.$router.push('/your-route') to navigate to a specific route
    },
  },
  /**
   * The mounted lifecycle hook is called after the Vue instance has been mounted,
   * i.e., the Vue component has been rendered to the DOM.
   *
   * In this hook, we fetch the data related to the perfect sale identified by the route parameter 'id'.
   * After fetching the data, if there are perfect sale media items available, we set them using the 'setItems' method.
   * If no perfect sale media items are found, we display a message indicating that no data is available.
   */
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
