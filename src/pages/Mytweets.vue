<template>
  <q-page class="flex">
    <div class="body">
      <div v-if="Tweets.length > 0" class="Tweets">
        <div v-for="tweet in Tweets" :key="tweet.id" class="tweet-card">
          <TweetCard :tweet="tweet" @tweet-deleted="handleTweetDeleted" />
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
    handleTweetDeleted(tweetId) {
      this.Tweets = this.Tweets.filter(tweet => tweet.id !== tweetId);
    },
   
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
    async deleteTweet(tweet){
    try{
      const db = getFirestore(app)
      const tweetRef = doc(db,'tweets',tweet.id);
      await deleteDoc(tweetRef);
      const userRef = doc(db,'users',tweet.author);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const updatedTweets = userData.tweets.filter((t) => t.id !== tweet.id);
    await updateDoc(userRef, { tweets: updatedTweets });
        this.$q.notify({
          message:'Deleted successfully',
          color:'blue'
        })
    }
    catch(err){
      console.log(err.message)
    }
  }
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
