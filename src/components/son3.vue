<template>
  <div>
    <el-button @click="logName">son3</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "son3"
    };
  },
  props: ["flag"],
  methods: {
    logName() {
      console.log(this.$attrs);
    }
  }
};
</script>
