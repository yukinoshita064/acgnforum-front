<template>
  <div>
    <div class="admin-title">
      分区管理
    </div>
    <div>
      <el-form>
        <el-form-item label="分区名">
          <el-input v-model="neoPartitionCreate"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click.prevent="postPartition"
          >
            创建
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="dataList"
    >
      <el-table-column prop="id" label="ID" width="200"/>
      <el-table-column prop="title" label="标题" width="200"/>
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除吗"
              @confirm="deletePartition(scope.row.id)"
          >
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getForumApiLink} from "@/common/url";
import axios from "axios";
import {ElMessage} from "element-plus";
import Cookies from "js-cookie";

export default {
  name: "forumAdminPartitions",
  data(){
    return{
      dataList:[],
      neoPartitionCreate:"",
      userData:{}
    }
  },
  methods:{
    getPartitionsAll(){
      const url_api=getForumApiLink()+'api/partition/?type=all'
      axios.get(url_api)
          .then((res)=>{
            if (res.data.status<3000){
              this.dataList=res.data.data
            }
            else {
              ElMessage({
                message:"获取失败",
                type:'success'
              })
            }
          })
    },
    deletePartition(pid){
      const url_api=getForumApiLink()+'api/partition/?user_token='+Cookies.get('user_token')+"&pid="+pid
      axios.delete(url_api)
          .then((res)=>{
            if (res.data.status<3000){
              ElMessage({
                message:"删除成功",
                type:'success'
              })
              this.getPartitionsAll()
            }
            else {
              ElMessage({
                message:"删除失败",
                type:'warning'
              })
            }
          })
    },
    postPartition(){
      if (this.neoPartitionCreate.length<2){
        ElMessage({
          message:"太短了",
          type:'warning'
        })
        return
      }
      const url_api=getForumApiLink()+'api/partition/'
      axios.post(url_api,{
        "user_token": Cookies.get('user_token'),
        "title": this.neoPartitionCreate
      })
          .then((res)=>{
            if (res.data.status<3000){
              ElMessage({
                message:"创建成功",
                type:'success'
              })
              this.getPartitionsAll()
            }
            else {
              ElMessage({
                message:"创建失败",
                type:'warning'
              })
            }
          })
    },
    getAdminInfo(){
      const url_api=getForumApiLink()+"user/info/"
      axios.post(url_api,{
        "username": Cookies.get('user_name'),
      })
          .then((res)=>{
            if (res.data.status){
              this.userData=res.data.data
              if (this.userData.group==='User'){
                ElMessage({
                  message:"权限不足",
                  type:"warning"
                })
                this.$router.go(-1)
              }
            }
            else {
              ElMessage({
                message:"获取失败",
                type:"warning"
              })
              this.$router.go(-1)
            }
          })
    },
  },
  beforeMount() {
    document.title="分区管理-acgnForum"
    if (Cookies.get('user_token')===undefined){
      ElMessage({
        message:"权限不足",
        type:"warning"
      })
      this.$router.go(-1)
    }
    this.getAdminInfo()
    this.getPartitionsAll()
  }
}
</script>

<style scoped>
.admin-title{
  font-size: 2.5rem;
  text-align: center;
  font-weight: 600;
  margin: 0 auto;
}
</style>