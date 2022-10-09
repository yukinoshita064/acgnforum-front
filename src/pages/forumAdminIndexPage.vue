<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in dataList" :key="item.title">
        <el-card shadow="hover">
          <router-link :to="item.path">{{item.title}}</router-link>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "forumAdminIndexPage",
  data(){
    return{
      dataList:[{
        title:"分区管理",
        path:"/admin/partitions"
      },{
        title:"举报管理",
        path:"/admin/report"
      },{
        title:"帖子管理",
        path:"/admin/posts"
      }]
    }
  },
  beforeMount() {
    document.title="管理入口-acgnForum"
  },

}
</script>

<style scoped>
a{
  text-decoration: none;
  color: black;
}
</style>