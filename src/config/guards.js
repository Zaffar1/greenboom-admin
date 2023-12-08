import store from "../store";

export const authGuard = (to, from, next) => {
  let user = JSON.parse(localStorage.getItem("user"));
  !store.getters["isUserLoggedIn"] && (user == undefined || user == null)
    ? next("/login")
    : next("/dashboard");
};

export const authGuardReverse = (to, from, next) => {
  let user = JSON.parse(localStorage.getItem("user"));
  if (store.getters["isUserLoggedIn"] || user != null || user != undefined) {
    next();
  } else {
    next({ name: "base" });
  }
};
