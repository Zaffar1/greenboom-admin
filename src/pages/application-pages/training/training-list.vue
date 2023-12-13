<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Training List</h3>
      <!-- <router-link :to="{ name: 'add-training' }"> -->
      <b-button @click="addTrainingModal" variant="success" class="mr-2"
        >Add Training</b-button
      >
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

                <i
                  @click="view(data.item.id)"
                  :ref="'btn' + data.index"
                  class="mr-2 mdi mdi-eye text-muted icon-sm"
                ></i>
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
              <template #cell(TrainingMedia)="data">
                <button @click="viewMedia(data.item.TrainingMedia)">
                  View
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
    <b-modal v-model="addModel" title="Add Training">
      <form @submit.prevent="submitAddForm">
        <b-form-group label="Title" label-for="editInputTitle">
          <b-form-input
            v-model="addTitle"
            id="editInputTitle"
            required
          ></b-form-input>
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
      addTitle: "",
      fields: [
        { key: "title", sortable: true },
        { key: "status", sortable: true },
        { key: "created_at", sortable: true },
        { key: "TrainingMedia", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getTrainings", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  methods: {
    ...mapActions(["fetchTrainings", "fetchTrainingId"]),
    generateViewButton(id) {
      return `<button @click="viewMedia(${id})">View</button>`;
    },
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        let baseUrl = "http://localhost:8000/";
        obj.id = element.id;
        obj.title = element.title;
        obj.TrainingMedia = element.id;
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

    addTrainingModal(item) {
      // Set initial values when opening the modal
      this.addItem = item;
      this.addTitle = item.title;
      this.addModel = true;
    },

    async submitAddForm() {
      const addFormData = new FormData();
      addFormData.append("title", this.addTitle);

      try {
        const result = await API.post(
          endpoints.trainings.addTraining,
          addFormData
        );

        if (result.status === 200) {
          this.addModel = false; // Close the modal after success

          // Fetch updated training data
          await this.fetchTrainings();

          // Update the component's data with the latest data
          this.items = [];
          this.getTrainings.length > 0
            ? this.setItems(this.getTrainings)
            : (this.noItems = "No Training Found.");

          Swal.fire("Success!", "Training successfully added.", "success");
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

    viewMedia(id) {
      // Implement your logic to view media based on the ID
      console.log("View media with ID:", id);
      this.$router.push({ name: "training-media", params: { id } });
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
        text: "You will not be able to recover this training!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          // Perform the deletion operation
          await this.fetchTrainingId(itemId);

          // If the deletion is successful, fetch updated data
          await this.fetchTrainings();

          // Update the component's data with the latest data
          this.items = [];
          this.getTrainings.length > 0
            ? this.setItems(this.getTrainings)
            : (this.noItems = "No Training Found.");

          Swal.fire("Deleted!", "Training has been deleted.", "success");
          // Redirect to the desired route
          // this.$router.push("/user/training-list");
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
        let result = await API.post(
          `${endpoints.trainings.trainingStatus}/${item.id}`
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
  async mounted() {
    await this.fetchTrainings();
    console.log("all training", this.getTrainings.length);
    this.getTrainings.length > 0
      ? this.setItems(this.getTrainings)
      : (this.noItems = "No Training Found.");
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
</style>
