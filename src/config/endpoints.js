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
  },
  trainings: {
    fetchAll: `admin/all-training`, // GET
    fetchMedia: `admin/training-media`,
  },
  // job: {
  //     fetchAll: `job/fetch`, // GET
  // }
};
