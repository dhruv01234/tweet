<template>
  <q-page class="flex flex-center">
    <div class="body">
      <div v-if="Tweets.length > 0" class="Tweets">
        <div v-for="tweet in Tweets" :key="tweet.id" class="tweet-card">
          <TweetCard :tweet="tweet" />
        </div>
      </div>
      <div v-else>No Tweets yet</div>
    </div>
  </q-page>
</template>

<script>
import TweetCard from '../components/Tweet.vue'
import { defineComponent } from 'vue'
import { auth, app } from '../firebase'
import {
  getFirestore,
  doc,
  runTransaction
} from 'firebase/firestore'

export default defineComponent({
  name: 'MyTweets',
  components: {
    TweetCard,
  },
  data() {
    return {
      user: null,
      Tweets: [],
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      this.user = user;
      if (user) {
        this.fetchTweets();
      }
    })
  },
  methods: {
    fetchTweets() {
      const db = getFirestore(app);
      const userRef = doc(db, 'users', this.user.uid);
      try{
      runTransaction(db,async(transaction)=>{
        const userSnapshot = await transaction.get(userRef);
        this.Tweets=userSnapshot.data().tweets
      })
    }
    catch(err){

    }
    },
  },
  beforeRouteEnter(to, from, next) {
    auth.onAuthStateChanged(user => {
      if (!user) {
        next('/page/login');
      } else {
        next();
      }
    });
  },
})
</script>

<style scoped>
.body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    padding: 5%;
  }
  .Tweets {
    width: 100%;
  }
  .tweet-card {
    margin: 10px;
    width: 100%;
  }
</style>
