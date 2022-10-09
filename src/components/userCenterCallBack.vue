<template>
  <div style="font-size: 2rem;margin: 0 auto; text-align: center;">
    <div v-if="loading">
      正在登陆
    </div>
    <div v-else>
      {{swapToken}}
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import axios from "axios";
import {ElMessage} from "element-plus";
import {getForumApiLink} from "@/common/url";

export default {
  name: "userCenterCallBack",
  data(){
    return{
      swapToken:this.$route.query.swapToken,
      username:this.$route.query.username,
      fromPath:this.$route.query.fromPath,
      loading:false
    }
  },
  methods:{
    postSwapData(){
      this.loading=true
      const serverLogin=getForumApiLink()+'user/login/'
      Cookies.set('user_name',this.username,{ expires: 7 })
      axios.post(serverLogin,{
        'swapToken':this.swapToken
      })
          .then((result)=>{
            if (result.data.status<3000){
              Cookies.set('user_token',result.data.data.token,{ expires: 7 })
              ElMessage({
                message:'登录成功',
                type:'success'
              })
              setTimeout(()=>{
                this.$router.push({
                  path:this.fromPath,
                  query:{
                    justLogin:true
                  }
                },300)
              })
            }
            this.loading=false
          })
    }
  },
  beforeMount() {
    document.title="登陆中-acgnForum"
    this.postSwapData()
    console.log(this.swapToken)
    console.log(this.username)
    console.log(this.fromPath)
  }
}
</script>

<style scoped>

</style>