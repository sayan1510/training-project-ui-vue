<template>
  <v-menu
    offset-y
    class="pa-0"
    allow-overflow
    style="cursor: pointer"
  >
    <template v-slot:activator="{ on, attrs, value }">
      <v-btn
        small
        elevation="0"
        :color="checkColor.Background"
        dark
        v-bind="attrs"
        v-on="on"
        @click="menuIcon = !menuIcon"
        :dense="dense"
      >
        <span :style="checkColor.Text">{{ label }}</span
        ><v-icon color="black">
          {{ value ? "mdi-menu-up" : "mdi-menu-down" }}
        </v-icon>
      </v-btn>
    </template>
    <v-list :dense="dense" class="pa-0" style="cursor: pointer">
      <div v-if="!locked">
        <v-list-item
          class=""
          v-for="(item, index) in options.filter((val) => val.label != label)"
          :key="index"
        >
          <v-list-item-content class="pa-0" @click="updateValue(item)">
            <v-list-item-title class="text-center">{{
              item.label
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <div v-else>
        <v-list-item class="d-contents" disabled>
          <v-list-item-content class="pa-0">
            <v-list-item-title class="text-center">{{
              lockedMsg
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "roleStatusButton",
  data() {
    return {
      menuIcon: false,
    };
  },
  props: {
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    label: {
      type: String,
      default: "user",
      required: true,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    lockedMsg: {
      type: String,
      default: "You don't have permission",
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    checkColor() {
      if (this.label.toLowerCase() == "user")
        return { Background: "#fff4e3", Text: "color:#993404" };
      else return { Background: "#e6f6ed", Text: "color:#006837" };
    },
  },
  methods: {
    updateValue(item) {
      this.$emit("change", item.label);
      this.menuIcon = false;
    },
  },
};
</script>

<style></style>
