<template>
    <section class="user-listing">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="user-avatar mb-auto">
                            <img :src="getUserImage" alt="profile image"
                                class="profile-img img-lg rounded-circle" />
                            <span class="edit-avatar-icon"><i class="mdi mdi-camera"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    name: "my-profile",
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['getCurrentUser', 'getUserImage'])
    },
    methods: {},
    mounted() { },
};
</script>
