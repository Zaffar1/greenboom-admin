export const endpoints = {
  login: `login`, // POST email, password
  logout: `auth/logout`, // GET
  // auth/admin/
  user: {
    fetchAll: `admin/users`, // GET
    fetchOne: `customer/verify/`, // GET id
    verify: `customer/verify`,
    updateStatus: `admin/user-status`,
    fetchUserDetail: "admin/user-detail",
    deleteUser: "admin/block-user",
    userStatus: "admin/user-status",
  },
  welcomeVideos: {
    fetchAll: `admin/all-welcome-videos`, // GET
    deleteMedia: `admin/delete-welcome-video`,
    addWelcomeVideo: `admin/add-welcome-video`,
    editWelcomeVideo: `admin/update-welcome-video`,
    videoStatus: `admin/change-status`,
  },
  trainings: {
    fetchAll: `admin/all-training`, // GET
    fetchMedia: `admin/training-media`,
    deleteTraining: "admin/delete-training",
    trainingStatus: "admin/training-status",
    addTraining: "admin/add-training",
    editTraining: "admin/update-training",
    addTrainingMedia: "admin/add-training-media",
    deleteTrainingMedia: "admin/delete-training-media",
    editTrainingMedia: "admin/update-training-media",
    trainingMediaStatus: "admin/training-media-status",
  },
  msdSheets: {
    fetchMsdSheetList: `admin/all-sheets`, // GET
    addMsdSheet: "admin/add-sheet",
    editMsdSheet: "admin/update-sheet",
    deleteMsdSheet: "admin/delete-sheet",
    msdSheetStatus: "admin/msd-sheet-status",
  },
  videos: {
    fetchAllVideos: `admin/all-videos`, // GET
    deleteVideo: "admin/delete-video",
    addVideo: "admin/add-video",
  },
  products: {
    fetchProducts: `admin/all-products`, // GET
  },
  // job: {
  //     fetchAll: `job/fetch`, // GET
  // }
};
