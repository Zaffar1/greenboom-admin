<template>
  <section class="tables">
    <div class="page-header">
      <h3 class="page-title">
        All Jobs
      </h3>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);">Table</a></li>
          <li class="breadcrumb-item active" aria-current="page">Advanced Table</li>
        </ol>
      </nav>
    </div>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <b-modal ref="job-modal" hide-footer :no-close-on-backdrop="true" id="modallg" title="Job Detail" size="lg"
              :footer-bg-variant="'info'">
              <div class="col-md-12">
                
              </div>
              <!-- <b-button class="mt-3 subbtn float-end" variant="outline-success" @click="() => {this.selectedJobId = null, this.$refs['job-modal'].hide();}">close</b-button> -->
            </b-modal>
            <h4 class="card-title"></h4>
            <b-table :items="items" id="table-list" responsive :per-page="perPage" :current-page="currentPage"
              :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" show-empty :filter="filter" striped
              hover>

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

                <i v-b-modal.modallg v-b-tooltip.html.top title="View Details" variant="primary" @click="viewJobDetail(data.item.id)"
                  :ref="'btn' + data.index" class="mr-2 mdi mdi-eye text-p1 icon-sm"></i>

                <span v-html="data.value"></span>
              </template>
            </b-table>
            <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="table-list"
              align="right">
            </b-pagination>
          </div>
        </div>
      </div>
    </div>
    <div>
    </div>
  </section>
</template>
<script>
import Vue from "vue";
import SortedTablePlugin from "vue-sorted-table";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";


Vue.use(SortedTablePlugin, {
  ascIcon: '<i class="mdi mdi-arrow-down"></i>',
  descIcon: '<i class="mdi mdi-arrow-up"></i>'
});

export default {
  data: function () {
    return {
      sortBy: 'name',
      perPage: 10,
      currentPage: 1,
      sortDesc: false,
      sortByFormatted: true,
      filterByFormatted: true,
      filter: "",
      sortable: true,
      fields: [
        { key: 'title', sortable: true },
        { key: 'description', sortable: true },
        { key: 'location', sortable: true },
        { key: 'status', sortable: true },
        { key: 'created_at', sortable: true },
        { key: 'action', sortable: true }
      ],
      items: [],
      noItems: null,
      selectedJobDetail: {}
    };
  },
  computed: {
    ...mapGetters(['getJobs', 'getJob', 'getDefaultImage', 'getImageUrl']),
    rows() {
      return this.items.length
    }
  },
  methods: {
    ...mapActions(['fetchJobs']),
    setItems(data) {
      data.forEach((element) => {
        let obj = {};
        obj.id = element.id;
        obj.title = element.title;
        obj.description = element.description;
        obj.location = element.location;
        obj.status = `<label class="badge ${element.status.name === "Active" ? "badge-success" : "badge-danger"
          }">${element.status.name}</label>`;
        obj.created_at = moment(element.created_at).format(
          "MMM Do YY"
        );
        this.items.push(obj);
      });
    },
    viewJobDetail(id){
      this.selectedJobDetail = this.getJob(id);
      console.log("Sele", this.selectedJobDetail);
    }
  },
  async mounted() {
    await this.fetchJobs();
    this.getJobs.length > 0
      ? this.setItems(this.getJobs)
      : (this.noItems = "No Job Found.");

    console.log(this.getJobs)
  }
}
</script>
  