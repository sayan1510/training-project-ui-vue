<template>
  <v-container class="registration-container">
    <v-card class="pa-5" elevation="4" :min-width="500">
      <v-col class="registration-details" cols="12">
        <router-link to="/"
          ><v-icon color="blue darken-2">mdi-arrow-left</v-icon></router-link
        >
        <v-card-title class="registration-details__heading pa-0"
          >Sign Up</v-card-title
        >
        <v-text-field
          id="fname"
          v-model="registrationData.firstName"
          label="First Name"
          :rules="[rules.required]"
          prepend-icon="mdi-account"
          clearable
          autofocus
        ></v-text-field>
        <v-text-field
          id="lname"
          v-model="registrationData.lastName"
          label="Last Name"
          :rules="[rules.required]"
          prepend-icon="mdi-account"
          clearable
        ></v-text-field>
        <v-text-field
          id="location"
          v-model="registrationData.location"
          label="Location"
          :rules="[rules.required]"
          prepend-icon="mdi-map-marker"
          clearable
        ></v-text-field>
        <v-radio-group
          id="gen"
          v-model="registrationData.gender"
          label="Gender: "
          :rules="[rules.required]"
          prepend-icon="mdi-gender-male-female"
          row
        >
          <v-radio label="Male" value="Male"></v-radio>
          <v-radio label="Female" value="Female"></v-radio>
          <v-radio label="Neutral" value="Neutral"></v-radio>
        </v-radio-group>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Date of Birth"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            scrollable
            :show-current="false"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-text-field
          id="email"
          v-model="registrationData.email"
          label="Email ID"
          :rules="[rules.required, rules.idValidator, rules.spaceAllowance]"
          prepend-icon="mdi-email"
          clearable
        ></v-text-field>
        <v-text-field
          id="pass"
          v-model="registrationData.password"
          :type="showpass ? 'text' : 'password'"
          label="Password"
          :append-icon="getAppendIcon"
          @click:append="showpass = !showpass"
          :rules="[rules.required, rules.min, rules.spaceAllowance]"
          prepend-icon="mdi-lock"
          @keyup.enter="ShowDetails"
          clearable
        ></v-text-field>
        <v-progress-linear
          class="password_progress"
          v-if="
            registrationData.password && registrationData.password.trim().length
          "
          :value="showPasswordProgress1.linearValue"
          :color="showPasswordProgress1.color"
        ></v-progress-linear>
        <v-card-text
          class="password_progress_text"
          v-if="
            registrationData.password && registrationData.password.trim().length
          "
        >
          <span :style="`color:${showPasswordProgress1.color}`">{{
            showPasswordProgress1.linearOutput
          }}</span></v-card-text
        >
        <div class="blank" v-else></div>
        <v-btn
          @click="ShowDetails"
          block
          color="primary"
          :loading="loading"
          :disabled="!buttonEnable1"
          type="submit"
          >Register</v-btn
        >
        <v-snackbar v-model="snackbar" :color="snackbarColour">
          {{ registrationData.output }}
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
const ps = new ProjectService();
export default {
  name: "RegistrationPage",
  data() {
    return {
      date: "",
      menu: false,
      showpass: false,
      snackbar: false,
      snackbarColour: "",
      loading: false,
      registrationData: {
        firstName: "",
        lastName: "",
        location: "",
        gender: "",
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
    getAppendIcon() {
      if (
        this.registrationData.password &&
        this.registrationData.password.length &&
        this.showpass
      ) {
        return "mdi-eye";
      } else if (
        this.registrationData.password &&
        this.registrationData.password.length &&
        !this.showpass
      ) {
        return "mdi-eye-off";
      } else return "";
    },
    buttonEnable() {
      if (
        !this.date ||
        this.date.length == 0 ||
        !this.registrationData.firstName ||
        this.registrationData.firstName.trim().length == 0 ||
        !this.registrationData.lastName ||
        this.registrationData.lastName.trim().length == 0 ||
        !this.registrationData.gender ||
        this.registrationData.gender.length == 0 ||
        !this.registrationData.email ||
        this.registrationData.email.trim().length == 0 ||
        !this.registrationData.email ||
        !this.registrationData.email.includes("@") ||
        !this.registrationData.password ||
        this.registrationData.password.trim().length <= 7 ||
        this.registrationData.password.includes(" ")
      ) {
        return true;
      } else {
        return false;
      }
    },
    buttonEnable1() {
      return (
        this.date &&
        this.date.length &&
        this.registrationData.firstName &&
        !this.registrationData.firstName.includes(" ") &&
        !/\d/.test(this.registrationData.firstName) &&
        this.registrationData.firstName.trim().length &&
        this.registrationData.lastName &&
        !/\d/.test(this.registrationData.lastName) &&
        this.registrationData.lastName.trim().length &&
        this.registrationData.location &&
        this.registrationData.location.trim().length &&
        this.registrationData.gender &&
        this.registrationData.gender.length &&
        this.registrationData.email &&
        !/[A-Z]/.test(this.registrationData.email) &&
        !this.registrationData.email.includes(" ") &&
        /[a-z0-9]+@+[a-z0-9]/.test(this.registrationData.email) &&
        this.registrationData.password &&
        !this.registrationData.password.includes(" ") &&
        this.registrationData.password.trim().length >= 8
      );
    },
    showPasswordProgress1() {
      let { password } = this.registrationData;
      switch (true) {
        case password.length >= 1 && password.length <= 2:
          return {
            linearValue: 25,
            linearOutput: "Very Weak",
            color: "#D50000",
          };
        case password.length >= 3 && password.length <= 5:
          return {
            linearValue: 50,
            linearOutput: "Moderately Weak",
            color: "orange",
          };

        case password.length >= 6 && password.length < 8:
          return { linearValue: 75, linearOutput: "Normal", color: "#FDD835" };
        default:
          return { linearValue: 100, linearOutput: "Strong", color: "green" };
      }
    },
  },
  methods: {
    ShowDetails() {
      this.loading = true;
      ps.registration({
        firstName: this.registrationData.firstName,
        lastName: this.registrationData.lastName,
        location: this.registrationData.location,
        dob: this.date,
        gender: this.registrationData.gender,
        email: this.registrationData.email,
        password: this.registrationData.password,
      })
        .then((response) => {
          this.registrationData.output = response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "green";
          this.loading = false;
          this.$router.push("/");
        })
        .catch((error) => {
          this.registrationData.output = error.response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "#E53935";
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.registration-details__heading {
  justify-content: center;
}
.registration-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.password_progress {
  display: inline-block;
  margin-left: 33px;
  width: 93%;
}
.password_progress_text {
  margin-left: 20px;
  padding-top: 0px;
}
.blank {
  height: 62px;
}
</style>
