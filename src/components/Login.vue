<template>
  <div>
    <q-form @submit.prevent="login" class="bg-white custom-form">
      <q-card class="regCard">Welcome! to Tweets World</q-card>
      <br>
      <q-input rounded standout="bg-teal text-white" v-model="email" label="Email" />
      <br>
      <q-input
        :type="passwordVisiblity"
        rounded
        standout="bg-teal text-white"
        v-model="password"
        label="Password"
      >
        <template v-slot:append>
          <q-icon
            name="visibility"
            class="cursor-pointer"
            @click="togglePasswordVisibility"
          />
        </template>
      </q-input>
      <br>
      <q-btn color="amber" label="Sign in" type="submit"></q-btn>
      <br>
      <br>
      <div>
        <q-card class="my-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h7">Need an account?</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn class="bg-grey" color="white" flat to="/page/register">Sign up here</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-form>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../firebase'
export default {
  name: 'LoginComp',
  data() {
    return {
      email: '',
      password: '',
      passwordVisible: false,
    };
  },
  computed: {
    passwordVisiblity() {
      return this.passwordVisible ? 'text' : 'password';
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    alert (err) {
      // const $q = useQuasar()
      this.$q.dialog({
        title: 'Failed to Sign in',
        message: err
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
},
    async login(){
      this.$q.loading.show({
          message: 'Signing in...'
        })
      try{
      const res = await signInWithEmailAndPassword(auth,this.email,this.password)
        if(res){
          this.$q.loading.hide()
          this.$router.push('/')
        }
      }
      catch(error){
        this.$q.loading.hide()
        this.alert(error.code)
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    auth.onAuthStateChanged(user => {
      if (user) {
        next('/');
      } else {
        next();
      }
    });
  },
};
</script>

<style scoped>
.custom-form {
  width: 100%;
  padding: 20px;
}
.regCard {
  padding: 10px;
  width: max-content;
  margin: auto;
}
.exits {
  display: flex;
  justify-content: space-between;
  padding: 5px;
}
</style>
