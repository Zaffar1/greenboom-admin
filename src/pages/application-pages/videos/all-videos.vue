<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Video List</h3>
      <b-button
        @click="addWelcomeModal"
        variant="success"
        class="mr-2 orange-button"
      >
        <i class="mdi mdi-plus"></i> Add Video
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
                placeholder="Search Video"
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
              <template v-slot:cell(status)="data">
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
                <button
                  @click="openModal(data.item.file)"
                  class="btn btn-primary orange-button"
                >
                  <i class="mdi mdi-play"></i> Play Video
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
    <!-- v-if="currentVideo" -->
    <!-- <b-modal title="Video Player" @hidden="resetModal" id="video-modal">
        <video width="100%" controls>
          <source :src="currentVideo" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </b-modal> -->

    <!-- Add Video -->
    <b-modal v-model="addVideoModel" title="Add Video" hide-footer>
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
            accept=".mp4, .mov, .avi"
            @change="handleFileChange"
            required
            ref="fileInputRef"
          ></b-form-file>
        </b-form-group>
        <!-- You can add more fields as needed -->

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

    <!-- Modal for editing video -->
    <b-modal v-model="showEditModal" title="Edit Welcome Video" hide-footer>
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
  data: function () {
    return {
      isLoadingAddButton: false,
      isModalOpen: false,
      videoSource: "", // Set a default video source
      sortBy: "name",
      perPage: 10,
      currentPage: 1,
      sortDesc: false,
      sortByFormatted: true,
      filterByFormatted: true,
      showEditModal: false,
      editedTitle: "",
      editedDescription: "",
      editedFile: null,
      // Add a property to store the current edited item
      editedItem: null,
      addVideoModel: false,
      addTitle: "",
      addDescription: "",
      addFile: null,
      addTitle: "",
      filter: "",
      sortable: true,
      fields: [
        { key: "title", sortable: true },
        { key: "description", sortable: true },
        // { key: 'phone', sortable: true },
        { key: "status", sortable: true },
        // { key: "file", sortable: true },
        { key: "created_at", sortable: true },
        { key: "Media", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getAllVideos", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  methods: {
    ...mapActions(["fetchAllVideos", "deleteVideo"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        let baseUrl = "https://virtualrealitycreators.com/green-boom/";
        // let baseUrl = "http://18.224.159.123/green-boom/";
        obj.id = element.id;
        obj.title = element.title;
        obj.description = element.description;
        obj.file = baseUrl.concat(element.file);
        // obj.button = `<button @click="playVideo('${obj.file}')">Play Video</button>`;
        // obj.status = `<label class="badge ${
        //   element.status === "Active" ? "badge-success" : "badge-danger"
        // }">${element.status}</label>`;
        obj.status = element.status;
        // obj.status_id = element.status?.id;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });

      console.log("mister", this.items);
    },

    addWelcomeModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addDescription = item.description;
      this.addFile = null;
      this.addVideoModel = true;
    },
    resetFileInput() {
      // Set the file input value to an empty string
      this.$refs.fileInputRef.$el.querySelector("input[type=file]").value = "";
    },
    handleFileChange() {
      const allowedFormats = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
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
            text: "Please select a valid video file (mp4, mov, avi).",
          });
        }
      }
    },
    async submitAddForm() {
      try {
        this.isLoadingAddButton = true;
        const addFormData = new FormData();
        addFormData.append("title", this.addTitle);
        addFormData.append("description", this.addDescription);
        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(endpoints.videos.addVideo, addFormData);

        if (result.status === 200) {
          this.addVideoModel = false; // Close the modal after success
          this.isLoadingAddButton = false;
          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated training media data
          await this.fetchAllVideos();

          // Update the component's data with the latest data
          this.getAllVideos.length > 0
            ? this.setItems(this.getAllVideos)
            : (this.noItems = "No Video Found.");

          Swal.fire("Success!", "Video successfully added.", "success");
        }
      } catch (error) {
        // Handle error
        console.error("Error adding video:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unknown fomat to add welcome video",
        });
      } finally {
        this.isLoadingAddButton = false; // Disable loading state
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
      editedFormData.append("id", this.editedItem.id); // Change "itemId" to "video_id"

      try {
        await API.post(endpoints.videos.editVideo, editedFormData);

        // Handle success
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Video edited successfully",
        }).then(() => {
          // Redirect to the same page after Swal success message
          // this.$router.go(); // This will reload the current route
        });

        this.showEditModal = false; // Close the modal after success
        await this.fetchAllVideos();

        // Update the component's data with the latest data
        this.items = [];
        this.getAllVideos.length > 0
          ? this.setItems(this.getAllVideos)
          : (this.noItems = "No Video Found.");
      } catch (error) {
        // Handle error
        console.error("Error editing video:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while editing the video",
        });
      }
    },
    async changeStatus(item) {
      try {
        // Note the use of await here
        let result = await API.post(
          `${endpoints.videos.videoStatus}/${item.id}`
        );

        // Check the result or handle the response as needed
        if (result.status === 200) {
          // Toggle the status locally in the items array
          const updatedItems = this.items.map((video) => {
            if (video.id === item.id) {
              video.status = video.status === "Active" ? "InActive" : "Active";
            }
            return video;
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
      this.videoSource = videoUrl;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    view(itemId) {
      console.log(itemId);
    },
    async deleteItem(itemId) {
      console.log(itemId);

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this video!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          // Perform the deletion operation
          await this.deleteVideo(itemId);

          // If the deletion is successful, fetch updated data
          await this.fetchAllVideos();

          // Update the component's data with the latest data
          this.items = [];
          this.getAllVideos.length > 0
            ? this.setItems(this.getAllVideos)
            : (this.noItems = "No Video Found.");

          // Show success message
          Swal.fire("Deleted!", "The video has been deleted.", "success");
        } catch (error) {
          // Handle any errors during deletion or data fetching
          console.error("Error deleting item or fetching data:", error);
          Swal.fire("Error!", "An error occurred during deletion.", "error");
        }
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
  async mounted() {
    await this.fetchAllVideos();
    console.log("all videos", this.getAllVideos.length);
    this.getAllVideos.length > 0
      ? this.setItems(this.getAllVideos)
      : (this.noItems = "No Video Found.");
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
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
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
