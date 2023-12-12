<template>
  <section class="forms">
    <div class="col-md-6 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Welcome Video</h4>
          <p class="card-description">Add Welcome Video Form</p>
          <form class="forms-sample">
            <b-form-group label="Title" label-for="input5">
              <b-form-input
                type="text"
                id="input5"
                placeholder="Type Title"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Description" label-for="input6">
              <b-form-input
                type="text"
                id="input6"
                placeholder="Type Description"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Upload file" label-for="input8">
              <b-form-file
                v-model="file"
                id="inpu8"
                :state="Boolean(file)"
                placeholder="Choose a file..."
                required
              ></b-form-file>
            </b-form-group>
            <b-button type="submit" variant="success" class="mr-2"
              >Submit</b-button
            >
            <router-link :to="{ name: 'welcome-videos' }">
              <b-button variant="light">Cancel</b-button>
            </router-link>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="js">
export default {
  name: 'basicFormsElements',
  data () {
    return {
      file: null,
      options: [
        { value: null, text: 'Please select an option' },
        { value: 'a', text: 'This is First option' },
        { value: 'b', text: 'Selected Option' },
        { value: {'C': '3PO'}, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
      ],
      GenderSelect: [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' }
      ],
      Category: [
        { value: 'a', text: 'Category 1' },
        { value: 'b', text: 'Category 2' },
        { value: 'c', text: 'Category 3' },
        { value: 'd', text: 'Category 4' },
        { value: 'e', text: 'Category 5' }
      ],
      countries: [
        { value: 'America', text: 'America' },
        { value: 'Italy', text: 'Italy' },
        { value: 'Russia', text: 'Russia' },
        { value: 'China', text: 'China' },
        { value: 'Britain', text: 'Britain' }
      ]
    }
  }
}
</script>
