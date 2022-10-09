<template>
  <div>
    <div class="post" v-loading="isPageLoadng">
      <div v-show="!isPageLoadng">
        <el-fade-in>
          <div class="post-header">
            <div class="post-title">
              {{postData.title}}
            </div>
            <div class="post-info center-align">
              <el-icon class="LR-padding">
                <View/>
              </el-icon>
              <span class="LR-padding">
            {{postData.views}}
          </span>
            </div>
          </div>
          <div class="post-body">
            <a :href="getUserPageLink(postData.publisher__username)" target="_blank">
              <div class="publisher">
                <img :src="postData.publisher__icon_address" :alt="postData.publisher__username">
              </div>
            </a>
            <div class="post-box">
              <div class="publisher-nickname">
                <a :href="getUserPageLink(postData.publisher__username)" target="_blank">
                  {{postData.publisher__nickname}}
                </a>
              </div>
              <div class="post-context" v-html="postData.context">

              </div>
            </div>
          </div>
        </el-fade-in>
      </div>
    </div>
    <div class="reply-box" v-loading="isReplyLoading">
      <el-collapse-transition>
        <div v-for="item in reply_list_root" :key="item.id">
          <div class="reply-item">
            <a :href="getUserPageLink(item.publisher__username)" target="_blank">
              <div class="publisher">
                <img :src="item.publisher__icon_address" :alt="item.publisher__username">
              </div>
            </a>
            <div class="reply-body">
              <div class="publisher-nickname">
                <a :href="getUserPageLink(item.publisher__username)" target="_blank">
                  {{item.publisher__nickname}}
                </a>
                <span>
                |{{(getTimeThisYear(item.time))}}
              </span>
              </div>
              <div class="reply-context">
                {{item.context}}
              </div>
            </div>
            <div class="item-actions">
              <div class="item-actions-btnGroup">
                <el-button link type="primary" @click.prevent="replyToSomeBody(item)">
                  回复
                </el-button>
                <el-button link type="primary" @click="postReplyReport(item.id)">
                  举报
                </el-button>
              </div>
            </div>
          </div>
          <div class="reply-sonBox">
            <div class="reply-son-item reply-item" v-for="item_son in getSonComments(item.id)" :key="item_son.id">
              <a :href="getUserPageLink(item_son.publisher__username)" target="_blank">
                <div class="publisher">
                  <img :src="item_son.publisher__icon_address" :alt="item.publisher__username">
                </div>
              </a>
              <div class="reply-body">
                <div class="publisher-nickname">
                  <a :href="getUserPageLink(item_son.publisher__username)" target="_blank">
                    {{item_son.publisher__nickname}}
                  </a>
                  <span>
                    |回复给{{(getReplyToInfo(item_son.id)).publisher__nickname}}
                    {{(getTimeThisYear(item_son.time))}}
                  </span>
                </div>
                <div class="reply-context">
                  {{item_son.context}}
                </div>
              </div>
              <div class="item-actions">
                <div class="item-actions-btnGroup">
                  <el-button link type="primary" @click.prevent="replyToSomeBody(item_son)">
                    回复
                  </el-button>
                  <el-button link type="primary" @click.prevent="postReplyReport(item_son.id)">
                    举报
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="reply-create">
      <div class="title">
        说点什么吧
      </div>
      <div class="box">
        <el-input type="textarea" v-model="reply_text" :placeholder="reply_show">

        </el-input>
      </div>
      <div class="action">
        <el-button type="warning" @click="clearReplyInfo">
          取消
        </el-button>
        <el-button type="primary" @click.prevent="postReplyData">
          发布
        </el-button>
      </div>
    </div>

  </div>
</template>

<script>
import {getForumApiLink,getUserCenterFrontLink} from "@/common/url";
import axios from "axios";
import {ElMessage} from "element-plus";
import Cookies from "js-cookie";
import dayjs from 'dayjs';

