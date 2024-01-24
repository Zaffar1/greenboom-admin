<template>
  <section class="dashboard">
    <div class="page-header">
      <h3 class="page-title">
        <!-- <span class="page-title-icon bg-gradient-primary text-white mr-2"> -->
        <span class="page-title-icon orange-button text-white mr-2">
          <i class="mdi mdi-home"></i>
        </span>
        Dashboard
      </h3>
      <nav aria-label="breadcrumb">
        <ul class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">
            <span></span>Overview
            <i
              class="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"
            ></i>
          </li>
        </ul>
      </nav>
    </div>
    <div class="row">
      <div class="col-md-4 grid-margin stretch-card">
        <div class="card aligner-wrapper">
          <div class="card-body">
            <div
              class="absolute left top bottom h-100 v-strock-2 bg-success"
            ></div>
            <p class="text-muted mb-2">Total Users</p>
            <div class="d-xl-flex align-items-center">
              <h1 class="font-weight-medium mb-2">
                {{ this.getUsers.length }}
              </h1>
              <!-- <h5 class="font-weight-medium text-success ml-2">−14.2%</h5> -->
            </div>
            <!-- <div class="d-flex align-items-center">
              <div class="bg-success dot-indicator"></div>
              <p class="text-muted mb-0 ml-2">This month unpaid invoices $567</p>
            </div> -->
          </div>
        </div>
      </div>
      <!-- <div class="col-md-4 grid-margin stretch-card">
        <div class="card aligner-wrapper">
          <div class="card-body">
            <div class="absolute left top bottom h-100 v-strock-2 bg-success"></div>
            <p class="text-muted mb-2">Total Jobs</p>
            <div class="d-xl-flex align-items-center">
              <h1 class="font-weight-medium mb-2">{{ this.getJobs.length }}</h1>
            </div>
            <div class="d-flex align-items-center">
              <div class="bg-success dot-indicator"></div>
              <p class="text-muted mb-0 ml-2">This month unpaid invoices $567</p>
            </div>
          </div>
        </div>
      </div> -->
      <!-- <div class="col-md-4 grid-margin stretch-card">
        <div class="card aligner-wrapper">
          <div class="card-body">
            <div class="absolute left top bottom h-100 v-strock-2 bg-success"></div>
            <p class="text-muted mb-2">Unpaid Invoices</p>
            <div class="d-xl-flex align-items-center">
              <h1 class="font-weight-medium mb-2">$2,156</h1>
              <h5 class="font-weight-medium text-success ml-2">−14.2%</h5>
            </div>
            <div class="d-flex align-items-center">
              <div class="bg-success dot-indicator"></div>
              <p class="text-muted mb-0 ml-2">This month unpaid invoices $567</p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </section>
</template>

<script>
import visitAndSalesStatitics from "../../components/charts/widgets/visitAndSalesStatitics";
import trafficSourceChart from "../../components/charts/widgets/trafficSourceChart";
import todoList from "../../components/apps/todoList";
import DatePicker from "vue2-datepicker";
import unPaidInvoices from "../../components/charts/widgets/unPaidInvoices";

import { mapActions, mapGetters } from "vuex";

export default {
  name: "dashboard",
  components: {
    DatePicker,
    trafficSourceChart,
    visitAndSalesStatitics,
    todoList,
    unPaidInvoices,
  },
  data() {
    return {
      time1: null,
    };
  },
  computed: {
    ...mapGetters(["getUsers", "getJobs"]),
  },
  methods: {
    ...mapActions(["fetchUsers", "fetchJobs"]),
  },
  async mounted() {
    await this.fetchUsers();
    await this.fetchJobs();
  },
};
</script>

<style scoped>
.orange-button {
  background-color: #ff002d;
  border-color: orange;
  color: white;
}
</style>
