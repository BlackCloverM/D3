<template>
  <div>
    <el-row class="tac">
      <el-col :span="3">
        <h3>数据可视化</h3>
        <el-menu default-active="/" class="el-menu-vertical-demo">
          <template v-for="(item, index) in menus">
            <el-menu-item
              v-if="!item.children.length"
              :key="index"
              :index="item.path"
              @click="turnPath(item.path)"
            >
              <i :class="item.icon"></i>
              {{ item.name }}
            </el-menu-item>
            <el-submenu v-else :key="index" :index="item.path">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(it, idx) in item.children"
                  :key="idx"
                  :index="it.path"
                  @click="turnPath(it.path)"
                  >{{ it.name }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { routes } from "../router/index.js";
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      menus: "menusGetter"
    })
  },
  methods: {
    // 拼接路由
    getMenus(router = [], path) {
      var menus = [];
      router.map(value => {
        let p = path ? path + "/" + value.path : value.path;
        menus.push({
          name: value.title,
          path: p,
          icon: value.icon,
          children:
            value.children && value.children.length
              ? this.getMenus(value.children, p)
              : []
        });
      });
      return menus;
    },
    // 路由跳转
    turnPath(path) {
      this.$router.push({
        path
      });
    },
    ...mapMutations({
      setMenus: "SET_MENUS"
    })
  },
  created() {
    this.setMenus(this.getMenus(routes));
  },
  mounted() {}
};
</script>

<style lang="scss">
.el-submenu .el-menu-item {
  min-width: 100px !important;
}
</style>
