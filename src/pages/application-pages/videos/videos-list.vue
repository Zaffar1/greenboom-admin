<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">All Videos</h3>
      <b-button @click="addVideosModal" variant="success" class="mr-2">
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
                placeholder="Search Videos"
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
              <template #cell(title)="data">
                <!-- title & profile -->
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

              <template v-slot:cell(Media)="data">
                <button
                  @click="openModal(data.item.file)"
                  class="btn btn-primary"
                >
                  <i class="mdi mdi-play"></i> Play Video
                </button>
              </template>

              <template v-slot:cell(action)="data">
                <!-- Actions -->
                <!-- <router-link
                    :to="{ title: 'user-details', params: { id: data.item.id } }"
                  >
                    <i class="mr-2 mdi mdi-eye text-muted icon-sm"></i>
                  </router-link> -->
                <!-- <i
                    @click="view(data.item.id)"
                    :ref="'btn' + data.index"
                    class="mr-2 mdi mdi-eye text-muted icon-sm"
                  ></i> -->
                <i
                  v-b-modal.modallg
                  @click="edit(data.item.id)"
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
            required
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
      sortBy: "title",
      perPage: 10,
      currentPage: 1,
      sortDesc: false,
      sortByFormatted: true,
      filterByFormatted: true,
      filter: "",
      sortable: true,
      addVideoModel: false,
      showEditModal: false,
      addTitle: "",
      addDescription: "",
      addFile: null,
      fields: [
        { key: "title", sortable: true },
        { key: "description", sortable: true },
        { key: "status", sortable: true },
        { key: "Media", sortable: true },
        { key: "created_at", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getVideos", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  methods: {
    ...mapActions(["fetchVideos", "deleteVideo"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        obj.id = element.id;
        obj.title = element.title;
        obj.description = element.description;
        obj.status = element.status;
        // obj.status = `<label class="badge ${
        //   element.status === "Active" ? "badge-success" : "badge-danger"
        // }">${element.status}</label>`;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });
    },
    // async view(itemId) {
    //   await this.fetchUserDetails(itemId);
    //   console.log(itemId);
    // },

    addVideosModal(item) {
      // Set initial values when opening the modal
      //   console.log("hiting");
      this.addItem = item;
      this.addTitle = item.title;
      this.addDescription = item.description;
      this.addFile = null;
      this.addVideoModel = true;
    },

    async submitAddForm() {
      try {
        const addFormData = new FormData();
        addFormData.append("title", this.addTitle);
        addFormData.append("description", this.addDescription);
        if (this.addFile) {
          addFormData.append("file", this.addFile);
        }
        const result = await API.post(
          endpoints.videos.addVideo,
          addFormData
        );

        if (result.status === 200) {
          this.addVideoModel = false; // Close the modal after success

          // Clear the items array before adding new data
          this.items = [];

          // Fetch updated msd sheet data
          await this.fetchVideos();

          // Update the component's data with the latest data
          this.getVideos.length > 0
            ? this.setItems(this.getVideos)
            : (this.noItems = "No Video Found.");

          Swal.fire("Success!", "Video Sheet successfully added.", "success");
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
          await this.fetchVideos();

          // Update the component's data with the latest data
          this.items = [];
          this.getVideos.length > 0
            ? this.setItems(this.getVideos)
            : (this.noItems = "No Video Found.");

          // Show success message
          Swal.fire("Deleted!", "Video has been deleted.", "success");
        } catch (error) {
          // Handle any errors during deletion or data fetching
          console.error("Error deleting item or fetching data:", error);
          Swal.fire("Error!", "An error occurred during deletion.", "error");
        }
      }
    },
    async changeStatus(item) {
      try {
        // Note the use of await here
        let result = await API.post(`${endpoints.user.userStatus}/${item.id}`);

        // Check the result or handle the response as needed
        if (result.status === 200) {
          // Toggle the status locally in the items array
          const updatedItems = this.items.map((user) => {
            if (user.id === item.id) {
              user.status = user.status === "Active" ? "InActive" : "Active";
            }
            return user;
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
  },
  async mounted() {
    await this.fetchVideos();
    this.getVideos.length > 0
      ? this.setItems(this.getVideos)
      : (this.noItems = "No User Found.");
  },
};
</script>

<style scoped>
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
</style>
