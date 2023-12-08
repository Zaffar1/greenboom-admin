<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">Welcome Videos List</h3>
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
                <span v-html="data.value"></span>
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
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(Video)="data">
                <button @click="openModal(data.item.file)">Play</button>
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
        { key: "title", sortable: true },
        { key: "description", sortable: true },
        // { key: 'phone', sortable: true },
        { key: "Video", sortable: true },
        // { key: "file", sortable: true },
        { key: "status", sortable: true },
        { key: "created_at", sortable: true },
        { key: "action", sortable: true },
      ],
      items: [],
      noItems: null,
    };
  },
  computed: {
    ...mapGetters(["getWelcomeVideos", "getDefaultImage", "getImageUrl"]),
    rows() {
      return this.items.length;
    },
  },
  methods: {
    ...mapActions(["fetchWelcomeVideos"]),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        let baseUrl = "http://localhost:8000/";
        obj.id = element.id;
        obj.title = element.title;
        obj.description = element.description;
        obj.file = baseUrl.concat(element.file);
        // obj.button = `<button @click="playVideo('${obj.file}')">Play Video</button>`;
        obj.status = `<label class="badge ${
          element.status === "Active" ? "badge-success" : "badge-danger"
        }">${element.status}</label>`;
        obj.status_id = element.status?.id;
        obj.created_at = moment(element.created_at).format(
          "dddd, MMMM Do YYYY"
        );
        this.items.push(obj);
      });

      console.log("mister", this.items);
    },

    openModal(videoUrl) {
      this.videoSource = videoUrl;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
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
    await this.fetchWelcomeVideos();
    console.log("all welcome videos", this.getWelcomeVideos.length);
    this.getWelcomeVideos.length > 0
      ? this.setItems(this.getWelcomeVideos)
      : (this.noItems = "No Video Found.");
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
