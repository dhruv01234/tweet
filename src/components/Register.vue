<template>
  <div>
    <q-form @submit.prevent="register" class="bg-white custom-form">
      <q-card class="regCard">Welcome! to Tweets World</q-card>
      <br>
      <q-input
        type="text"
        rounded
        standout="bg-teal text-white"
        v-model="username"
        label="Username"
        required
      />
      <br>
      <q-input
        type="email"
        rounded
        standout="bg-teal text-white"
        v-model="email"
        label="Email"
        required
      />
      <br>
      <q-input
        required
        :type="passwordVisibility"
        rounded
        standout="bg-teal text-white"
        v-model="password"
        label="Password"
      >
        <template v-slot:append>
          <q-icon
          v-if="checkpass()"
          :name="passwordVisible?'visibility':'visibility_off'"
            class="cursor-pointer"
            @click="togglePasswordVisibility"
          />
        </template>
      </q-input>
      <br>
      <q-btn
      type="submit"
      color="amber"
      label="Sign up"
      ></q-btn>
      <br>
      <br>
      <div>
        <q-card class="my-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h7">Already have an account?</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn class="bg-grey" color="white" flat to="/page/login">Sign in here</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-form>
  </div>
</template>

<script>
// import { useQuasar } from 'quasar'
import { app,auth } from '../firebase';
import { getDatabase, ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword} from 'firebase/auth';

export default {
  name: 'RegisterComp',
  data() {
    return {
      email: '',
      password: '',
      username: '',
      passwordVisible: false,
      msg:"Signing up..."
    };
  },
  computed: {
    passwordVisibility() {
      return this.passwordVisible ? 'text' : 'password';
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    checkpass() {
      return this.password.length !== 0;
    },

  alert (err) {
      // const $q = useQuasar()
      this.$q.dialog({
        title: 'Failed to Sign up',
        message: err
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
},
    async register(){
      try {
        this.$q.loading.show({
          message:this.msg
        })
        const res = await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.user = res.user;
        if (res) {
          const db = getDatabase(app);
          const dataRef = ref(db, 'users/' + res.user.uid);
          const data = {
            email: this.email,
            uid: res.user.uid,
            username:this.username,
            image:"#"
          };
          try {
            this.msg = "Signing in..."
            await set(dataRef, data);
            this.$router.push('/');
            this.$q.loading.hide()
          } catch (err) {
            this.$q.loading.hide()
          }
        }
      } catch (error) {
        this.$q.loading.hide()
        this.alert(error.code)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    auth.onAuthStateChanged(user => {
      if (user) {
        next('/');
      } else {
        next();
      }
    });
  }
};
</script>
<style scoped>
.custom-form{
  width: 100%;
  padding: 20px;
}
.regCard{
  padding: 10px;
  width: max-content;
  margin: auto;
}
.exits{
  display: flex;
  justify-content: space-between;
  padding: 5px;

}
</style>
