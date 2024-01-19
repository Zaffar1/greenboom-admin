export const endpoints = {
  login: `login`, // POST email, password
  logout: `auth/logout`, // GET
  forgotPassword: "forgot-password",
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
    fetchAllVideoCat: `admin/video-categories`, // GET
    deleteVideoCat: "admin/delete-category",
    addVideoCat: "admin/add-category",
    videoCatStatus: "admin/video-cat-status",
    // videoStatus: "admin/video-status",
    editVideoCat: "admin/update-category",
    addVideo: "admin/add-video",
    fetchVideoCatVideos: "admin/video-cat-videos",
    editVideo: "admin/update-video",
    deleteVideo: "admin/delete-video",
    videoStatus: "admin/video-status",
    fetchAllVideos: "admin/all-videos",
  },
  products: {
    fetchProducts: `admin/all-products`, // GET
    addProduct: "admin/add-product", //POST
    deleteProduct: "admin/delete-product", // Delete
    addProductData: "admin/add-product-data", //POST
    fetchProductData: "admin/productData", /// GET
    deleteProductData: "admin/delete-product-data", /// Delete
    productStatus: "admin/product-status", //// POST
    fetchProductDataDetail: "admin/productDetails",
  },

  perfectSales: {
    fetchAll: "admin/all-perfect-sale",
    addPerfectSale: "admin/add-perfect-sale",
    editPerfectSale: "admin/update-perfect-sale",
    deletePerfectSale: "admin/delete-perfectSale",
    perfectSalesStatus: "admin/perfectSale-status",
    fetchPerfectMedia: "admin/perfect-sale-media",
    addPerfectSaleMedia: "admin/add-perfect-sale-media",
    editPerfectSaleMedia: "admin/update-perfect-sale-media",
    deletePerfectSaleMedia: "admin/delete-perfectSaleMedia",
    perfectSaleMediaStatus: "admin/perfectSaleMedia-status",
    fetchScriptMedia: "admin/script-media",
    addScriptMedia: "admin/add-script-data",
    editScriptData: "admin/update-script-data",
    deleteScriptData: "admin/delete-scriptData",
    addScript: "admin/add-script",
  },

  salesTips: {
    fetchAllSalesTips: "admin/all-sales-tips",
    addSalesTip: "admin/add-sales-tip",
    editSalesTip: "admin/update-sales-tip",
    salesTipStatus: "admin/sales-tip-status",
    deleteSalesTip: "admin/delete-sales-tip",
  },

  catalogs: {
    fetchCatalogsList: `admin/all-brouchers`, // GET
    addCatalog: "admin/add-catalog",
    editCatalog: "admin/update-catalog",
    deleteCatalog: "admin/delete-catalog",
    catalogStatus: "admin/catalog-status",
  },

  orderKit: {
    fetchAllOrderKit: "admin/all-order-kit",
  },

  // job: {
  //     fetchAll: `job/fetch`, // GET
  // }
};
