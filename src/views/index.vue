<template>
  <div class="wrapper">
    <Son></Son>
    <Son2> </Son2>
    <Son3 :abc="true" :flag="123"></Son3>
  </div>
</template>
<script>
import Son from "@/components/son.vue";
import Son2 from "@/components/son2.vue";
import Son3 from "@/components/son3.vue";
export default {
  data() {
    return {};
  },
  components: {
    Son,
    Son2,
    Son3
  },
  methods: {},
  mounted() {
    console.log(this.$children);
  }
};
</script>
