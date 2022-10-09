
import {createRouter, createWebHistory} from 'vue-router'
import forumIndex from "@/pages/forumIndex";
import forumPostPage from "@/pages/forumPostPage";
import userCenterCallBack from "@/components/userCenterCallBack";
import forumPostPublish from "@/pages/forumPostPublish";
import forumAdminPartitions from "@/components/forumAdminPartitions";
import forumAdminReport from "@/components/forumAdminReport";
import forumAdminIndexPage from "@/pages/forumAdminIndexPage";
import forumAdminPosts from "@/components/forumAdminPosts";
import {ElMessage} from "element-plus";
import clientError404 from "@/components/clientError404";



const routes=[
    {
        path:"",
        component:forumIndex
    },
    {
        path: "/post/:pid",
        component: forumPostPage
    },
    {
        path: '/login/callback',
        component: userCenterCallBack
    },
    {
        path: '/post/publish',
        component: forumPostPublish
    },
    {
        path: '/admin/partitions',
        component: forumAdminPartitions
    },
    {
        path: '/admin/report',
        component: forumAdminReport
    },
    {
        path: '/admin/posts',
        component: forumAdminPosts
    },
    {
        path: "/admin",
        component: forumAdminIndexPage
    },
    {
        path: '/:pathMatch(.*)*',
        component: clientError404
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes
})

const adminPageList=[{
    path: '/admin/partitions',
    component: forumAdminPartitions
},
    {
        path: '/admin/report',
        component: forumAdminReport
    },
    {
        path: '/admin/posts',
        component: forumAdminPosts
    },
    {
        path: "/admin",
        component: forumAdminIndexPage
    },
    ]

router.beforeEach((to,from)=>{
    let isAdmin=false
    if (localStorage.getItem('user_group')==='Admin'){
        isAdmin=true
    }
    for (let i=0;i<adminPageList.length;i++){
        if (to.path===adminPageList[i].path){
            if (isAdmin){
                return true
            }
            else {
                ElMessage({
                    message:"无权限",
                    type:"warning"
                })
                return from
            }
        }
    }
    return true
})

export default router