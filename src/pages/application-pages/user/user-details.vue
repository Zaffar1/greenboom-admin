<template>
  <div>
    <button @click="goBack" class="btn btn-secondary orange-button">
      <i class="mdi mdi-arrow-left"></i> Go Back
    </button>
    <div class="user-details-container">
      <div class="user-details">
        <div class="card-header">
          <h2>User Detail</h2>
        </div>
        <div class="user-info">
          <table>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{{ user.name }}</td>
            </tr>
            <tr>
              <td><strong>Last Name:</strong></td>
              <td>{{ user.last_name }}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{{ user.email }}</td>
            </tr>
            <tr>
              <td><strong>Type:</strong></td>
              <td>{{ user.type }}</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td>{{ user.status }}</td>
            </tr>
            <tr>
              <td><strong>Register Date:</strong></td>
              <td>{{ user.created_at | moment("dddd, MMMM Do YYYY") }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    /**
     * Retrieves the user state from the Vuex store.
     */
    user() {
      return this.$store.state.user;
    },
  },
  /**
   * Fetches user details when the component is created.
   */
  async created() {
    const userId = this.$route.params.id;
    await this.$store.dispatch("fetchUserDetails", userId);
  },
  methods: {
    /**
     * Navigates back to the previous page using Vue Router.
     */
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.user-details-container {
  display: flex;
  justify-content: center; /* Center the user details card */
  margin-top: 20px; /* Add margin for better spacing */
}

.user-details {
  width: 100%; /* Adjust the width as needed */
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.card-header {
  background-color: red;
  color: white;
  padding: 15px;
  border-radius: 5px 5px 0 0;
}

.card-header h2 {
  margin: 0;
}

/* .user-info {
  padding: 20px;
} */

.user-info table {
  width: 100%;
  border-collapse: collapse;
}

.user-info tr {
  border-bottom: 1px solid #ddd;
}

.user-info td {
  padding: 20px 10px;
}

.user-info td:first-child {
  font-weight: bold;
  width: 30%;
}

.orange-button {
  background-color: red;
  border-color: orange;
  color: white;
}
</style>
