<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Tweet me </q-toolbar-title>

        <div>
          <q-btn v-if="user" @click="logout" color="amber" label="Logout"></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer class="bg-blue" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list class="q-pa-sm"  v-if="user">
        <div class="text-center">
          <q-avatar class="avatar q-ma-sm " color="primary" size="lg" style="width: 50px; margin: 0 auto;">
            <img src="../assets/avatar.jpg" />
          </q-avatar>
          <q-card class="profile q-pa-sm q-ma-sm">{{ username }}</q-card>
          <q-item-label header> <q-btn color="amber" label="Your Profile" to="/profile"></q-btn> </q-item-label>
        </div>
        <hr class="seperator">
        <q-card @click="home" class="drawer-items q-pa-sm q-ma-sm" :class="{ active: active === 'home' }">Dashboard</q-card>
        <q-card @click="followers" class="drawer-items q-pa-sm q-ma-sm" :class="{ active: active === 'followers' }">Your Followers</q-card>
        <q-card @click="mytweets" class="drawer-items q-pa-sm q-ma-sm" :class="{ active: active === 'myTweets' }">Your Tweeets</q-card>
      </q-list>
      <q-list v-else>
        <!-- Rest of the code -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import {auth,app} from '../firebase'
import { signOut } from 'firebase/auth';
import { getDatabase,ref,onValue } from 'firebase/database';
import { defineComponent, ref as r } from "vue";


export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      user: null,
      username:"",
      active:"home",
    };
  },
  mounted() {
    auth.onAuthStateChanged(async (user) => {
      this.user = user;
      if (user) {
         this.fetchUsername(user.uid);
      }
    });
    this.updateActiveTab(this.$route.path);
  },
  beforeRouteUpdate(to, from, next) {
    this.updateActiveTab(to.path);
    next();
  },
  methods:{
    updateActiveTab(path) {
      if (path === '/') {
        this.active = 'home';
      } else if (path === '/mytweets') {
        this.active = 'myTweets';
      } else {
        this.active = 'followers';
      }
    },
     fetchUsername(userId) {
      const db = getDatabase(app);
      const userRef = ref(db, 'users/' + userId + '/username');
       onValue(userRef, (snapshot) => {
        this.username = snapshot.val();
      });
    },
    home(){
      this.active = 'home'
      this.$router.push('/')
    },
    followers(){
      this.active = 'followers';
      this.$router.push('/followers')
    },
    mytweets(){
      this.active = 'myTweets';
      this.$router.push('/mytweets')
    },
    alert (err) {
      // const $q = useQuasar()
      this.$q.dialog({
        title: 'Failed to Logout up',
        message: err
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
},
    async logout(){
      this.$q.loading.show({
          message: 'logging out...'
        })
      try{
        await signOut(auth);
        this.$q.loading.hide()
        this.$router.push('/page/login')
      }
      catch(error){
        this.alert(error.message)
      }
    },
  },
  setup() {
    const leftDrawerOpen = r(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style scoped>
.drawer-items.active {
  background-color: #1976D2;
  color: aliceblue;
}
.avatar{
  width:100%;
  height: 100%;
}
.profile{

}

.drawer-items:hover{
  transition: 1s;
  cursor: pointer;
  background-color: #1976D2;
  color: aliceblue;
}
.seperator{
  width: 100%;
  height: 2px;
  color: aliceblue;
}
</style>
