<template>
  <q-page class="flex flex-center" padding>
    <!-- content -->
    <div class="full-width" style="max-width: 400px;">
      <h5 class="q-my-md text-center">Register</h5>
      <q-card>
        <q-form @submit="onSubmit">
          <q-card-section>
            <q-input filled v-model="name" label="name" placeholder="John" class="q-mb-md" lazy-rules
              :rules="[((val) => !!val || 'Please enter a name')]" />
            <q-input filled v-model="surname" label="surname" placeholder="Smith" class="q-mb-md" lazy-rules
              :rules="[((val) => !!val || 'Please enter a surname')]" />
            <q-input filled v-model="email" label="email" placeholder="email@example.com" class="q-mb-md" lazy-rules
              :rules="[((val) => isValidEmail(val) || 'Please enter a valid email')]" />
            <q-input filled v-model="password" label="password" :type="isPwd ? 'password' : 'text'" class="q-mb-sm"
              lazy-rules
              :rules="[((val) => !!val || 'Please enter a password'), (val => !(val.length < 8) || 'Please type more than 8 characters')]">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-toggle v-model="accept" label="I accept the license and terms" class="q-mb-sm" />
            <q-btn type="submit" label="register" class="full-width" color="primary" />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
const { register } = useAuthStore()

const $q = useQuasar()
const accept = ref(false)
const isPwd = ref(true)
const name = ref('')
const surname = ref('')
const email = ref('')
const password = ref('')

function onSubmit () {
  if (accept.value !== true) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first'
    })
  } else {
    register(name.value, surname.value, email.value, password.value)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Submitted'
    })
  }
}

function isValidEmail (email) {
  const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
  return regex.test(email)
}

</script>
