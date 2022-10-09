<template>
  <div class="admin-title">
    举报管理
  </div>
  <div>
    <el-table
      :data="dataShow"
    >
      <el-table-column prop="id" label="ID" width="200"/>
      <el-table-column prop="publisher__username" label="发布者"  width="200"/>
      <el-table-column prop="context" label="内容"/>
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要驳回吗"
              @confirm="postReportDecide(scope.row.id,'no')"
          >
            <template #reference>
              <el-button link type="primary" size="small">驳回</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除吗"
              @confirm="postReportDecide(scope.row.id,'yes')"
          >
            <template #reference>
              <el-button link type="primary" size="small">删除评论</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getForumApiLink} from "@/common/url";
import Cookies from "js-cookie";
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "forumAdminReport",
  data(){
    return{
      dataShow:[],
      isLoading:false,
      pager:{}
    }
  },
  methods:{
    getReportList(){
      const url_api=getForumApiLink()+'api/report/?user_token='+Cookies.get('user_token')
      axios.get(url_api)
          .then((res)=>{
            if (res.data.status<3000){
              this.dataShow=res.data.data
            }
            else {
              ElMessage({
                message:"获取失败",
                type:'warning'
              })
            }
          })
    },
    postReportDecide(id,decide){
      const url_api=getForumApiLink()+'api/report/?user_token='+Cookies.get('user_token')
      axios.put(url_api,{
        "replyId": id,
        "decide": decide
      })
          .then((res)=>{
            if (res.data.status<3000){
              ElMessage({
                message:"操作成功",
                type:'success'
              })
              this.getReportList()
            }
            else {
              ElMessage({
                message:"操作失败",
                type:'warning'
              })
            }
          })
    }
  },
  beforeMount() {
    this.getReportList()
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