<template>
  <div>
    <NavBar
      :userDetails="userData"
      :avatarMenuList="menuListValue"
      navBarHeading="Welcome to User Details Page"
    >
      <template #AuditTrail>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mr-4 mt-5"
              icon
              small
              @click="getAuditTrailData"
              v-on="on"
            >
              <v-icon>mdi-swap-vertical</v-icon>
            </v-btn>
          </template>
          <span>Audit Trail</span>
        </v-tooltip>
      </template>
    </NavBar>
    <v-container fluid>
      <v-card>
        <v-card-title class="pa-1 pl-3 d-flex justify-space-between">
          <div>
            <v-icon>mdi-account</v-icon>
            Users
          </div>
          <div class="d-flex" style="width: 20%">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              autofocus
              clearable
              @keyup.13="filterData"
            ></v-text-field>

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <V-btn
                  class="ma-5"
                  v-on="on"
                  v-bind="attrs"
                  small
                  icon
                  @click="
                    printUserDetails({
                      limit: -1,
                      offset: 0,
                      filter: '',
                    })
                  "
                  ><v-tooltip bottom>
                    <template v-slot:activator="{ on }"
                      ><v-icon v-on="on">mdi-download</v-icon></template
                    >
                    <span>Download</span>
                  </v-tooltip></V-btn
                ></template
              ><v-list style="cursor: pointer" dense>
                <download-excel
                  :data="usersToPrint"
                  :type="downloadFileType"
                  :fields="name_fields"
                >
                  <v-list-item-group v-model="downloadFileType">
                    <v-list-item value="csv">
                      <v-img src="../assets/csv-normal.svg"></v-img
                      >&nbsp;<v-list-item-title>CSV File</v-list-item-title>
                    </v-list-item>

                    <v-list-item type="excel">
                      <v-img src="../assets/xls-normal.svg"></v-img
                      >&nbsp;<v-list-item-title>Excel File</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </download-excel>
              </v-list></v-menu
            >
          </div>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          :server-items-length="totalUsers"
          :options.sync="options"
          class="elevation-2"
        >
          <template #[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }"
                ><v-icon
                  small
                  class="mr-2"
                  :disabled="checkLoginIdForEdit(item)"
                  @click="openEditPage(item)"
                  v-on="on"
                >
                  mdi-account-edit
                </v-icon></template
              >
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-icon
                    small
                    :disabled="checkLoginIdForDelete(item)"
                    @click="openDeletePage(item)"
                  >
                    mdi-delete
                  </v-icon></span
                ></template
              >
              <span v-if="!checkLoginIdForDelete(item)">Delete</span>
              <span v-else>You aren't allowed to delete this user</span>
            </v-tooltip>
          </template>
          <template #[`item.role`]="{ item }">
            <div>
              <roleStatusButton
                :options="roleValues"
                @change="editUserRole(item.id, $event)"
                :label="item.role"
                dense
                :locked="checkLock(item)"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog width="40%" v-model="dialog" :disabled="dialog" persistent>
        <v-card class="pt-2 pb-2">
          <v-card-title>
            <span class="text-h5">Edit User Details</span>
            <v-spacer></v-spacer>
            <v-icon class="justify-end" @click="dialog = false"
              >mdi-close</v-icon
            >
          </v-card-title>
          <v-divider class="mt-2 mb-2"></v-divider>
          <div class="pa-7">
            <v-text-field
              id="fname"
              v-model="editedUser.firstName"
              label="First Name"
              :rules="[rules.required]"
              prepend-icon="mdi-account"
              clearable
              autofocus
            ></v-text-field>
            <v-text-field
              id="lname"
              v-model="editedUser.lastName"
              label="Last Name"
              prepend-icon="mdi-account"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
            <v-text-field
              id="location"
              v-model="editedUser.location"
              label="Location"
              prepend-icon="mdi-map-marker"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
            <v-radio-group
              id="gen"
              v-model="editedUser.gender"
              label="Gender: "
              prepend-icon="mdi-gender-male-female"
              :rules="[rules.required]"
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
              :return-value.sync="editedUser.dob"
              transition="scale-transition"
              :rules="[rules.required]"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="editedUser.dob"
                  label="Date of Birth"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="editedUser.dob"
                no-title
                scrollable
                :show-current="false"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(editedUser.dob)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </div>
          <v-divider class="mt-2 mb-2"></v-divider>
          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              right
              @click="dialog = false"
              icon
              color="black"
              tile
              width="80px"
              >Cancel</v-btn
            >
            <v-btn
              class="mr-3"
              color="primary"
              right
              tile
              :loading="buttonLoading"
              @click="editItem(editedUser)"
              :disabled="checkData"
              >Save</v-btn
            >
          </div>
        </v-card>
      </v-dialog>
      <v-dialog
        width="40%"
        v-model="deleteDialog"
        :disabled="deleteDialog"
        persistent
      >
        <v-card class="pt-2 pb-2">
          <v-card-title class="pt-2 pl-4 pr-4 pb-2">
            <span class="text-h5">Delete User</span>
            <v-spacer></v-spacer>
            <v-icon class="justify-end" @click="deleteDialog = false"
              >mdi-close</v-icon
            >
          </v-card-title>
          <v-divider class="mt-2 mb-2"></v-divider>
          <div>
            <v-card-text
              ><span class="text-h7"
                >Are you sure you want to delete the User
                {{ userToDelete.firstName }} {{ userToDelete.lastName }} ?</span
              ></v-card-text
            >
          </div>
          <v-divider class="mt-2 mb-2"></v-divider>
          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              right
              @click="deleteDialog = false"
              icon
              color="black"
              tile
              width="80px"
              >Cancel</v-btn
            >
            <v-btn
              class="mr-3"
              color="error"
              right
              :loading="buttonLoading"
              tile
              @click="deleteItem(userToDelete)"
              >Delete</v-btn
            >
          </div>
        </v-card>
      </v-dialog>
      <v-snackbar right v-model="snackbar" :color="snackbarColour">
        {{ output }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
    <v-navigation-drawer
      class="auditTrailDrawer"
      clipped
      v-model="drawer"
      absolute
      right
      width="490"
    >
      <v-list-item class="textToBold mt-3 mb-2">
        <span><v-icon>mdi-swap-vertical</v-icon>Audit Trail</span>
        <v-btn absolute right icon @click="drawer = !drawer"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-list-item>

      <v-divider class="mt-1"></v-divider>
      <div class="auditTrailDrawerList">
        <v-list-item
          class="pa-0 auditTrailDrawerBody d-block"
          v-for="(item, index) in auditTrailData.slice().reverse()"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title class="pa-1 d-flex justify-space-between">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="actionsDisplay" v-on="on">
                    <v-icon class="pl-3 pr-2" color="primary">{{
                      item.actionType == "delete"
                        ? "mdi-delete-outline"
                        : "mdi-square-edit-outline"
                    }}</v-icon>
                    {{ item.adminName }}(Admin) has
                    <span class="textToBold"
                      >{{
                        item.actionType == "edit"
                          ? "Edited"
                          : item.actionType == "update"
                          ? "Updated Role of"
                          : "Deleted"
                      }} </span
                    >{{ item.appliedActionTo }}
                  </div>
                </template>
                <span
                  >{{ item.adminName }}(Admin) has
                  <span class="textToBold"
                    >{{
                      item.actionType == "edit"
                        ? "Edited"
                        : item.actionType == "update"
                        ? "Updated Role of"
                        : "Deleted"
                    }} </span
                  >{{ item.appliedActionTo }}</span
                >
              </v-tooltip>
              <div class="textToBold">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{
                      item.timestamp.split(",").pop().slice(1, 6)
                    }}</span>
                  </template>
                  <span>{{ item.timestamp }}</span>
                </v-tooltip>
              </div>
            </v-list-item-title>
            <div
              class="detailsOfChange"
              v-if="
                (item.actionType == 'edit' && !Array.isArray(item.oldValue)) ||
                item.actionType == 'update'
              "
            >
              <v-row v-if="item.actionType == 'edit'"
                ><v-col><span class="textToBold">Column</span></v-col
                ><v-col
                  >:
                  {{
                    item.changedValue == "firstName"
                      ? "First Name"
                      : item.changedValue == "lastName"
                      ? "Last Name"
                      : item.changedValue == "location"
                      ? "Location"
                      : item.changedValue == "dob"
                      ? "Date of Birth"
                      : item.changedValue == "gender"
                      ? "Gender"
                      : ""
                  }}</v-col
                ></v-row
              >
              <v-row
                ><v-col><span class="textToBold">Old Value</span></v-col
                ><v-col>: {{ item.oldValue }}<br /></v-col
              ></v-row>
              <v-row
                ><v-col><span class="textToBold">Changed Value</span></v-col
                ><v-col>: {{ item.newValue }}</v-col></v-row
              >
            </div>
            <div
              class="detailsOfChange pa-1"
              v-if="item.actionType == 'edit' && Array.isArray(item.oldValue)"
            >
              <v-simple-table id="atTable">
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Old Value</th>
                    <th>Changed Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="values"
                    v-for="(val, index) in item.oldValue"
                    :key="index"
                  >
                    <td class="textToBold">
                      {{
                        item.changedValue[index] == "firstName"
                          ? "First Name"
                          : item.changedValue[index] == "lastName"
                          ? "Last Name"
                          : item.changedValue[index] == "location"
                          ? "Location"
                          : item.changedValue[index] == "dob"
                          ? "Date of Birth"
                          : item.changedValue[index] == "gender"
                          ? "Gender"
                          : ""
                      }}
                    </td>
                    <td>{{ val }}</td>
                    <td>{{ item.newValue[index] }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </div>
          </v-list-item-content>
          <v-divider></v-divider>
        </v-list-item>
        <v-divider class="mt-1"></v-divider>
      </div>
    </v-navigation-drawer>
    <!-- <div class="text-center">
      <role_status_btn
        :options="roleValues"
        @change="(n) => (buttonLabel = n)"
        :label="buttonLabel"
        :dense="denseValue"
      />
    </div> -->
  </div>
</template>

<script>
import roleStatusButton from "@/components/role-status-btn.vue";
import ProjectService from "@/dataproviders/project-service.js";
const projectServe = new ProjectService();
import NavBar from "@/components/NavBar.vue";
export default {
  name: "UserDetails",
  components: {
    NavBar,
    roleStatusButton,
  },
  data() {
    return {
      drawer: false,
      buttonLoading: false,
      loading: false,
      deleteDialog: false,
      menu: false,
      snackbar: false,
      snackbarColour: "",
      output: "",
      users: [],
      usersToPrint: [],
      name_fields: {
        "First Name": "firstName",
        "Last Name": "lastName",
        Location: "location",
        "Date of Birth": "dob",
        "Role of User": "role",
        Gender: "gender",
        "Email Address": "emailId",
      },
      auditTrailData: [],
      roleValues: [
        { label: "user", value: "user" },
        { label: "admin", value: "admin" },
      ],
      buttonLabel: "user",
      lock: true,
      denseValue: true,
      totalUsers: 0,
      disableButton: true,
      options: {},
      search: "",
      dialog: false,
      headers: [
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Location", value: "location" },
        { text: "Date of Birth", value: "dob" },
        { text: "Gender", value: "gender" },
        { text: "Email Address", value: "emailId" },
        { text: "Role", value: "role" },
        { text: "Actions", value: "actions" },
      ],
      mainUser: {
        id: "",
        firstName: "",
        lastName: "",
        location: "",
        dob: "",
        gender: "",
        role: "",
      },
      editedUser: {
        id: "",
        firstName: "",
        lastName: "",
        location: "",
        dob: "",
        gender: "",
        role: "",
        loggedUserID: "",
      },
      userToDelete: {
        firstName: "",
        lastName: "",
        id: "",
        loggedUserID: "",
      },
      rules: {
        required: (val) => !!val || "Value Required",
      },
      userData: null,
      menuListValue: [
        { icon: "mdi-account", text: "Profile", action: "" },
        { icon: "mdi-hail", text: "Administration", action: "" },
        {
          icon: "mdi-power",
          text: "Log Out",
          action: () => {
            projectServe.logOut().then((response) => {
              console.log(response.data.userMessage);
              this.$store.commit("updateData", {});
              this.$router.push("/");
            });
          },
        },
      ],
      downloadFileType: null,
    };
  },
  watch: {
    options: {
      handler(n) {
        this.getUserDetails({
          limit: n.itemsPerPage,
          offset: (n.page - 1) * n.itemsPerPage,
          sortBy: n.sortBy[0],
          sortDesc: n.sortDesc[0],
          filter: this.search,
        });
      },
      deep: true,
    },
  },
  computed: {
    showUser() {
      return this.$store.getters.showUser;
    },
    checkData() {
      if (
        this.editedUser.dob &&
        this.editedUser.dob.length &&
        this.editedUser.firstName &&
        !/\d/.test(this.editedUser.firstName) &&
        !this.editedUser.firstName.includes(" ") &&
        this.editedUser.firstName.length &&
        this.editedUser.lastName &&
        !/\d/.test(this.editedUser.lastName) &&
        !this.editedUser.lastName.split(" ")["0"] == "" &&
        !this.editedUser.lastName.split(" ").pop() == "" &&
        this.editedUser.lastName.trim().length &&
        this.editedUser.location &&
        !this.editedUser.location.split(" ")["0"] == "" &&
        !this.editedUser.location.split(" ").pop() == "" &&
        this.editedUser.location.trim().length &&
        this.editedUser.gender &&
        this.editedUser.gender.length
      ) {
        return (
          this.editedUser.firstName == this.mainUser.firstName &&
          this.editedUser.lastName == this.mainUser.lastName &&
          this.editedUser.location == this.mainUser.location &&
          this.editedUser.dob == this.mainUser.dob &&
          this.editedUser.gender == this.mainUser.gender
        );
      } else {
        return true;
      }
    },
  },
  beforeMount() {
    this.userData = JSON.parse(localStorage.getItem("user"));
    if (this.userData) {
      this.$store.commit("updateData", this.userData);
    }
  },
  methods: {
    printUserDetails(params) {
      projectServe
        .importData(params)
        .then((response) => {
          this.usersToPrint = response.data.users;
        })
        .catch(() => {
          this.usersToPrint = [];
        });
    },
    openEditPage(item) {
      this.editedUser.id = this.mainUser.id = item.id;
      this.editedUser.firstName = this.mainUser.firstName = item.firstName;
      this.editedUser.lastName = this.mainUser.lastName = item.lastName;
      this.editedUser.location = this.mainUser.location = item.location;
      this.editedUser.dob = this.mainUser.dob = item.dob;
      this.editedUser.gender = this.mainUser.gender = item.gender;
      this.editedUser.role = this.mainUser.role = item.role;
      this.editedUser.loggedUserID = JSON.parse(
        localStorage.getItem("user")
      ).id;
      this.dialog = true;
    },
    openDeletePage(item) {
      this.userToDelete.firstName = item.firstName;
      this.userToDelete.lastName = item.lastName;
      this.userToDelete.id = item.id;
      this.userToDelete.loggedUserID = JSON.parse(
        localStorage.getItem("user")
      ).id;
      this.deleteDialog = true;
    },
    logOut() {
      this.$store.commit("updateData", {});
      this.$router.push("/");
    },
    checkLoginIdForEdit(val) {
      if (this.showUser.role == "admin") return false;
      else return !(this.showUser.id == val.id);
    },
    checkLoginIdForDelete(val) {
      if (this.showUser.role == "admin") {
        if (
          this.users.filter((val) => val.role == "admin").length == 1 &&
          this.showUser.id == val.id
        ) {
          return true;
        }
        if (val.role == "admin" && this.showUser.id != val.id) {
          return true;
        } else return false;
      } else return !(this.showUser.id == val.id);
    },
    checkLock(item) {
      if (this.showUser.role == "admin") {
        if (this.showUser.role == item.role) return true;
        else return false;
      } else return true;
    },
    getAuditTrailData() {
      projectServe
        .importAuditTrailData()
        .then((response) => {
          this.auditTrailData = response.data.actionData;
          // console.log(response.data.actionData);
        })
        .finally(() => {
          this.drawer = !this.drawer;
        });
    },
    deleteItem(val) {
      projectServe
        .deleteData(val)
        .then((response) => {
          this.buttonLoading = true;
          this.output = response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "green";
          if (this.showUser.role == "user") this.logOut();
        })
        .catch((error) => {
          this.output = error.response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "#E53935";
        })
        .finally(() => {
          this.deleteDialog = false;
          this.buttonLoading = false;
          this.filterData();
        });
    },
    editItem(element) {
      projectServe
        .editData(element.id, element)
        .then((response) => {
          this.buttonLoading = true;
          this.output = response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "green";
          if (this.showUser.role == "user")
            this.$store.commit("updateData", response.data.userData);
          else
            this.$store.commit(
              "updateData",
              JSON.parse(localStorage.getItem("user"))
            );
        })
        .catch((error) => {
          this.output = error.response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "#E53935";
        })
        .finally(() => {
          this.dialog = false;
          this.buttonLoading = false;
          this.filterData();
        });
    },
    editUserRole(id, val) {
      projectServe
        .editRole(id, {
          role: val,
          loggedUserID: JSON.parse(localStorage.getItem("user")).id,
        })
        .then((response) => {
          this.output = response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "green";
        })
        .catch((error) => {
          this.output = error.response.data.userMessage;
          this.snackbar = true;
          this.snackbarColour = "#E53935";
        })
        .finally(() => {
          this.filterData();
        });
    },
    filterData() {
      let { itemsPerPage, sortBy, sortDesc, page } = this.options;
      if (!this.search) {
        this.search = "";
      }
      this.getUserDetails({
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        sortBy: sortBy[0],
        sortDesc: sortDesc[0],
        filter: this.search,
      });
    },
    getUserDetails(params) {
      this.loading = true;
      projectServe
        .importData(params)
        .then((response) => {
          this.users = response.data.users;
          this.totalUsers = response.data._meta.total;
        })
        .catch(() => {
          this.users = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.detailsOfChange {
  margin-left: 53px;
  border: 1px solid silver;
  border-radius: 10px;
  background-color: #e6f3ff;
  max-width: 330px;
  padding: 12px;
  /* line-height: 1.5em; */
}
.textToBold {
  font-weight: bold;
}
.textsearch {
  width: 1px;
}
.auditTrailDrawerBody {
  background-color: #f1f1f1;
}
.auditTrailDrawerList {
  max-height: max-content;
  max-height: 100vh;
  overflow-y: scroll;
}
.auditTrailDrawer {
  max-height: min-content;
  overflow-y: hidden;
}
#atTable {
  background-color: #e6f3ff;
}
.actionsDisplay {
  width: 380px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.values:hover {
  background-color: #e6f3ff !important;
}
::v-deep .v-navigation-drawer__content {
  overflow-y: hidden;
}
</style>
