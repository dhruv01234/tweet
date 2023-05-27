<template>
  <q-page v-if="!loadingDialog" class="flex">
    <div class="logout-details" v-if="!user">
      <p>Please sign in to join the conversation</p>
      <q-btn color="amber" label="Sign in" to="/page/login"></q-btn>
    </div>
    <div v-else class="body">
      <div v-if="Tweets" class="Tweets">
        <div v-for="tweet in Tweets" :key="tweet.id" class="tweet-card">
          <TweetCard :tweet=tweet />
        </div>
      </div>
      <div v-else>No Tweets yet</div>
      <div class="sendTweet">
        <q-input
          rounded
          filled
          v-model="tweet"
          label="Tweet here"
          class="tweetbox"
          style="width:80%"
          @keydown.enter="sendTweet"
        >
          <template v-slot:before>
            <q-avatar>
              <img src="../assets/avatar.jpg" />
            </q-avatar>
          </template>
        </q-input>
        <q-btn
          v-if="tweet"
          round
          dense
          flat
          icon="send"
          @click="sendTweet"
          class="send"
          :loading="loadingsend"
        />
      </div>
    </div>
  </q-page>
  <q-dialog v-else v-model="loadingDialog" persistent>
    <q-spinner-dots color="primary" size="80px" />
  </q-dialog>
</template>

<script>
import TweetCard from '../components/Tweet.vue'
import { defineComponent } from 'vue'
import {auth,app} from '../firebase'
import { getDatabase ,ref,onValue} from 'firebase/database';
import {getFirestore,runTransaction,doc,collection, query, orderBy, onSnapshot,getDoc} from 'firebase/firestore'
export default defineComponent({
  name: 'TweetPage',
  components:{
    TweetCard,
  },
  data(){
    return{
      user:null,
      username:"",
      tweet:"",
      loadingDialog: true,
      loadingsend:false,
      Tweets:[

      ],
    }
  },
  mounted(){
    auth.onAuthStateChanged(user=>{
      this.user = user;
      this.loadingDialog = false;
      if(user){
        this.fetchTweets();
      }
    })
  },
  methods:{
    fetchTweets() {
      const db = getFirestore(app);
      const tweetsRef = collection(db, "tweets");
      const q = query(tweetsRef, orderBy("timestamp", "desc"));
      onSnapshot(q, (snapshot) => {
        this.Tweets = snapshot.docs.map((doc) => doc.data());
      });
      const db1 = getDatabase(app);
      const userRef = ref(db1, 'users/' + this.user.uid + '/username');
       onValue(userRef, (snapshot) => {
        this.username = snapshot.val();
      });
    },
    sendTweet() {
      this.loadingsend = true;
  const db = getFirestore(app);

  const timestamp = Date.now();
  const tweetId = `${timestamp}-${this.user.uid}`;
  const tweetRef = doc(db, "tweets", tweetId);
  const userRef = doc(db, "users", this.user.uid);

  runTransaction(db, async (transaction) =>{
    const userSnapshot = await transaction.get(userRef);
    const currentDate = new Date();
    const time =currentDate.toLocaleTimeString().split(':')
    const zone = time[2].split(' ')[1]
    const hoursmin = time[0]+":"+time[1]+" "+zone
    const date =hoursmin+" " +currentDate.toLocaleDateString()

    const newTweet = {
      author:this.user.uid,
      username:this.username,
      content: this.tweet,
      date: date,
      timestamp:currentDate,
      id:tweetId,
      likes:0,
    };
    transaction.set(tweetRef, newTweet);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      userData.tweets.push(newTweet);
      transaction.update(userRef, { tweets: userData.tweets });
    } else {
      transaction.set(userRef, { tweets: [newTweet] });
    }
    this.loadingsend = false
    this.$q.notify({
      message:'Tweet sent successfully!',
      color:'blue'
    })
  })
    .then(() => {
      this.tweet = "";
    })
    .catch((error) => {
      this.loadingsend = false
      this.$q.notify({
      message:'oops! Unable to send Tweet',
      color:'negative'
    })
    });
},


  }
})
</script>
<style scoped>


  .tweet-card {
    margin: 10px;
    width: 100%;
  }
  .Tweets {
    width: 100%;
  }
  .logout-details {
    width: max-content;
    margin: auto;
  }
  .body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    padding: 5%;
  }
  .send:hover {
    color: #1976d2;
  }
  .sendTweet {
    display: flex;
    width: 80%;
  }
</style>
