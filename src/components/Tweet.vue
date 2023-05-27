<template>
  <div class="">
    <q-card class="tweetcard q-pa-md">
      <div class="sender">
        <div>
          <div class="tweet-avatar">
            <q-avatar>
              <img src="../assets/avatar.jpg" />
            </q-avatar>
          </div>
          <div class="tweet-author">
            <p>{{ tweet.username }}</p>
          </div>
        </div>
      </div>
      <div class="vertical"></div>
      <div class="content">
        <div class="tweet-message">
          <p>{{ tweet.content }}</p>
        </div>
        <div class="tweet-footer flex">
          <div class="tweet-likes">
            <div>
              <q-btn v-if="this.$route.path!=='/mytweets'"
                round
                dense
                flat
                :icon="getLikeIcon(tweet.id)"
                class="like-button"
                @click="likeTweet(tweet)"
                :class="{'disabled':isActionInProgress}"
              />
            </div>
            <div>
              <p>{{ tweet.likes }}</p>
            </div>
          </div>
          <div class="tweet-time flex items-end">
            <p>{{tweet.date}}</p>
          </div>
        </div>
      </div>
      <q-btn
      v-if="user===tweet.author"
        round
        dense
        flat
        icon="delete"
        class="delete-button"
        @click="deleteTweet(tweet)"
      />
    </q-card>

  </div>
</template>

<script>
import {auth,app} from '../firebase'
import { getFirestore,getDocs, deleteDoc, updateDoc,doc,getDoc,writeBatch ,increment,collection} from 'firebase/firestore';
export default {
  name: "TweetCard",
  data(){
    return{
      user:null,
      isActionInProgress: false,
      userLikedTweets: [],
      likeIcon:''
    }
  },
  props: {
    tweet: Object,
  },
  async mounted() {
    auth.onAuthStateChanged((user) => {
      this.user = user.uid;
    });
    await this.fetchUserLikedTweets();
  },
 methods:{
  async likeTweet(tweet) {
    if (this.isActionInProgress) {
      return;
    }
    this.isActionInProgress = true;
  const currentUser = auth.currentUser;
  const db = getFirestore(app);
  const tweetRef = doc(db, 'tweets', tweet.id);
  const userRef = doc(db, 'users', currentUser.uid);
  const userLikedTweetsRef = doc(userRef, 'likedTweets', tweet.id);

  const batch = writeBatch(db);

  try {
    const userLikedTweetsDoc = await getDoc(userLikedTweetsRef);

    if (userLikedTweetsDoc.exists()) {
      batch.delete(userLikedTweetsRef);
      batch.update(tweetRef, { likes: increment(-1) });
      this.likeIcon = 'favorite_border'
      this.$q.notify({
      message:'Tweet disliked'
    })
    this.userLikedTweets = this.userLikedTweets.filter((id) => id !== tweet.id);
    } else {
      batch.set(userLikedTweetsRef, { timestamp: new Date() });
      batch.update(tweetRef, { likes:  increment(1) });
      this.likeIcon = 'favorite'
      this.$q.notify({
      message:'Tweet liked'
    })
    this.userLikedTweets.push(tweet.id);
    }
    await batch.commit();

    this.isActionInProgress = false;
  } catch (error) {
    this.$q.notify({
      message:'Error occued'
    })
    this.isActionInProgress = false;
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
    this.$emit('tweet-deleted', tweet.id);
        this.$q.notify({
          message:'Deleted successfully',
          color:'blue'
        })
    }
    catch(err){
      this.$q.notify({
          message:err.message,
          color:'negative'
        })
    }
  },
//   async LikedOrNot(){
//   const currentUser = auth.currentUser;
//   const db = getFirestore(app);
//   const userRef = doc(db, 'users', currentUser.uid);
//   const userLikedTweetsRef = doc(userRef, 'likedTweets', this.$props.tweet.id);
//   const userLikedTweetsDoc = await getDoc(userLikedTweetsRef);
//   // console.log(userLikedTweetsDoc.exists())
//   return userLikedTweetsDoc.exists()

// },
async fetchUserLikedTweets() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const db = getFirestore(app);
    const userLikedTweetsRef = collection(db, 'users', currentUser.uid, 'likedTweets');
    const userLikedTweetsSnapshot = await getDocs(userLikedTweetsRef);
    this.userLikedTweets = userLikedTweetsSnapshot.docs.map((doc) => doc.id);
  } else {
    this.userLikedTweets = [];
  }
},
getLikeIcon(tweetId) {
        return this.userLikedTweets.includes(tweetId)
          ? 'favorite'
          : 'favorite_border';
    },
 },
 computed: {
    // likeIcon() {
    //   console.log(this.LikedOrNot())
    //   return this.userLikedTweets.includes(tweetId)
    //       ? 'favorite'
    //       : 'favorite_border';
    // },
  },

};
</script>

<style scoped>
.disabled {
  cursor: pointer !important;
}

.vertical {
  display: inline-block;
  border-left: 1px solid yellow;
  height: 100%;
}
.tweetcard {
  display: flex;
  justify-content: space-between;
}
.tweet-likes {
  display: flex;
  align-items: baseline;
}
.sender {
  width: 12%;
  border-right: 2px solid #c7e0f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.content {
  flex: 1;
  width: 80%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #1976d2;
  margin-left: 5px;
}
.tweet-footer {
  background-color: #e7ecf691;
  display: flex;
  justify-content: space-between;
  height: max-content;
  padding: 5px;
}
.tweet-message {
  overflow-wrap: break-word;
  word-wrap: break-word;
  overflow: hidden;
}
.tweet-author {
  overflow-wrap: break-word;
  word-wrap: break-word;
  max-width: 100%;
  margin: auto;
}
</style>
