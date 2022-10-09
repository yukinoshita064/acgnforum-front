<template>
  <div>
    <div class="admin-title">
      帖子管理
    </div>
    <div>

    </div>
    <div>
      <el-table
      :data="dataShowing"
      >
        <el-table-column prop="id" label="ID" width="200"/>
        <el-table-column prop="publisher__nickname" label="发布者"/>
        <el-table-column prop="title" label="标题"/>
        <el-table-column prop="partition__title" label="分区" width="200"/>
        <el-table-column prop="views" label="访问量" width="200"/>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">

            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="确定要删除吗"
            >
              <template #reference>
                <el-button link type="primary" size="small">删除{{ scope.row.id }}(开发中)</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-pagination
        layout="prev, pager, next"
        :page-count="page_count"
        v-model:current-page="pageNum"
    >

    </el-pagination>

  </div>
</template>

<script>
import {getForumApiLink} from "@/common/url";
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "forumAdminPosts",
  data(){
    return{
      pageNum:1,
      page_count:5,
      dataShowing:[],
      dataMap:{},
      searchResMap:{},
      isListLoading:false,
      dataLen:0,
      keyword:'',
    }
  },
  methods:{
    getForumPostsList(){
      this.isListLoading=true
      if (this.dataMap.has(this.pageNum)){
        this.dataShowing=this.dataMap.get(this.pageNum)
        this.isListLoading=false
        return
      }
      const url_api=getForumApiLink()+"api/post/"
      axios.get(url_api,{
        params:{
          "type": "all",
          "page": this.pageNum
        }
      })
          .then((res)=>{
            if (res.data.status<3000){
              this.dataShowing=res.data.data.data
              this.page_count=res.data.data.pageAll
              this.dataMap.set(this.pageNum,res.data.data.data)
              this.dataLen=res.data.data.countAll
              this.isListLoading=false
            }
            else {
              ElMessage({
                message:"获取失败",
                type:"warning"
              })
              this.isListLoading=false
            }
          })
    },
    searchForumPosts(){
      this.isListLoading=true
      let storageName=this.pageNum+"/key="+this.keyword
      if (this.searchResMap.has(storageName)){
        this.dataShowing=this.searchResMap.get(storageName)
        this.isListLoading=false
        return
      }
      const url_api=getForumApiLink()+'api/post/?type=keywords&page='+this.pageNum+'&keyword='+this.keyword
      axios.get(url_api)
          .then((res)=>{
            if (res.data.status<3000){
              this.dataShowing=res.data.data
              this.searchResMap.set(storageName,res.data.data)
              this.isListLoading=false
            }
            else {
              ElMessage({
                message:"无数据",
                type:"warning"
              })
            }
          })
    }
  },
  watch:{
    pageNum(neo,old){
      if (neo===old){
        return
      }
      if (this.keyword!==""){
        this.searchForumPosts()
        return
      }
      this.getForumPostsList()
    }
  },
  beforeMount() {
    this.searchResMap=new Map();
    this.dataMap=new Map();
    this.getForumPostsList()
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