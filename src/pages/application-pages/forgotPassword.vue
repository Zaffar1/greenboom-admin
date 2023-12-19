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
                  <h1
                    style="
                      text-align: center;
                      color: cadetblue;
                      font-family: Arial, Helvetica, sans-serif;
                    "
                  >
                    Forgot Password
                  </h1>
                </div>
                <h4>Hello! enter your email address here!</h4>
                <!-- <h6 class="font-weight-light">Log in to continue.</h6> -->
                <form @submit.prevent="forgotPassword" class="pt-3">
                  <div class="form-group">
                    <input
                      v-model="email"
                      required
                      type="email"
                      class="form-control form-control-lg"
                      id="exampleInputEmail1"
                      placeholder="Enter Email"
                    />
                  </div>
                  <!-- <div class="form-group">
                    <input
                      v-model="state.password"
                      required
                      type="password"
                      class="form-control form-control-lg"
                      id="exampleInputPassword1"
                      placeholder="Password"
                    />
                  </div>-->

                  <div class="mt-3">
                    <button
                      class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                    >
                      Send Link
                    </button>
                  </div>
                </form>
                <div style="padding-top: 2%" class="text-right">
                  <button
                    class="btn btn-secondary"
                    style="text-decoration: none"
                    @click="goBack"
                  >
                    Back to login
                  </button>
                </div>
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
import Swal from "sweetalert2";
import API from "../../config/api";
import { endpoints } from "../../config/endpoints";

export default {
  name: "forgotPassword",
  setup() {},
  data() {
    return {
      email: null,
    };
  },
  methods: {
    async forgotPassword() {
      try {
        // Use an object to send email as part of the request body
        let result = await API.post(endpoints.forgotPassword, {
          email: this.email,
        });

        // Show success message
        Swal.fire("Success!", "Check your email for a link.", "success");
        this.$router.push({ name: "login" });
      } catch (error) {
        // Handle any errors during forgot password
        console.error("Error resetting user password:", error);
        Swal.fire(
          "Error!",
          "An error occurred during forgot password.",
          "error"
        );
      }
    },
    goBack() {
      // Use Vue Router to navigate back to the previous page
      this.$router.go(-1); // This will go back one step in the history
      // Alternatively, you can use this.$router.push('/your-route') to navigate to a specific route
    },
  },
};
</script>
