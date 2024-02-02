import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import BootstrapVue from "bootstrap-vue";
import VueSweetalert2 from "vue-sweetalert2";
import store from "./store";
import { authenticationMessages } from "./mixins/mixin";

// primevue
import PrimeVue from "primevue/config";

// theme and css
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import ToggleButton from "vue-js-toggle-button";
// primevue components
import ToastService from "primevue/toastservice";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.use(require("vue-moment"));
Vue.use(ToggleButton);
Vue.config.productionTip = false;

// primevue 2 component registration

Vue.use(PrimeVue);
Vue.use(ToastService);
Vue.mixin(authenticationMessages);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
