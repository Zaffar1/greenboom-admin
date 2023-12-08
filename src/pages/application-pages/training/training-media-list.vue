<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Training Media</h3>
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
                <img :src="data.item.profile" class="mr-2" alt="image" />
                {{ data.item.name }}
              </template>

              <!-- when no item found -->
              <template #empty="">
                <p class="text-muted text-center">{{ noItems }}</p>
              </template>

              <!-- status -->
              <template v-slot:cell(status)="data">
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
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(Media)="data">
                <div>
                  <button
                    v-if="data.item.type === 'video'"
                    @click="openModal(data.item.file)"
                  >
                    Play
                  </button>
                  <button
                    v-else-if="data.item.type === 'pdf'"
                    @click="openPdf(data.item.file)"
                  >
                    Open
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
    <div></div>
  </section>
</template>
<script>
import Vue from "vue";
import SortedTablePlugin from "vue-sorted-table";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";

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
      fields: [
        // { key: "media", sortable: true },
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
    ...mapGetters(["getTrainingMedia", "getDefaultImage", "getImageUrl"]),
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
    ...mapActions(["fetchTrainingMedia"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        let baseUrl = "http://localhost:8000/";
        obj.id = element.id;
        obj.file = baseUrl.concat(element.file); // Assuming element.file is the correct property for the file path
        obj.type = element.file_type; // Assuming element.file_type is the correct property for the file type

        obj.status = `<label class="badge ${
          element.status === "Active" ? "badge-success" : "badge-danger"
        }">${element.status}</label>`;

        obj.role_id = element.role?.id;
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
  },
  async mounted() {
    const id = this.$route.params.id;
    await this.fetchTrainingMedia(id);
    this.getTrainingMedia.length > 0
      ? this.setItems(this.getTrainingMedia)
      : (this.noItems = "No User Found.");
  },
  //   async fetchDataById(id) {
  //     try {
  //       // Make an API request to fetch data using the provided ID
  //       const response = await axios.get(
  //         `http://localhost:8000/training-media/${id}`
  //       );
  //       const data = response.data;

  //       // Do something with the fetched data, e.g., update component state
  //       //   this.$dataById = data; // Assuming you have a data property to store the fetched data
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   },
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
