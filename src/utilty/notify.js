import { Notify } from 'quasar'

export const createNotify = ($q) => {
  return (type, message, position = 'bottom', timeout = 3000) => {
    return $q.notify({
      type,
      message,
      position,
      timeout
    })
  }
}

// Fallback function for non-Quasar environments
export const notifyFallback = (type, message, position = 'bottom', timeout = 3000) => {
  console.log(`Notification: ${type} - ${message}`)
}

// Global notify function
export const notify = Notify.create
