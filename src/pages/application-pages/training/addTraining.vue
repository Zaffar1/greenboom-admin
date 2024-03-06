<template>
  <section class="forms">
    <div class="col-md-6 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Training Media</h4>
          <p class="card-description">Add Training Form</p>
          <form @submit.stop.prevent="addTraining" class="forms-sample">
            <b-form-group label="Title" label-for="input5">
              <b-form-input
                type="text"
                id="input5"
                v-model="posts.title"
                placeholder="Type Title"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Description" label-for="input6">
              <b-form-input
                type="text"
                id="input6"
                v-model="posts.description"
                placeholder="Type Description"
                required
              ></b-form-input>
            </b-form-group>
            <!-- <b-form-group label="Upload file" label-for="input8">
                <b-form-file
                  v-model="posts.file"
                  id="inpu8"
                  placeholder="Choose a file..."
                  required
                ></b-form-file>
              </b-form-group> -->
            <b-button type="submit" variant="success" class="mr-2"
              >Submit</b-button
            >
            <router-link :to="{ name: 'training-list' }">
              <b-button variant="light">Cancel</b-button>
            </router-link>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="js">
import API from "../../../config/api";
import { endpoints } from "../../../config/endpoints";
import Swal from "sweetalert2";

export default {
  name: 'basicFormsElements',
  data () {
    return {
      file: null,
      posts: {
                title: "",
            },

    }
  },
  methods:{

 /**
 * Asynchronously adds a welcome video.
 */
    async addWelcomeVideo(){
      // console.log("Hello Welcome to Add Video");
      const formData = new FormData();
      formData.append("title", this.posts?.title);
      formData.append("description", this.posts?.description);
      formData.append("file", this.posts?.file);
      await API.post(endpoints.welcomeVideos.addWelcomeVideo,formData).then((resp) => {
                console.log(resp)
                Swal.fire({
                title: 'Welcome Video Added',
                text: 'Welcome video has been successfully added!',
                icon: 'success',
             })
                this.$router.push('/user/welcome-videos')
            });
    }
  }
}
</script>
