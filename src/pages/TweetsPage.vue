<template>
  <q-page v-if="!loadingDialog" class="flex">
    <div  class="body">
      <div v-if="Tweets" class="Tweets">
        <div v-for="tweet in Tweets" :key="tweet.id" class="tweet-card">
          <TweetCard :tweet=tweet />
        </div>
      </div>
      <div v-else>No Tweets yet</div>
      <q-footer v-if="user" class="footer">
        <div class="sendTweet">
          <q-input
            rounded
            filled
            v-model="tweet"
            label="Tweet here"
            class="tweetbox"
            autogrow
            style="width:80%"
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
      </q-footer>
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
      // if(user){
        this.fetchTweets();
        if(user){
          this.getusername();
        }
      // }
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

    },
    getusername(){
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
    const date =currentDate.toLocaleDateString() + " "+hoursmin

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
.footer{
  padding: 7px;
  background-color: antiquewhite;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.tweetbox {
  line-height: 1;
  overflow-y: auto;
  max-height: 8em;
}
  .tweet-card {
    margin: 10px;
    width: 100%;
  }
  .Tweets {
    width: 100%;
  overflow-x: hidden;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
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
    max-width: 100%;
    overflow-x: hidden;
    margin-top: -16px;
  }
  .sendTweet .avatar-container {
    flex: 0 0 auto;
  }

  .sendTweet .input-container {
    flex: 1 1 auto;
  }

  .sendTweet .send-button-container {
    flex: 0 0 auto;
  }
  .send:hover {
    color: #1976d2;
  }
  .sendTweet {
    display: flex;
    width: 80%;
    flex-wrap: wrap;
    align-items: center;

  }
  .q-page-container{
    padding-bottom: 70px;
  }
  @media (max-width: 450px) {

    .sendTweet {
      width: 100%;
    }
  }
  .search-bar-container {
    margin-top: -15px;
  }

</style>
