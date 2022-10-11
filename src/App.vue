<template>
  <div class="header">
    <div class="logo">
      <img src="./assets/logo.png" alt="logo" @click="pushToHome">
    </div>
    <div class="links">
    <div class="publish">
      <router-link to="/post/publish">
        <el-button link type="primary">
          发帖
        </el-button>
      </router-link>
    </div>
      <div class="admin" v-if="isAdmin">
      <router-link to="/admin">
        <el-button link type="primary">
          管理
        </el-button>
      </router-link>
    </div>
    </div>
    <div class="search-header">
      <el-input v-model="searchInput" class="search-input" @keyup.enter="pushSearch">
        <template #suffix>
          <div class="search-icon-box" @click="pushSearch">
            <img src="./assets/icon/search.png" alt="搜索" class="search-icon">
          </div>
        </template>
      </el-input>
    </div>
    <div class="user">
      <div class="user-login" @click="pushToCenter" v-if="!isLogin">
        登录
      </div>
      <img :src="userData.icon" :alt="userData.nickname"  @click="pushToSelfPage" class="login user-icon" v-else>
    </div>
  </div>
  <div class="page">
    <router-view :key="$route.path"></router-view>
  </div>
  <div>
    <el-button @click="logOut" type="none" v-if="isLogin">注销</el-button>
  </div>
</template>

<script>

import {getForumApiLink, getUserCenterApiLink, getUserCenterFrontLink} from "@/common/url";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: 'App',
  data(){
    return{
      cnt:0,
      pageUse:true,
      analysis:{},
      searchInput:'',
      isLogin:false,
      isAdmin:false,
      username:'',
      userData:{
        "username": "",
        "nickname": "",
        "icon": ""
      }
    }
  },
  methods:{
    pushSearch(){
      this.$router.push({
        path:'/game/search/'+this.searchInput
      })
    },
    getUserIcon(){
      const url_api=getUserCenterApiLink()+'user/info/'
      axios.post(url_api,{
        "keyword": this.username,
        "type": "all"
      })
          .then((res)=>{
            if (res.data.status<3000){
              this.userData=res.data.data
            }
          })
    },
    pushToSelfPage(){
      window.open(getUserCenterFrontLink()+'space/'+this.username,'_blank')
    },
    pushToHome(){
      this.$router.push({
        path:'/'
      })
    },
    startCnt(){
      if (this.pageUse){
        setTimeout(()=>{
          this.cnt+=0.01
          this.startCnt()
        },10)
      }
    },
    pushToCenter(){
      const host=location.protocol+'//' + location.host+'/login/callback'
      window.location.href=getUserCenterFrontLink()+'login?fromPath='+this.$route.path+'&callBack='+host
    },
    logOut(){
      Cookies.remove('user_token')
      Cookies.remove('user_name')
      localStorage.removeItem('user_group')
      location.reload()
    },
    getUserGroup(){
      const url_api=getForumApiLink()+"user/info/?username="+this.username
      axios.get(url_api)
          .then((res)=>{
            if (res.data.status<3000){
              localStorage.setItem('user_group',res.data.data.group)
              if (res.data.data.group==='Admin'){
                this.isAdmin=true
              }
            }
          })
    }
  },
  beforeMount() {
    this.username=Cookies.get('user_name')
    this.isLogin = !( this.username=== null || this.username === undefined);
    if (this.isLogin){
      this.getUserIcon()
      this.getUserGroup()
    }
    //统计权限申请
    let analysisRight=localStorage.getItem('isAnalysisOpen')
    if (analysisRight===null){
      console.log('分析开关')
    }
    //统计监听部分
    window.onblur=()=>{
      this.pageUse=false
    }
    window.onfocus=()=>{
      this.pageUse=true
      this.startCnt()
    }
  },
  watch:{
    '$route.query.justLogin': {
      handler(newVal,oldVal){
        if (newVal===oldVal){
          return
        }
        if (newVal==='true'){
          let username=Cookies.get('user_name')
          this.isLogin = !( username=== null || username === undefined);
          if (this.isLogin){
            this.username=username
            this.isLogin=true
            this.getUserIcon()
          }
          this.$router.push({ query: {} });
        }
      },
      deep: true
    },
  },
}
</script>

<style>
div{
  font-family: "Microsoft YaHei",sans-serif;
}
@media  screen and (min-width: 765px){
  .header>.logo>img{
    height: 58px;
    width: 356px;
  }
  .page{
    width: 80%;
    margin: 0 auto;
  }
}
@media  screen and (max-width: 765px){
  .header>.logo>img{
    height: auto;
    width: 150px;
  }
  .page{
    width: 95%;
    margin: 0 auto;
  }
}
.header>.logo>img:hover{
  cursor: pointer;
}
.header{
  width: 100%;
  border-bottom: #f6f6f6 1px solid;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.search-header>.search-input{
  height: 35px;
}
.search-icon{
  height: 1rem;
  width: 1rem;
}
.search-icon-box:hover{
  cursor: pointer;
  background-color: #f6f6f6;
}
.user>img{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.user{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: antiquewhite 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user>.user-login{
  width: 60px;
  height: 60px;
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.user:hover{
  cursor: pointer;
}
.publisher>a>button{
  font-size: 30px;
}
a{
  text-decoration: none;
}
.links{
  display: flex;
  flex-direction: row;
}
</style>
