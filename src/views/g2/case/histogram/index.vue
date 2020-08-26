<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in subMenus"
        :key="item.path"
        :label="item.name"
        :name="item.path"
        @click="turnPath(item.path)"
      ></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeName: "/g2/histogram/demo01"
    };
  },
  methods: {
    handleClick(tab) {
      this.turnPath(tab.name);
    },
    turnPath(path) {
      this.$router.push({
        path
      });
    }
  },
  computed: {
    subMenus() {
      return this.menus[4].children[0].children;
    },
    ...mapGetters({ menus: "menusGetter" })
  },
  watch: {
    menus: {
      handler() {
        console.log(this.menus);
      },
      immediate: true
    }
  },
  mounted() {}
};
</script>
