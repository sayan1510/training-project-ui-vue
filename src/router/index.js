import Vue from "vue";
import VueRouter from "vue-router";
// import Home_View from "../views/HomeView.vue";
import LoginPage from "../components/LoginPage.vue";
import RegistrationPage from "../components/RegistrationPage.vue";
import UserDetails from "../components/UserDetails.vue";
// import About from "../components/About.vue";
// import store from "../store.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      if (Object.prototype.hasOwnProperty.call(JSON.parse(localStorage.getItem("user")), "email")) {
        next({ name: "userdetails" });
      } else next();
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegistrationPage,
    beforeEnter: (to, from, next) => {
      if (Object.prototype.hasOwnProperty.call(JSON.parse(localStorage.getItem("user")), "email")) {
        next({ name: "userdetails" });
      } else next();
    },
  },
  {
    path: "/userdetails",
    name: "userdetails",
    component: UserDetails,
    beforeEnter: (to, from, next) => {
      // console.log(to);
      // console.log(from);
      // console.log(store.state.userData);
      if (!Object.prototype.hasOwnProperty.call(JSON.parse(localStorage.getItem("user")), "email")) {
        next({ name: "home" });
      } else next();
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

// let isAuthenticated = false;
// function checkAuthentication() {
//   if (store.state.userData != {__ob__: "Observer"}) isAuthenticated = true;
//   console.log(store.state.userData);
// }

// if (to.name === "userdetails" && from.name === "home" && !isAuthenticated)
// next({ name: "home" });
// else if (to.name === "home" && from.name === "userdetails" && isAuthenticated)
// next({ name: "userdetails" });

// router.beforeEach((to, from, next) => {
//   console.log(to);
//   console.log(from);
//   console.log(store.state.userData);
//   // checkAuthentication();
//   if(to.meta.isAuthenticated){
//     if(!store.state.userData.hasOwnProperty('email')){
//       next({ name: "home" });
//     }
//     else next();
//   }
//   else next();
// });

export default router;
