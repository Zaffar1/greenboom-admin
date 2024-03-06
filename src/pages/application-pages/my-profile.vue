<template>
  <section class="user-listing">
    <div class="text-right mb-2">
      <b-button
        @click="editProfileModal"
        variant="success"
        class="orange-button btn-secondary"
      >
        <i class="mdi mdi-plus"></i> Edit Profile
      </b-button>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="user-avatar mb-auto">
              <img
                :src="getUserImage"
                alt="profile image"
                class="profile-img img-lg rounded-circle"
              />
              <!-- <span class="edit-avatar-icon"
                ><i class="mdi mdi-camera"></i
              ></span> -->
            </div>
            <table class="user-details-table">
              <tr>
                <td class="label"><strong>Name:</strong></td>
                <td>{{ getCurrentUser.name }}</td>
              </tr>
              <tr>
                <td class="label"><strong>Last Name:</strong></td>
                <td>{{ getCurrentUser.last_name }}</td>
              </tr>
              <tr>
                <td class="label"><strong>Email:</strong></td>
                <td>{{ getCurrentUser.email }}</td>
              </tr>
              <tr>
                <td class="label"><strong>Role:</strong></td>
                <td>{{ getCurrentUser.type }}</td>
              </tr>
              <!-- Add other user details as needed -->
            </table>
          </div>
        </div>
        <b-modal v-model="editProfileModel" title="Edit Profile" hide-footer>
          <form @submit.prevent="submitEditForm">
            <b-form-group label="Name" label-for="editInputTitle">
              <b-form-input
                v-model="editName"
                id="editInputTitle"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Last Name" label-for="editInputTitle">
              <b-form-input
                v-model="editLastName"
                id="editInputTitle"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Upload file" label-for="editInputFile">
              <b-form-file
                v-model="editFile"
                id="editInputFile"
                :state="Boolean(editFile)"
                placeholder="Choose a file..."
                accept=".jpg, .png, .jpeg"
              ></b-form-file>
            </b-form-group>
            <b-form-group label="New Password" label-for="editInputPassword">
              <b-form-input
                v-model="editNewPassword"
                id="editInputPassword"
                :type="showNewPassword ? 'text' : 'password'"
              ></b-form-input>
              <b-button @click="togglePasswordVisibility('new')">
                <b-icon
                  :icon="showNewPassword ? 'eye-slash-fill' : 'eye-fill'"
                ></b-icon>
              </b-button>
            </b-form-group>
            <b-form-group label="Confirm Password" label-for="editInputConf">
              <b-form-input
                v-model="editConfirmPassword"
                id="editInputConf"
                :type="showConfirmPassword ? 'text' : 'password'"
                :required="isConfirmPasswordRequired"
              ></b-form-input>
              <b-button @click="togglePasswordVisibility('confirm')">
                <b-icon
                  :icon="showConfirmPassword ? 'eye-slash-fill' : 'eye-fill'"
                ></b-icon>
              </b-button>
            </b-form-group>
            <!-- You can add more fields as needed -->

            <b-button
              type="submit"
              variant="success"
              class="orange-button popUp"
              :disabled="isLoading"
            >
              {{ isLoading ? "Uploading..." : "Upload" }}
            </b-button>
          </form>
        </b-modal>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import API from "../../config/api";
import { endpoints } from "../../config/endpoints";
export default {
  name: "MyProfile",
  data: function () {
    return {
      isLoading: false,
      editProfileModel: false,
      editName: "",
      editLastName: "",
      editFile: null,
      editNewPassword: "",
      editConfirmPassword: "",
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser", "getUserImage"]),
    isConfirmPasswordRequired() {
      return this.editNewPassword !== "";
    },
  },
  methods: {
    editProfileModal() {
      this.editName = this.getCurrentUser.name;
      this.editLastName = this.getCurrentUser.last_name;
      this.editFile = null;
      this.editNewPassword = "";
      this.editConfirmPassword = "";
      this.editProfileModel = true;
      this.isLoading = false;
    },

    async submitEditForm() {
      if (this.editNewPassword !== this.editConfirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password doesn't match",
          text: "New password and confirm password doesn't match",
        });
      } else {
        // console.log("user id", this.getCurrentUser.id);
        this.isLoading = true;
        const editedFormData = new FormData();
        editedFormData.append("name", this.editName);
        editedFormData.append("last_name", this.editLastName);
        editedFormData.append("new_password", this.editNewPassword);
        if (this.editFile) {
          editedFormData.append("profile_image", this.editFile);
        }

        // Add an identifier for the edited item (e.g., item ID) to the form data
        editedFormData.append("id", this.getCurrentUser.id);

        try {
          // Send a request to update the user's profile
          // Replace 'API.post' with your actual API call
          const response = await API.post(
            endpoints.user.editUser,
            editedFormData
          );
          this.isLoading = true;
          // Handle success
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "User profile edited successfully",
          }).then(() => {
            // Get the updated user record from the response
            const updatedUser = response.data;

            // Update the user record in the Vuex store
            this.$store.commit("setUserLogin", updatedUser);
            this.editProfileModel = false;
          });

          this.editProfileModel = false; // Close the modal after success
        } catch (error) {
          // Handle error
          console.error("Error editing user profile:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while editing user profile",
          });
        }
        this.editProfileModel = false;
      }
    },
    togglePasswordVisibility(field) {
      if (field === "new") {
        this.showNewPassword = !this.showNewPassword;
      } else if (field === "confirm") {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
/* Your existing styles remain here */

.user-details-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.user-details-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.user-details-table .label {
  font-weight: bold;
  width: 30%;
}

.orange-button {
  background-color: #ff002d;
  border-color: orange;
  color: white;
}
</style>
