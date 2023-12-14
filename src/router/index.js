import Vue from "vue";
import Router from "vue-router";
import login from "../pages/application-pages/login.vue";

import layout from "../layout";

import { authGuard } from "../config/guards";

Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  scrollBehavior: () => ({ y: 0 }),
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/",
      beforeEnter: authGuard,
      name: "base",
    },
    {
      path: "/login",
      component: login,
      name: "login",
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
