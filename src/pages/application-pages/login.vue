<template>
  <section class="login">
    <Toast :baseZIndex="9999" />
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth">
          <div class="row w-100 flex-grow">
            <div class="col-xl-4 col-lg-6 mx-auto">
              <div class="auth-form-light text-left p-5">
                <div class="brand-logo">
                  <!-- <img src="../../assets/images/supportsnap-logo2.png"> -->
                </div>
                <h4>Hello! let's get started</h4>
                <h6 class="font-weight-light">Log in to continue.</h6>
                <form @submit.prevent="login" class="pt-3">
                  <div class="form-group">
                    <input v-model="state.email" required type="email" class="form-control form-control-lg"
                      id="exampleInputEmail1" placeholder="Username">
                  </div>
                  <div class="form-group">
                    <input v-model="state.password" required type="password" class="form-control form-control-lg"
                      id="exampleInputPassword1" placeholder="Password">
                  </div>
                  <div class="mt-3">
                    <button class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn">LOG
                      IN</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- content-wrapper ends -->
      </div>
      <!-- page-body-wrapper ends -->
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reactive } from "vue";
import Toast from "primevue/toast";

export default {
  name: "login-2",
  components: {
    Toast,
  },
  setup() {
    const state = reactive({
      email: null,
      password: null,
    });
    return {
      state,
    };
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(["fetchUsers", "userLogin"]),
    async login() {
      let response = await this.userLogin({
        email: this.state.email,
        password: this.state.password,
      });
      this.showAuthenticationMessages(response);
      response.status == 200 ? this.$router.push({ name: "dashboard" }) : null;
    },
  },
  async mounted() { },
};
</script>
