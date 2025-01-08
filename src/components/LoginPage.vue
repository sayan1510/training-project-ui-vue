<template>
  <v-container class="login-container">
    <v-card class="pa-5" elevation="4" :min-width="500">
      <v-col class="login-details" cols="12">
        <v-card-title class="login-details__heading">Login</v-card-title>
        <div class="d-flex justify-center">
          <v-img
            v-if="getTime == 'Good Morning'"
            src="../assets/icons8-morning.gif"
            max-height="23"
            max-width="23"
          ></v-img
          ><v-img
            v-if="getTime == 'Good Afternoon'"
            src="../assets/icons8-sun-noon.gif"
            max-height="23"
            max-width="23"
          ></v-img
          ><v-img
            v-if="getTime == 'Good Evening'"
            src="../assets/icons8-evening.gif"
            max-height="23"
            max-width="23"
          ></v-img
          ><v-img
            v-if="getTime == 'Good Night'"
            src="../assets/icons8-night.gif"
            max-height="23"
            max-width="23"
          ></v-img
          ><span class="show_time pa-0 mx-1">{{ getTime }}</span>
        </div>
        <br />
        <v-text-field
          id="email"
          v-model="loginData.email"
          label="Email ID"
          :rules="[rules.required, rules.idValidator, rules.spaceAllowance]"
          prepend-icon="mdi-email"
          clearable
          autofocus
        ></v-text-field>
        <v-text-field
          id="pass"
          v-model="loginData.password"
          :type="show1 ? 'text' : 'password'"
          label="Password"
          :append-icon="getAppendIcon"
          @click:append="show1 = !show1"
          :rules="[rules.required, rules.min, rules.spaceAllowance]"
          prepend-icon="mdi-lock"
          @keyup.enter="showDetails"
          clearable
        ></v-text-field>
        <v-btn @click="showDetails" type="submit" block color="primary" :loading="loading" 
          >Login</v-btn
        >
        <v-card-text class="login-details__register"
          ><router-link to="/register"
            >Click here to Register</router-link
          ></v-card-text
        >
        <v-snackbar v-model="snackbar" :color="snackbarColour">
          {{ loginData.output }}
          <template v-slot:action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-card>
  </v-container>
</template>

<script>
import ProjectService from "@/dataproviders/project-service.js";
const projectService = new ProjectService();

// import axios from "axios";
export default {
  name: "LoginPage",
  data() {
    return {
      show1: false,
      snackbar: false,
      snackbarColour: "",
      loading: false,
      loginData: {
        email: "",
        password: "",
        output: "",
      },
      rules: {
        required: (val) => !!val || "Value Required",
        min: (val) =>
          (val && val.length >= 8) || "Minimum 8 Characters are Required",
        idValidator: (val) =>
          (val && val.includes("@")) || "Enter Valid Email ID",
        spaceAllowance: (v) => (v && v.trim !== "") || "Space is not allowed",
      },
    };
  },
  computed: {
    getTime() {
      let currentTime = new Date().getHours();
      switch (true) {
        case currentTime >= 6 && currentTime < 12:
          return "Good Morning";
        case currentTime >= 12 && currentTime < 18:
          return "Good Afternoon";
        case currentTime >= 18 && currentTime < 23:
          return "Good Evening";
        default:
          return "Good Night";
      }
    },
    getAppendIcon() {
      if (
        this.loginData.password &&
        this.loginData.password.length &&
        this.show1
      ) {
        return "mdi-eye";
      } else if (
        this.loginData.password &&
        this.loginData.password.length &&
        !this.show1
      ) {
        return "mdi-eye-off";
      } else return "";
    },
  },
  methods: {
    togglePasswordVisibility() {
      return this.show1 ? "mdi-eye" : "mdi-eye-off";
    },
    showDetails() {
      if (
        !this.loginData.email.trim().length ||
        !this.loginData.password.trim().length
      )
        return;

      this.loading = true;
      projectService.validateLogin({
        email: this.loginData.email,
        password: this.loginData.password,
      })
        .then((response) => {
          this.loginData.output = response.data.userMessage;
          this.$store.commit('updateData', response.data.userData)
          this.snackbar = true;
          this.snackbarColour = "green";
          this.$router.push("/userdetails");
        })
        .catch((error) => {
          this.loginData.output = error.response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "#E53935";
        }).finally(()=>{
          this.loading = false;
        })
    },
  },
};
</script>

<style scoped>
.login-details {
  margin-left: auto;
  margin-right: auto;
}
.login-details__heading {
  display: flex;
  justify-content: center;
}
.login-details__register {
  display: flex;
  justify-content: center;
}
.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
