<template>
  <section class="user-listing">
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
              <span class="edit-avatar-icon"
                ><i class="mdi mdi-camera"></i
              ></span>
            </div>
            <div class="user-details mt-3">
              <h4 class="mb-2">
                <strong>Name:</strong> {{ getCurrentUser.name }}
              </h4>
              <p class="mb-2">
                <strong>Last Name:</strong> {{ getCurrentUser.last_name }}
              </p>
              <p class="mb-2">
                <strong>Email:</strong> {{ getCurrentUser.email }}
              </p>
              <p class="mb-2">
                <strong>Role:</strong> {{ getCurrentUser.type }}
              </p>
              <!-- Add other user details as needed -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "my-profile",
  computed: {
    ...mapGetters(["getCurrentUser", "getUserImage"]),
  },
  methods: {},
  mounted() {},
};
</script>
