vba
<template>
  <q-page class="flex flex-center">
    <div class="body">
      <p>You Followers</p>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import {auth} from '../firebase'
export default defineComponent({
  name: 'MyFollowers',
  data(){
    return{
      user:null
    }
  },
  mounted(){
    auth.onAuthStateChanged(user=>{
      this.user = user;
    })
  },
  beforeRouteEnter(to, from, next) {
    auth.onAuthStateChanged(user => {
      if (!user) {
        next('/page/login');
      }
      else{
        next()
      }
    });
  },
})
</script>
<style scoped>

</style>
