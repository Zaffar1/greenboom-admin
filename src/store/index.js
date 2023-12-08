import Vuex from "vuex";
import Vue from "vue";
import router from "../router";
import Toast from "primevue/toast";

import { endpoints } from "../config/endpoints";
import API from "../config/api";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,

    currentUser: {},
    token: null,

    allUsers: [],
    welcomeVideos: [],
    trainings: [],
    trainingMedia: [],
    allJobs: [],

    imageUrl:
      process.env.NODE_ENV === "production"
        ? process.env.VUE_APP_IMAGE_URL_SERVER
        : process.env.VUE_APP_IMAGE_URL_LOCAL,
    defaultImage:
      "https://res.cloudinary.com/dflj1n3fn/image/upload/v1690274484/wold_r5bnpw.jpg",
  },
  getters: {
    getImageUrl: (state) => state.imageUrl,
    getDefaultImage: (state) => state.defaultImage,

    isLoading: (state) => state.isLoading,

    isUserLoggedIn: (state) => {
      return Object.keys(state.currentUser).length == 0 ? false : true;
    },
    getCurrentUser: (state) => state.currentUser,
    getUsers: (state) => state.allUsers,
    getWelcomeVideos: (state) => state.welcomeVideos,
    getTrainings: (state) => state.trainings,
    getTrainingMedia: (state) => state.trainingMedia,
    getUserImage: (state, getters) => {
      return getters.getCurrentUser.profile_image === null
        ? getters.getDefaultImage
        : getters.getImageUrl + getters.getCurrentUser.profile_image;
    },

    getJobs: (state) => state.allJobs,
    getJob: (state) => (id) =>
      state.allJobs.filter((element) => element.id == id)[0],
  },
  actions: {
    userLogin: async ({ commit }, data) => {
      try {
        let response = await API.post(endpoints.login, data);
        commit("setUserLogin", response.data);
        console.log(response);
        return response;
      } catch (error) {
        return error.response;
      }
    },
    verifyUser: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.user.verify);
        commit("setUserLogin", response.data);
        return true;
      } catch (error) {
        return error.response;
      }
    },
    logoutUser: async ({ commit }) => {
      commit("clearUserAuth");
      router.push({ name: "base" });
    },
    fetchUsers: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.user.fetchAll);
        commit("setUsers", response.data.users);
        return true;
      } catch (error) {
        return error.response;
      }
    },
    fetchWelcomeVideos: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.welcomeVideos.fetchAll);
        commit("setWelcomeVideos", response.data.all_welcome_videos);
        // console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },
    fetchTrainings: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.trainings.fetchAll);
        commit("setTrainings", response.data.all_training);
        // console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },
    fetchTrainingMedia: async ({ commit }, id) => {
      try {
        let response = await API.get(`${endpoints.trainings.fetchMedia}/${id}`);
        commit("setTrainingMedia", response.data.training_media);
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },
    fetchJobs: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.job.fetchAll);
        commit("setJobs", response.data.jobs);
        return true;
      } catch (error) {
        return error.response;
      }
    },
  },
  mutations: {
    setUsers: (state, users) => (state.allUsers = users),
    setWelcomeVideos: (state, welcomeVideos) =>
      (state.welcomeVideos = welcomeVideos),
    setTrainings: (state, trainings) => (state.trainings = trainings),
    setTrainingMedia: (state, trainingMedia) =>
      (state.trainingMedia = trainingMedia),
    setJobs: (state, jobs) => (state.allJobs = jobs),
    setUserLogin: (state, data) => {
      state.currentUser = data.user;
      state.token = data.user.api_token;

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.user.api_token);
    },
    clearUserAuth: (state) => {
      state.currentUser = {};
      state.apiToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
