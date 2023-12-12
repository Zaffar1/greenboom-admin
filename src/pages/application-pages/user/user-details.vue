<template>
  <div class="user-details-container">
    <div class="user-details">
      <h2>User Details</h2>
      <button @click="goBack">Go Back</button>
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
          <!-- Add more rows for additional details -->
        </table>
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
  justify-content: center;
  align-items: center;
  /* min-height: 30vh; */
  min-height: auto;
}

.user-details {
  max-width: 500px;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

h2 {
  color: #333;
  background-color: #4caf50;
  color: white;
  padding: 15px;
  margin: 0;
  border-radius: 8px 8px 0 0;
}

.user-info {
  padding: 20px;
}

.user-info p {
  margin: 10px 0;
  font-size: 16px;
}
td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
td:first-child {
  font-weight: bold;
  width: 30%;
}
</style>
