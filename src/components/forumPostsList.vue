<template>
  <div>
    <div class="list-box" v-loading="isListLoading">
        <div class="list-item-box" v-for="item in dataShowing" :key="item.id">
          <router-link :to="'/post/'+item.id">
            <div class="list-item">
              <div class="title">
                {{item.title}}
              </div>
              <div class="info">
                <div class="publisher LR-padding center-align">
                  <el-icon>
                    <Avatar />
                  </el-icon>
                  {{item.publisher__nickname}}
                </div>
                <div class="views LR-padding center-align">
                  <el-icon>
                    <View />
                  </el-icon>
                  {{item.views}}
                </div>
                <div class="partitions LR-padding center-align">
                  <el-icon>
                    <Calendar />
                  </el-icon>
                  {{item.partition__title}}
                </div>
              </div>
            </div>
          </router-link>
        </div>
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
  name: "forumPostsList",
  data(){
    return{
      pageNum:1,
      page_count:5,
      dataShowing:[],
      dataMap:{},
      isListLoading:false,
      dataLen:0
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
    }
  },
  watch:{
    pageNum(neo,old){
      if (neo===old){
        return
      }
      this.getForumPostsList()
    }
  },
  beforeMount() {
    this.dataMap=new Map();
    this.getForumPostsList()
  }
}
</script>

<style scoped>
a{
  text-decoration: none;
  color: black;
}
.list-box{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.list-item{
  margin: 5px 0;
  padding: 2px 3px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 4rem;
  border-bottom: #f6f6f6 1px solid;
}
.list-item:hover{
  cursor: pointer;
  background-color: #f6f6f6;
  border-radius: 6px;
}
.list-item>.title{
  font-size: 2rem;
  font-weight: 600;
}
.list-item>.info{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.LR-padding{
  padding: 0 5px;
}
.center-align{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>