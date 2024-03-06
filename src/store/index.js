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
    user: {},
    allUsers: [],
    welcomeVideos: [],
    trainings: [],
    trainingTitle: {},
    trainingMedia: [],
    msdSheets: [],
    catalogs: [],
    orderkit: [],
    products: [],
    salesTips: [],
    allJobs: [],
    videos: [],
    VideosCatVideos: [],
    allVideos: [],
    perfectSales: [],
    perfectSaleMedia: [],
    scriptMedia: [],
    productData: [],
    productDataDetail: [],
    productDetail: [],

    imageUrl:
      process.env.NODE_ENV === "production" || "/"
        ? process.env.VUE_APP_IMAGE_URL_SERVER
        : process.env.VUE_APP_IMAGE_URL_LOCAL,
    defaultImage:
      "https://greenboom-bucket.s3.us-east-2.amazonaws.com/profile/dummy.png",
    // "https://res.cloudinary.com/dflj1n3fn/image/upload/v1690274484/wold_r5bnpw.jpg",
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
    getMsdSheets: (state) => state.msdSheets,
    getCatalogs: (state) => state.catalogs,
    getOrderKitList: (state) => state.orderkit,
    getVideos: (state) => state.videos,
    getVideosCatVideos: (state) => state.VideosCatVideos,
    getAllVideos: (state) => state.allVideos,
    getPerfectSales: (state) => state.perfectSales,
    getPerfectSaleMedia: (state) => state.perfectSaleMedia,
    getScriptMedia: (state) => state.scriptMedia,
    getProductData: (state) => state.productData,
    getProductDetail: (state) => state.productDetail,
    getProductDataDetail: (state) => state.productDataDetail,
    getSalesTips: (state) => state.salesTips,
    getProducts: (state) => state.products,
    getUserImage: (state, getters) => {
      return getters.getCurrentUser.profile_image === null
        ? getters.getDefaultImage
        : getters.getImageUrl + "/" + getters.getCurrentUser.profile_image;
    },

    getJobs: (state) => state.allJobs,
    getJob: (state) => (id) =>
      state.allJobs.filter((element) => element.id == id)[0],
  },
  actions: {
    /**
     * Logs in the user by sending a POST request with login data.
     * @param {Object} data - The login data including username and password.
     * @returns {Promise} A Promise that resolves to the response data or rejects with an error response.
     */
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

    /**
     * Verifies the user by sending a GET request to verify endpoint.
     * @returns {Promise} A Promise that resolves to a boolean indicating verification success or rejects with an error response.
     */
    verifyUser: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.user.verify);
        commit("setUserLogin", response.data);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Logs out the user by clearing user authentication and redirecting to base route.
     */
    logoutUser: async ({ commit }) => {
      commit("clearUserAuth");
      router.push({ name: "base" });
    },

    /**
     * Fetches all users by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchUsers: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.user.fetchAll);
        commit("setUsers", response.data.users);
        console.log("all_userss", response.data.users);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches details of a specific user by sending a GET request with user ID.
     * @param {string} userId - The ID of the user whose details to fetch.
     */
    async fetchUserDetails({ commit }, userId) {
      try {
        let response = await API.get(
          `${endpoints.user.fetchUserDetail}/${userId}`
        );
        console.log("user", response.user_detail);
        // const userData = await response.json();
        commit("setUser", response.data.user_detail);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },

    /**
     * Deletes a user by sending a POST request with user ID.
     * @param {string} id - The ID of the user to delete.
     * @returns {Promise} A Promise that resolves to a boolean indicating deletion success or rejects with an error response.
     */
    deleteUser: async ({ commit }, id) => {
      try {
        let response = await API.post(`${endpoints.user.deleteUser}/${id}`);
        i;
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Updates the status of a user by sending a POST request with the user ID.
     * @param {string} id - The ID of the user whose status to update.
     * @returns {Promise} A Promise that resolves to a boolean indicating update success or rejects with an error response.
     */
    updateUserStatus: async ({ commit }, id) => {
      try {
        let response = await API.post(`${endpoints.user.userStatus}/${id}`);
        // i;
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all welcome videos by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
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

    /**
     * Fetches a specific welcome video by sending a DELETE request with the video ID.
     * @param {string} id - The ID of the welcome video to fetch.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchWelcomeVideoId: async ({ commit }, id) => {
      try {
        let response = await API.delete(
          `${endpoints.welcomeVideos.deleteMedia}/${id}`
        );
        i;
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all trainings by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
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

    /**
     * Deletes a specific training by sending a DELETE request with the training ID.
     * @param {string} id - The ID of the training to delete.
     * @returns {Promise} A Promise that resolves to a boolean indicating deletion success or rejects with an error response.
     */
    fetchTrainingId: async ({ commit }, id) => {
      try {
        let response = await API.delete(
          `${endpoints.trainings.deleteTraining}/${id}`
        );
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches training media by sending a GET request with the training ID.
     * @param {string} id - The ID of the training to fetch media for.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchTrainingMedia: async ({ commit }, id) => {
      try {
        let response = await API.get(`${endpoints.trainings.fetchMedia}/${id}`);
        commit("setTrainingMedia", response.data.data);
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all MSD sheets by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchMsdSheets: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.msdSheets.fetchMsdSheetList);
        commit("setMsdSheets", response.data.all_msds);
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches the list of catalogs by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchCatalogList: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.catalogs.fetchCatalogsList);
        commit("setCatalogs", response.data.all_catalogs);
        console.log("response data", response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches the list of order kits by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchOrderKitList: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.orderKit.fetchAllOrderKit);
        commit("setOrderKitList", response.data.kit_data);
        console.log("response data", response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all video categories by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchVideoCat: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.videos.fetchAllVideoCat);
        commit("setVideos", response.data.video_categories);
        // console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Deletes a video by sending a DELETE request with the video ID.
     * @param {string} id - The ID of the video to delete.
     * @returns {Promise} A Promise that resolves to a boolean indicating deletion success or rejects with an error response.
     */
    deleteVideo: async ({ commit }, id) => {
      try {
        let response = await API.delete(
          `${endpoints.videos.deleteVideo}/${id}`
        );
        i;
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all videos by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchAllVideos: async ({ commit }, id) => {
      try {
        let response = await API.get(endpoints.videos.fetchAllVideos);
        commit("setAllVideos", response.data.all_videos);
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches videos of a specific video category by sending a GET request with the category ID.
     * @param {string} id - The ID of the video category whose videos to fetch.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchVideoCatVideos: async ({ commit }, id) => {
      try {
        let response = await API.get(
          `${endpoints.videos.fetchVideoCatVideos}/${id}`
        );
        commit("setVideoCatVideos", response.data.videos);
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all Perfect Sales data by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchPerfectSales: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.perfectSales.fetchAll);
        commit("setPerfectSales", response.data.all_data);
        // console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Deletes a Perfect Sales data entry by sending a DELETE request with the data ID.
     * @param {string} id - The ID of the Perfect Sales data entry to delete.
     * @returns {Promise} A Promise that resolves to a boolean indicating deletion success or rejects with an error response.
     */
    fetchPerfectSaleId: async ({ commit }, id) => {
      try {
        let response = await API.delete(
          `${endpoints.perfectSales.deletePerfectSale}/${id}`
        );
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches Perfect Sales media data by sending a GET request with the data ID.
     * @param {string} id - The ID of the Perfect Sales data whose media to fetch.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchPerfectSaleData: async ({ commit }, id) => {
      try {
        let response = await API.get(
          `${endpoints.perfectSales.fetchPerfectMedia}/${id}`
        );
        commit("setPerfectSaleMedia", response.data.data);
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches script media data by sending a GET request with the script ID.
     * @param {string} id - The ID of the script whose media to fetch.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchScriptData: async ({ commit }, id) => {
      try {
        let response = await API.get(
          `${endpoints.perfectSales.fetchScriptMedia}/${id}`
        );
        commit("setScriptMedia", response.data.data);
        console.log("scriptmedia", response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches product data by sending a GET request with the product ID.
     * @param {string} id - The ID of the product whose data to fetch.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchProductData: async ({ commit }, id) => {
      try {
        let response = await API.get(
          `${endpoints.products.fetchProductData}/${id}`
        );
        commit("setProductData", response.data.data);
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches product data detail by sending a GET request with the product ID.
     * @param {string} id - The ID of the product whose data detail to fetch.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchProductDataDetail: async ({ commit }, id) => {
      try {
        let response = await API.get(
          `${endpoints.products.fetchProductDataDetail}/${id}`
        );
        commit("setProductDataDetail", response.data.detail);
        console.log("product detail mister", response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all sales tips by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchSalesTips: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.salesTips.fetchAllSalesTips);
        commit("setSalesTips", response.data.sales_tips_list);
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all products by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
    fetchProducts: async ({ commit }) => {
      try {
        let response = await API.get(endpoints.products.fetchProducts);
        commit("setProducts", response.data.all_products);
        // console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Deletes a product by sending a DELETE request with the product ID.
     * @param {string} id - The ID of the product to delete.
     * @returns {Promise} A Promise that resolves to a boolean indicating deletion success or rejects with an error response.
     */
    deleteProduct: async ({ commit }, id) => {
      try {
        let response = await API.delete(
          `${endpoints.products.deleteProduct}/${id}`
        );
        i;
        console.log(response);
        return true;
      } catch (error) {
        return error.response;
      }
    },

    /**
     * Fetches all jobs by sending a GET request.
     * @returns {Promise} A Promise that resolves to a boolean indicating fetching success or rejects with an error response.
     */
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
    setUser(state, user) {
      state.user = user;
    },
    setWelcomeVideos: (state, welcomeVideos) =>
      (state.welcomeVideos = welcomeVideos),
    setTrainings: (state, trainings) => (state.trainings = trainings),
    setTrainingMedia: (state, trainingMedia) =>
      (state.trainingMedia = trainingMedia),
    setMsdSheets: (state, msdSheets) => (state.msdSheets = msdSheets),
    setCatalogs: (state, catalogs) => (state.catalogs = catalogs),
    setOrderKitList: (state, orderkit) => (state.orderkit = orderkit),
    setVideos: (state, videos) => (state.videos = videos),
    setVideoCatVideos: (state, VideosCatVideos) =>
      (state.VideosCatVideos = VideosCatVideos),
    setAllVideos: (state, allVideos) => (state.allVideos = allVideos),
    setPerfectSales: (state, perfectSales) =>
      (state.perfectSales = perfectSales),
    setPerfectSaleMedia: (state, perfectSaleMedia) =>
      (state.perfectSaleMedia = perfectSaleMedia),
    setScriptMedia: (state, scriptMedia) => (state.scriptMedia = scriptMedia),
    setSalesTips: (state, salesTips) => (state.salesTips = salesTips),
    setProducts: (state, products) => (state.products = products),
    setProductData: (state, productData) => (state.productData = productData),
    setProductDetail(state, data) {
      state.productDetail = data;
    },
    setProductDataDetail: (state, productDataDetail) =>
      (state.productDataDetail = productDataDetail),
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
