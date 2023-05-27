vba
<template>
  <q-page class="flex flex-center">
    <div class="body">
      <q-card class="my-card">
        <img class="profileImage" src="../assets/avatar.jpg">
        <q-card-section>
          <div class="text-h6">{{username}}</div>
          <div class="text-subtitle2">{{email}}</div>
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script>
import { getDatabase,ref,onValue } from 'firebase/database';
import { defineComponent, ref as r } from "vue";
import {auth,app} from '../firebase'
export default defineComponent({
  name: 'ProfilePage',
  data() {
    return {
      user: null,
      username:"",
      email:""
    };
  },
  mounted() {
    auth.onAuthStateChanged(async (user) => {
      this.user = user;
      if (user){
         this.fetchUsername(user.uid);
      }
    });
  },
  methods:{
    fetchUsername(userId) {
      const db = getDatabase(app);
      const userRef = ref(db, 'users/' + userId);
      onValue(userRef, (snapshot) => {
        this.username = snapshot.val().username;
        this.email = snapshot.val().email;
      });
    },
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
.profileImage{
  width: 40%;
}
</style>
