<template>
  <q-page class="flex flex-center" padding>
    <!-- content -->
    <div class="full-width" style="max-width: 400px;">
      <h5 class="q-my-md text-center">Login</h5>
      <q-card>
        <q-card-section>
          <q-form @submit="onSubmit">
            <q-input filled v-model="email" label="email" placeholder="email@example.com" class="q-mb-md" />
            <q-input filled v-model="password" label="password" type="password" class="q-mb-sm" />
            <q-checkbox label="remember me" v-model="rememberMe" class="q-mb-sm" />
            <q-btn type="submit" label="login" class="full-width" color="primary" />
          </q-form>
        </q-card-section>

      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'

const { login } = useAuthStore()
const { token } = useUserStore()
const router = useRouter()

const $q = useQuasar()
const rememberMe = ref(false)
const email = ref('')
const password = ref('')

function onSubmit () {
  login(email.value, password.value)

  console.log('Token: ' + token)
  if (token !== null) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Login is success'
    })
    router.push('/')
  } else {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Login is failed'
    })
  }
}
</script>
