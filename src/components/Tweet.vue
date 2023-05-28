<template>
  <div class="">
    <q-card class="my-card" bordered>
      <div class="tweet-author">
        <div class="tweet-avatar">
          <q-avatar>
            <img src="../assets/avatar.jpg" />
          </q-avatar>
        </div>
        <div class="q-pa-xs"><p>{{ tweet.username }}</p></div>
      </div>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs content">

          <div class="text-h7 tweet-content">{{tweet.content}}</div>

        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="tweetcard">
        <div class="tweet-likes">
          <div v-if="this.$route.path!==`/mytweets`" class="like-button">
            <q-btn
              round
              dense
              flat
              :icon="getLikeIcon(tweet.id)"
              @click="likeTweet(tweet)"
              :class="{'disabled':isActionInProgress}"
            />
           <div class="likes-count">
            <p>{{ tweet.likes }} Likes</p>
           </div>
          </div>
          <div v-if="user">
            <q-btn
          v-if="user===tweet.author"
          round
          dense
          flat
          icon="delete"
          class="delete-button"
          @click="deleteTweet(tweet)"
        />
          </div>
        </div>
        <div class="text-caption text-grey">
          {{tweet.date}}
        </div>

      </q-card-actions>
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
  async mounted(){
    if(auth.currentUser){
    this.user = auth.currentUser.uid;
    await this.fetchUserLikedTweets();
    }
  },
 methods:{
  async likeTweet(tweet) {
    if(!this.user){
      this.$q.dialog({
        message:'Please Sign in to continue'
      })
      return;
    }
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

};
</script>

<style scoped>
.tweet-content {
  white-space: pre-wrap;
}
.disabled {
  cursor: pointer !important;
}
.tweetcard {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: -8px;
  margin-bottom: -8px;
}
.tweet-likes {
  display: flex;
  height: fit-content;
}

.content {
  flex: 1;
  width: 80%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #F3F5F7;
  margin-left: 5px;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.tweet-author {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  width: max-content;
  display: flex;
  align-items: center;
  justify-content: center;
}
.likes-count{
margin-left: 5px;
}
.likes-count p{
margin: 0;
}
.like-button{
  display: flex;
  align-items: center;
}
</style>
