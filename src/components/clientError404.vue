<template>
  <div>
    <el-result
        icon="warning"
        title="404"
        sub-title="页面不见了"
    >
      <template #extra>
        <el-button type="primary" @click="pushBack">返回</el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
export default {
  name: "clientError404",
  methods:{
    pushBack(){
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>