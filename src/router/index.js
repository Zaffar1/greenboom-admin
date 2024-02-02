import Vue from "vue";
import Router from "vue-router";
import login from "../pages/application-pages/login.vue";
import forgotPassword from "../pages/application-pages/forgotPassword.vue";
import layout from "../layout";

import { authGuard } from "../config/guards";

Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  scrollBehavior: () => ({ y: 0 }),
  mode: "history",
  base: "/greenboom-portal/",
  routes: [
    {
      path: "/",
      // path: "/greenboom-portal/",
      beforeEnter: authGuard,
      name: "base",
    },
    {
      path: "/login",
      component: login,
      name: "login",
    },
    {
      path: "/forgot-password",
      component: forgotPassword,
      name: "forgot-password",
    },

    {
      path: "/dashboard",
      component: layout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("@/pages/dashboard"),
        },
      ],
    },
    {
      path: "/my-profile",
      component: layout,
      children: [
        {
          path: "",
          name: "my-profile",
          component: () => import("@/pages/application-pages/my-profile"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "all-users",
          name: "all-users",
          component: () => import("@/pages/application-pages/user/all-users"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "welcome-videos",
          name: "welcome-videos",
          component: () =>
            import("@/pages/application-pages/welcomeVideos/welcomeVideos"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "add-welcome-video",
          name: "add-welcome-video",
          component: () =>
            import("@/pages/application-pages/welcomeVideos/addWelcomeVideo"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "training-list",
          name: "training-list",
          component: () =>
            import("@/pages/application-pages/training/training-list"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "training-media/:id/:title",
          name: "training-media",
          component: () =>
            import("@/pages/application-pages/training/training-media-list"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "add-training",
          name: "add-training",
          component: () =>
            import("@/pages/application-pages/training/addTraining"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "msds-sheets-list",
          name: "msds-sheets-list",
          component: () =>
            import("@/pages/application-pages/msdSheets/msds-sheets-list"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "product-list",
          name: "product-list",
          component: () =>
            import("@/pages/application-pages/products/product-list"),
        },
      ],
    },
    {
      path: "/videos",
      component: layout,
      children: [
        {
          path: "videos-list",
          name: "videos-list",
          component: () =>
            import("@/pages/application-pages/videos/videos-list"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "videoCat-videos/:id/:title",
          name: "videoCat-videos",
          component: () =>
            import("@/pages/application-pages/videos/videoCat-videos"),
        },
      ],
    },
    {
      path: "/videos",
      component: layout,
      children: [
        {
          path: "all-videos",
          name: "all-videos",
          component: () =>
            import("@/pages/application-pages/videos/all-videos"),
        },
      ],
    },
    {
      path: "/faqs",
      component: layout,
      children: [
        {
          path: "faqs-list",
          name: "faqs-list",
          component: () => import("@/pages/application-pages/faqs/faqs-list"),
        },
      ],
    },
    {
      path: "/perfectSales",
      component: layout,
      children: [
        {
          path: "perfectSales-list",
          name: "perfectSales-list",
          component: () =>
            import("@/pages/application-pages/perfectSales/perfect-sale-list"),
        },
      ],
    },
    {
      path: "/perfectSale",
      component: layout,
      children: [
        {
          path: "perfect-sale-media/:id/:title",
          name: "perfect-sale-media",
          component: () =>
            import(
              "@/pages/application-pages/perfectSales/perfect-sale-media-list"
            ),
        },
      ],
    },
    {
      path: "/scripts",
      component: layout,
      children: [
        {
          path: "script-media/:id/:title",
          name: "script-media",
          component: () =>
            import("@/pages/application-pages/perfectSales/script-media-list"),
        },
      ],
    },
    {
      path: "/products",
      component: layout,
      children: [
        {
          path: "product-data/:id/:data",
          name: "product-data",
          component: () =>
            import("@/pages/application-pages/products/product-data-list"),
        },
      ],
    },
    {
      path: "/products",
      component: layout,
      children: [
        {
          path: "product-detail/:id/:size",
          name: "product-detail",
          component: () =>
            import("@/pages/application-pages/products/product-detail"),
        },
      ],
    },
    {
      path: "/benDuffy",
      component: layout,
      children: [
        {
          path: "benDuffy-list",
          name: "benDuffy-list",
          component: () =>
            import("@/pages/application-pages/benDuffy/benDuffy-list"),
        },
      ],
    },
    {
      path: "/salesTips",
      component: layout,
      children: [
        {
          path: "sales-tips-list",
          name: "sales-tips-list",
          component: () =>
            import("@/pages/application-pages/salesTips/sales-tips-list"),
        },
      ],
    },
    {
      path: "/catalogs",
      component: layout,
      children: [
        {
          path: "catalog-list",
          name: "catalog-list",
          component: () =>
            import("@/pages/application-pages/catalogs/catalog-list"),
        },
      ],
    },
    {
      path: "/user",
      component: layout,
      children: [
        {
          path: "/user/:id",
          name: "user-details",
          component: () =>
            import("@/pages/application-pages/user/user-details"),
        },
      ],
    },
    {
      path: "/order",
      component: layout,
      children: [
        {
          path: "order-kit-list",
          name: "order-kit-list",
          component: () =>
            import("@/pages/application-pages/orderKit/order-kit-list"),
        },
      ],
    },
    {
      path: "/order",
      component: layout,
      children: [
        {
          path: "order-kit-detail/:id",
          name: "order-kit-detail",
          component: () =>
            import("@/pages/application-pages/orderKit/order-kit-detail"),
        },
      ],
    },
    {
      path: "/job",
      component: layout,
      children: [
        {
          path: "all-jobs",
          name: "all-jobs",
          component: () => import("@/pages/application-pages/job/all-jobs"),
        },
      ],
    },
    {
      path: "*",
      redirect: "/error-404",
      component: {
        render(c) {
          return c("router-view");
        },
      },
      children: [
        {
          path: "error-404",
          component: () => import("@/pages/samples/error-pages/error-404"),
        },
      ],
    },
  ],
});
