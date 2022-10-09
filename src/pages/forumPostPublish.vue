<template>
  <div>
    <div class="page_title">
      发布帖子
    </div>
    <el-form>
      <el-form-item label="标题">
        <el-input v-model="title"/>
      </el-form-item>
      <el-form-item label="分区选择">
        <el-select
            v-model="partitionSelected"
        >
          <el-option
              v-for="item in partitions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
  <div style="border: 1px solid #ccc">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
    />
    <button type="button" @click="submit_game">提交</button>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {onBeforeUnmount, onMounted, ref, shallowRef} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import axios from "axios";

import Cookies from "js-cookie";
import router from "@/router";
import {ElMessage} from "element-plus";
import {getForumApiLink} from "@/common/url";
import Router from "@/router";

export default {
  components: {Editor, Toolbar},
  setup() {

    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref('<p>hello</p>')
    const getPartitions = () => {
      const url_api=getForumApiLink()+"api/partition/?type=all"
      axios.get(url_api)
          .then((res)=>{
            if (res.data.status<3000){
              partitions.value=res.data.data
            }
            else {
              ElMessage({
                message:"分区信息获取失败",
                type:"warning"
              })
            }
          })
    }
    // 模拟 ajax 异步获取内容
    onMounted(() => {
      document.title="发帖-acgnForum"
      getPartitions()
      const token = Cookies.get('user_token')
      if (token === null || token === undefined) {
        ElMessage({
          message:'请先登录',
          type:'warning'
        })
        router.push('/login')
      }
      setTimeout(() => {
        valueHtml.value = ''
      }, 1500)
    })

    const toolbarConfig = {}
    const editorConfig = {
      placeholder: '请输入内容...',
      MENU_CONF: {}
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }
    const submit_game = () => {
      const editor = editorRef.value
      const url_api=getForumApiLink()+'api/post/'
      const data={
        "user_token": Cookies.get('user_token'),
        "title": title.value,
        "partition": "1",
        "context": editor.getHtml()
      }
      console.log(data)
      axios.post(url_api,data)
          .then((res)=>{
            if (res.data.status<3000){
              ElMessage({
                message:'发布成功',
                type:'success'
              })
              Router.push({
                path:'/post/'+res.data.data.pid
              })
            }
            else {
              ElMessage({
                message:'发布失败',
                type:'warning'
              })
            }
          })
          .catch((err)=>{
            console.log(err)
            ElMessage({
              message:'网络错误',
              type:'error'
            })
          })
    }

    editorConfig.MENU_CONF['uploadImage'] = {
      server: 'https://acgnpic.com/api/v1/upload/',
      timeout: 30 * 1000, // 30s
      maxFileSize: 5 * 1024 * 1024, // 10M
      base64LimitSize: 5 * 1024, // 5kb 以下插入 base64
      fieldName: 'file',
      onBeforeUpload(files) {
        return files; // 返回哪些文件可以上传
        // return false 会阻止上传
      },
      onProgress(progress) {
        console.log("onProgress", progress);
      },
      onSuccess(file, res) {
        console.log("onSuccess", file, res);
      },
      onFailed(file, res) {
        alert(res.message);
        console.log("onFailed", file, res);
      },
      onError(file, err, res) {
        alert(err.message);
        console.error("onError", file, err, res);
      },
      customInsert(res, insertFn) {
        if (res.status) {
          console.log(insertFn)
          const url = res.data.links.url
          const alt = res.data.origin_name
          const href = ''
          insertFn(url, alt, href)
        } else {
          console.log(res)
          ElMessage({
            message:'上传失败',
            type:'warning'
          })
        }
      },
    }

    let title = ref('')
    let introImg = ref('')
    let tags=ref('')
    let partitions=ref([])
    let partitionSelected=ref(1)

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      submit_game,
      title,
      introImg,
      tags,
      partitions,
      partitionSelected
    };
  }
}
</script>

<style scoped>
.page_title {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  font-size: 1.8rem;
  height: 3rem;
  font-weight: 600;
}
</style>