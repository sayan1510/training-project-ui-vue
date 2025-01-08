<template>
  <div>
    <v-card elevation="2" height="70px">
      <div class="d-flex">
        <v-card-text class="d-flex justify-center pa-5 navbar_heading"
          >{{ navBarHeading }}</v-card-text
        >
        <!-- <v-btn class="mr-4 mt-5" icon small @click.stop="drawer = !drawer">
          <v-icon>mdi-swap-vertical</v-icon>
        </v-btn> -->
        <slot name="AuditTrail"></slot>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-4 mt-5"
              v-bind="attrs"
              v-on="on"
              icon
              depressed
              retain-focus-on-click
              small
              ><v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-avatar color="indigo" size="35" v-on="on">
                    <span class="white--text text-h6"
                      >{{ userDetails.firstName.trim()["0"]
                      }}{{
                        userDetails.lastName.trim().split(" ").pop()["0"]
                      }}</span
                    >
                  </v-avatar>
                </template>
                <span>{{ userDetails.firstName.trim() }} {{ userDetails.lastName.trim() }}</span>
              </v-tooltip>
            </v-btn>
          </template>
          <v-list class="pa-0">
            <v-list-item-group>
              <v-list-item v-for="(item,index) in avatarMenuList" :key="index">
                <v-list-item-content class="pa-0" @click="item.action">
                  <div class="d-flex">
                    <v-list-item-icon>
                      <v-icon>{{ item.icon }}</v-icon> </v-list-item-icon
                    ><v-list-item-title>{{ item.text }}</v-list-item-title>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "NavBar",
  components: {},
  data() {
    return {
      drawer: false,
      group: "",
    };
  },
  props: {
    userDetails: {
      type: Object,
      default: () => {},
      required: true,
    },
    avatarMenuList: {
      type: Array,
      default: () => [],
      required: true,
    },
    navBarHeading: {
      type: String,
      default: "Welcome",
    }
  },
  methods: {},
};
</script>

<style scoped>
.navbar_heading {
  font-size: 30px;
}
</style>
