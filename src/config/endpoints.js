export const endpoints = {
  login: `login`, // POST email, password
  logout: `auth/logout`, // GET
  // auth/admin/
  user: {
    fetchAll: `admin/users`, // GET
    fetchOne: `customer/verify/`, // GET id
    verify: `customer/verify`,
    updateStatus: `update-status`,
  },
  welcomeVideos: {
    fetchAll: `admin/all-welcome-videos`, // GET
    deleteMedia: `admin/delete-welcome-video`,
  },
  trainings: {
    fetchAll: `admin/all-training`, // GET
    fetchMedia: `admin/training-media`,
    deleteTraining: "admin/delete-training",
  },
  msdSheets: {
    fetchMsdSheetList: `admin/all-sheets`, // GET
  },
  products: {
    fetchProducts: `admin/all-products`, // GET
  },
  // job: {
  //     fetchAll: `job/fetch`, // GET
  // }
};
