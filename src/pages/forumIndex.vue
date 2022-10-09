<template>
  <div>
    <forum-posts-list>

    </forum-posts-list>
  </div>
</template>

<script>
import ForumPostsList from "@/components/forumPostsList";
export default {
  name: "forumIndex",
  components: {ForumPostsList},
  beforeCreate() {
    document.title="渲染中-AcgnForum"
  },
  mounted() {
    document.title="首页-AcgnForum"
  }
}
</script>

<style scoped>

</style>