export default {
  name: "forumPostPage",
  data(){
    return{
      pid:this.$route.params.pid,
      postData:{},
      reply_list:[],
      reply_list_root:[],
      reply_list_noRoot:[],
      reply_to:-1,
      reply_text:"",
      reply_show:"说点什么吧",
      isPageLoadng:false,
      isReplyLoading:false,
      isLogin:false
    }
  },
  methods:{
    getPostPageData(){
      this.isPageLoadng=true
      const url_api=getForumApiLink()+"api/post/?type=id&pid="+this.pid
      axios.get(url_api)
          .then((res)=>{
            if (res.data.status<3000){
              this.postData=res.data.data
              document.title=res.data.data.title+"-acgnForum帖子查看"
              this.postData.context=res.data.data.context.replace(
                  /<img/g,
                  "<img style='width:100%;height:auto;'"
              )
            }
            else {
              ElMessage({
                message:"加载失败",
                type:"warning"
              })
            }
            this.isPageLoadng=false
          })
    },
    getReplyList(){
      this.isReplyLoading=true
      const url_api=getForumApiLink()+"api/reply/?pid="+this.pid
      axios.get(url_api)
          .then((res)=>{
            if (res.data.status<3000){
              this.reply_list=res.data.data
              this.buildRoot()
            }
            else {
              ElMessage({
                message:"加载失败",
                type:"warning"
              })
            }
            this.isReplyLoading=false
          })
    },
    getUserPageLink(username){
      return getUserCenterFrontLink()+"space/"+username
    },
    postReplyData(){
      if (!this.isLogin){
        ElMessage({
          message:"请先登录",
          type:"warning"
        })
        return
      }
      const url_api=getForumApiLink()+'api/reply/'
      axios.post(url_api,{
        "user_token": Cookies.get('user_token'),
        "pid": this.pid,
        "context": this.reply_text,
        "reply_to": this.reply_to
      })
          .then((res)=>{
            if (res.data.status<3000){
              ElMessage({
                message:"发布成功",
                type:"success"
              })
              this.getReplyList()
              this.reply_to=-1
              this.reply_text=""
              this.reply_show="说点什么吧"
            }
            else {
              ElMessage({
                message:"发布失败",
                type:"warning"
              })
            }
          })
    },
    replyToSomeBody(item){
      this.reply_to=item.id
      this.reply_show='回复给'+item.publisher__nickname
      window.scroll(0,99999)
    },
    getTimeThisYear(dateTime){
      return dayjs(dateTime).format('MM-DD HH:mm:ss')
    },
    buildRoot(){
      this.reply_list_root=[]
      this.reply_list_noRoot=[]
      for (let i=0;i<this.reply_list.length;i++){
        let {id,context,time,publisher__username,publisher__icon_address,reply_to,publisher__nickname}=this.reply_list[i]
        if (reply_to===-1){
          this.reply_list_root.push({
            "id": id,
            "context": context,
            "time": time,
            "publisher__username": publisher__username,
            "publisher__nickname": publisher__nickname,
            "publisher__icon_address": publisher__icon_address,
            "reply_to": reply_to
          })
        }else {
          this.reply_list_noRoot.push({
            "id": id,
            "context": context,
            "time": time,
            "publisher__username": publisher__username,
            "publisher__nickname": publisher__nickname,
            "publisher__icon_address": publisher__icon_address,
            "reply_to": reply_to,
            "root_id":this.getSonCommentRoot(this.reply_list[i])
          })
        }
      }
    },
    getSonCommentRoot(item){
      if (item.reply_to===-1){
        return item.id
      }
      return this.getSonCommentRoot(this.reply_list.find((index)=>{
        return index.id===item.reply_to
      }))
    },
    clearReplyInfo(){
      this.reply_to=-1
      this.reply_text=""
      this.reply_show="说点什么吧"
    },
    getSonComments(rootID){
      let sonComment=[]
      for (let i=0;i<this.reply_list_noRoot.length;i++){
        if (this.reply_list_noRoot[i].root_id===rootID){
          sonComment.push(this.reply_list_noRoot[i])
        }
      }
      return sonComment
    },
    getReplyToInfo(sonCommentID){
      let replyTo=-1
      for (let i=0;i<this.reply_list_noRoot.length;i++){
        if (this.reply_list_noRoot[i].id===sonCommentID){
          replyTo=this.reply_list_noRoot[i].reply_to
          break
        }
      }
      return this.reply_list.find((index)=>{
        if (index.id===replyTo){
          return index
        }
      })
    },
    postReplyReport(id){
      if (!this.isLogin){
        ElMessage({
          message:"请先登录",
          type:"warning"
        })
        return
      }
      const url_api=getForumApiLink()+"api/report/?user_token="+Cookies.get('user_token')
      axios.post(url_api,{
        "replyId": id
      })
          .then((res)=>{
            if (res.data.status<3000){
              ElMessage({
                message:"举报成功",
                type:'success'
              })
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
  computed:{

  },
  beforeMount() {
    document.title="加载中-acgnForum"
    this.getPostPageData()
    this.getReplyList()
    if (Cookies.get('user_token')!==undefined){
      this.isLogin=true
    }
  }
}
</script>

<style scoped>
a{
  text-decoration: none;
  color: black;
}

a:hover{
  border-bottom: #f6f6f6 2px solid;
}
.post{
  min-height: 10rem;
  border-bottom: #f6f6f6 2px solid;
}
.post-header{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.post-header>.post-title{
  font-weight: 600;
  font-size: 2rem;
}

.post-header>.post-info{
  font-size: 0.8rem;
  font-weight: 600;
}
.post-body{
  width: 100%;
  font-size: 1.8rem;
  font-weight: 400;
  display: flex;
  flex-direction: row;
}
.post-body>a>.publisher>img{
  width: 55px;
  height: 55px;
  border-radius: 50%;
}
.post-body>.post-box{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.post-body>.post-box>.post-context{
  font-weight: 400;
  font-size: 1.3rem;
}
.post-body>.post-box>.publisher-nickname{
  font-weight: 600;
  font-size: 1rem;
}
.reply-item{
  min-height: 5rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: #f6f6f6 1px solid;
}
.reply-item:hover{
  background-color: #f6f6f6;
  border-radius: 6px;
}
.reply-item>a>.publisher>img{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.reply-item>.reply-body{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.reply-item>.reply-body>.publisher-nickname{
  font-weight: 600;
  font-size: 1rem;
}
.reply-item>.reply-body>.reply-context{
  font-weight: 400;
  font-size: 1.3rem;
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
.item-actions{
  flex: 1;
  text-align: right;
  align-self: flex-end;
  width: 20%;
}
.reply-create{

}
.reply-create>.title{
  font-size: 1.5rem;
  font-weight: 600;
}
.reply-sonBox{
  margin-left: 50px;
}
</style>