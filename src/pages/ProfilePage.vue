<template>
  <q-page class="flex flex-center body">
    <div class="body">
      <q-card class="my-card flex flex-center">
        <img class="profileImage" src="../assets/avatar.jpg">
        <q-card-section>
          <div class="text-h6">{{ username }}</div>
          <div class="text-subtitle2">{{ email }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { defineComponent } from 'vue';
import { auth, app } from '../firebase';

export default defineComponent({
  name: 'ProfilePage',
  data() {
    return {
      user: null,
      username: '',
      email: '',
      imageUrl: '../assets/avatar.jpg',
    };
  },
  mounted() {
    auth.onAuthStateChanged(async (user) => {
      this.user = user;
      if (user) {
        this.fetchUserData(user.uid);
      }
    });
  },
  methods: {
    fetchUserData(userId) {
      const db = getDatabase(app);
      const userRef = ref(db, 'users/' + userId);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        this.username = userData.username;
        this.email = userData.email;
        this.imageUrl = userData.image;
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        next('/page/login');
      } else {
        next();
      }
    });
  },
});
</script>

<style scoped>
.body{
  width: 90%;
  flex-wrap: wrap;
}
.profileImage {
  width: 40%;
}
</style>
