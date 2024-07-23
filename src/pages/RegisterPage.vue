<template>
  <q-page class="flex flex-center" padding>
    <!-- content -->
    <div class="full-width" style="max-width: 400px;">
      <h5 class="q-my-md text-center">Register</h5>
      <q-card>
        <q-form @submit="onSubmit">
          <q-card-section>
            <q-input filled v-model="email" label="email" placeholder="email@example.com" class="q-mb-md" lazy-rules
              :rules="[val => !!val || 'Please enter a valid email address']" />
            <q-input filled v-model="password" label="password" :type="isPwd ? 'password' : 'text'" class="q-mb-sm"
              lazy-rules
              :rules="[((val) => !!val || 'Please enter a password'), (val => !(val.length <= 8) || 'Please type more than 8 characters')]">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-toggle v-model="accept" label="I accept the license and terms" />
          </q-card-section>
          <q-btn type="submit" label="register" class="full-width" color="primary" />
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
  setup () {
    const $q = useQuasar()
    const accept = ref(false)
    const isPwd = ref(true)
    const email = ref('')
    const password = ref('')

    return {
      password,
      isPwd,
      email,
      accept,
      emailRules: [
        val => (val && val.length > 0) || 'Please type something'
      ],
      onSubmit () {
        if (accept.value !== true) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        } else {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
        }
      }
    }
  },
  methods: {
    isValidEmail (email) {
      const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
      return regex.test(email)
    }
  }
}

</script>
