
import {createRouter, createWebHistory} from 'vue-router'
import forumIndex from "@/pages/forumIndex";
import forumPostPage from "@/pages/forumPostPage";
import userCenterCallBack from "@/components/userCenterCallBack";
import forumPostPublish from "@/pages/forumPostPublish";
import forumAdminPartitions from "@/components/forumAdminPartitions";



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
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router