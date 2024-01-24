<template>
  <div>
    <div class="user-details-container">
      <div class="user-details">
        <div class="card-header">
          <h2>User Details</h2>
          <button @click="goBack" class="btn btn-primary orange-button">
            <i class="mdi mdi-arrow-left"></i> Go Back
          </button>
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
    user() {
      return this.$store.state.user;
    },
  },
  async created() {
    const userId = this.$route.params.id;
    await this.$store.dispatch("fetchUserDetails", userId);
  },
  methods: {
    goBack() {
      // Use Vue Router to navigate back to the previous page
      this.$router.go(-1); // This will go back one step in the history
      // Alternatively, you can use this.$router.push('/your-route') to navigate to a specific route
    },
  },
};
</script>

<style scoped>
.user-details-container {
  display: flex;
}

.user-details {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  background-color: red;
  color: white;
  padding: 15px;
  margin: 0;
  border-radius: 8px 8px 0 0;
}
.card-header h2 {
  margin: 0;
}

.user-info {
  padding: 20px;
}

.user-info table {
  width: 100%;
  border-collapse: collapse;
}

.user-info tr {
  border-bottom: 1px solid #ddd;
}

.user-info td {
  padding: 10px;
}

.user-info td:first-child {
  font-weight: bold;
  width: 30%;
}

.orange-button {
  background-color: red;
  border-color: orange;
  color: white;
  float: right; /* Align to the right */
  margin-top: -40px; /* Adjust the margin to position it correctly */
}

.right-button {
  float: right;
}
</style>
