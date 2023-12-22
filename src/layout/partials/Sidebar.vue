<template>
  <section class="app-sidebar">
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <ul class="nav">
        <li class="nav-item nav-profile">
          <a href="javascript:void(0);" class="nav-link">
            <div class="nav-profile-image">
              <img :src="this.getUserImage" alt="profile" />
              <span class="login-status online"></span>
            </div>
            <div class="nav-profile-text d-flex flex-column">
              <span class="font-weight-bold mb-2">{{
                getCurrentUser.name
              }}</span>
              <span class="text-secondary text-small">{{
                getCurrentUser.type
              }}</span>
            </div>
            <i
              class="mdi mdi-bookmark-check text-success nav-profile-badge"
            ></i>
          </a>
        </li>

        <li class="nav-item" v-on:click="collapseAll">
          <router-link class="nav-link" to="/">
            <span class="menu-title">Dashboard</span>
            <i class="mdi mdi-home menu-icon"></i>
          </router-link>
        </li>

        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'user'">
            <span class="menu-title">Users</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-account-multiple menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="user">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/user/all-users"
                  >All-Users</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'job'">
            <span class="menu-title">Welcome Videos</span>
            <i class="menu-arrow"></i>
            <i class="fas fa-film"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="job">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/user/welcome-videos"
                  >Welocme-Videos-List</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>

        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'training'">
            <span class="menu-title">Training</span>
            <i class="menu-arrow"></i>
            <i class="fas fa-film"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="training">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/user/training-list"
                  >Training-List</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>

        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'sheets'">
            <span class="menu-title">MSDS Sheets</span>
            <i class="menu-arrow"></i>
            <i class="fas fa-film"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="sheets">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/user/msds-sheets-list"
                  >MSDS-Sheets-List</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>

        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'video'">
            <span class="menu-title">Video</span>
            <i class="menu-arrow"></i>
            <i class="fas fa-film"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="video">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/videos/all-videos"
                  >Videos-List</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>

        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'faqs'">
            <span class="menu-title">Perfect Sales Pitch</span>
            <i class="menu-arrow"></i>
            <i class="fas fa-film"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="faqs">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/faqs/faqs-list"
                  >FAQS</router-link
                >
              </li>
            </ul>
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/benDuffy/benDuffy-list"
                  >Ben Duffy Questions</router-link
                >
              </li>
            </ul>
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/salesTips/sales-tips-list"
                  >Sales Tips</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>

        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'product'">
            <span class="menu-title">Products</span>
            <i class="menu-arrow"></i>
            <i class="fas fa-film"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="product">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/user/product-list"
                  >Product-List</router-link
                >
              </li>
            </ul>
          </b-collapse>
        </li>

        <!-- <li class="nav-item">
          <span class="nav-link" v-b-toggle="'apps'">
            <span class="menu-title">Apps</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-cart-arrow-down menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="apps">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/apps/calendar/">Calendar</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/apps/email/">E-mail</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/apps/todo/">To-do</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/apps/gallery/">Gallery</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/apps/tickets/">Tickets</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/apps/kanban/">Kanban Board</router-link>
              </li>
               <li class="nav-item">
                <router-link class="nav-link" to="/apps/chat/">Chat</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'ui-basic'">
            <span class="menu-title">Basic UI Elements</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-crosshairs-gps menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="ui-basic">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/accordions/">Accordion</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/welcomeVideosbasic-ui/alerts/">Alerts</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/badges/">Badges</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/breadcrumbs/">Breadcrumbs</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/buttons/">Buttons</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/dropdowns/">Dropdowns</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/modals/">Modals</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/paginations/">Paginations</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/progress/">Progress</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/tabs/">Tabs</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/tooltips/">Tooltips & Popovers</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/basic-ui/typography/">Typography</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'ui-advanced'">
            <span class="menu-title">Advanced UI</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-cards-variant menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="ui-advanced">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/advanced-ui/dragula/">Dragula</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/advanced-ui/carousel/">Carousel</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/advanced-ui/loaders/">Loaders</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/advanced-ui/slider/">Slider</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/advanced-ui/clipboard/">Clipboard</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/advanced-ui/tree-view/">Tree View</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/advanced-ui/context-menu/">Context Menu</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'charts-dropdown'">
            <span class="menu-title">Charts</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-chart-bar menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="charts-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/charts/chartjs/">Chart js</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/charts/c3/">C3 charts</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/charts/chartist/">Chartist</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/charts/googleChart/">Google Chart</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/charts/justgage/">Justgage</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'maps-dropdown'">
            <span class="menu-title">Maps</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-chart-bar menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="maps-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/maps/google-map/">Google Maps</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'table-dropdown'">
            <span class="menu-title">Tables</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-table-large menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="table-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/tables/basic-tables/">Basic Table</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/tables/advanced-tables/">Advanced Table</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'user-page-dropdown'">
            <span class="menu-title">User Pages</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-lock menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="user-page-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/auth-pages/login/">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/auth-pages/login-2/">Login - 2</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/auth-pages/multi-level-login/">Multi Level Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/auth-pages/register/">Register</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/auth-pages/register-2/">Register - 2</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/auth-pages/lock-screen/">Lockscreen</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'error-page-dropdown'">
            <span class="menu-title">Error pages</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-security menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="error-page-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/error-pages/error-404/">404</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/error-pages/error-500/">500</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'general-page-dropdown'">
            <span class="menu-title">General Pages</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-medical-bag menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="general-page-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/blank-page/">Blank Page</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/profile/">Profile</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/faq-1/">FAQ</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/faq-2/">FAQ 2</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/news-grid/">News Grid</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/timeline/">Timeline</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/search-result/">Search Result</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/portfolio/">Portfolio</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/general-pages/user-listing/">User Listing</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item" v-on:click="collapseAll">
          <router-link class="nav-link" to="/popups/">
            <span class="menu-title">Popups</span>
            <i class="mdi mdi-forum menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item" v-on:click="collapseAll">
          <router-link class="nav-link" to="/notifications/">
            <span class="menu-title">Notifications</span>
            <i class="mdi mdi-bell-ring menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'form-elements'">
            <span class="menu-title">Forms</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-format-list-bulleted menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="form-elements">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/forms/basic-elements/">Basic Elements</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/forms/advanced-elements/">Advanced Elements</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/forms/wizard/">Wizard</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/forms/validation/">Validation</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item" v-on:click="collapseAll">
          <router-link class="nav-link" to="/text-editors/">
            <span class="menu-title">Text Editors</span>
            <i class="mdi mdi-file-document menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item" v-on:click="collapseAll">
          <router-link class="nav-link" to="/code-editors/">
            <span class="menu-title">Code Editors</span>
            <i class="mdi mdi-code-not-equal-variant menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'icons-dropdown'">
            <span class="menu-title">Icons</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-contacts menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="icons-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/icons/flag-icons/">Flag icons</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/icons/fontawesome/">Font Awesome</router-link>
              </li>
               <li class="nav-item">
                <router-link class="nav-link" to="/icons/mdi-icons/">MDI</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/icons/simpleline/">Simple line icons</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/icons/themify-icons/">Themify icons</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'e-commerce-page-dropdown'">
            <span class="menu-title">E-commerce</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-shopping menu-icon"></i>
          </span>
          <b-collapse accordion="sidebar-accordion" id="e-commerce-page-dropdown">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item">
                <router-link class="nav-link" to="/e-commerce/invoice/">Invoice</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/e-commerce/orders/">Orders</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/e-commerce/pricing-table/">Pricing Table</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/e-commerce/product-catalogue/">Product Catalogue</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/e-commerce/project-list/">Project list</router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item menu-items" v-on:click="collapseAll">
          <router-link class="nav-link" to="/general-pages/landing-page/">
            <span class="menu-icon">
              <i class="mdi mdi-table-large"></i>
            </span>
            <span class="menu-title">Landing Page</span>
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="http://www.bootstrapdash.com/demo/purple/vue/documentation/documentation.html">
            <span class="menu-title">Documentation</span>
            <i class="menu-icon mdi mdi-file-document-outline"></i>
          </a>
        </li>
        <li class="nav-item sidebar-actions">
          <span class="nav-link">
            <div class="border-bottom">
              <h6 class="font-weight-normal mb-3">Projects</h6>
            </div>
            <button class="btn btn-block btn-lg btn-gradient-primary mt-4">+ Add a project</button>
            <div class="mt-4">
              <div class="border-bottom">
                <p class="text-secondary">Categories</p>
              </div>
              <ul class="gradient-bullet-list mt-4">
                <li>Free</li>
                <li>Pro</li>
              </ul>
            </div>
          </span>
        </li> -->
      </ul>
    </nav>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "sidebar",
  data() {
    return {
      collapses: [{ show: false }, { show: false }, { show: false }],
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser", "getUserImage"]),
  },
  methods: {
    collapseAll() {
      var exp_elm = document.getElementsByClassName("show");
      if (exp_elm.length > 0) {
        var elm_id = exp_elm[0].id;
        this.$root.$emit("bv::toggle::collapse", elm_id);
      }
    },
  },
  mounted() {
    const body = document.querySelector("body");
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll(".sidebar .nav-item").forEach(function (el) {
      el.addEventListener("mouseover", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.add("hover-open");
        }
      });
      el.addEventListener("mouseout", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.remove("hover-open");
        }
      });
    });
  },
  watch: {
    $route() {
      document.querySelector("#sidebar").classList.toggle("active");
    },
  },
};
</script>
