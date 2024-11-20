import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export const useNotifications = () => {
  const { $firebase } = useNuxtApp()
  
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        const messaging = getMessaging($firebase)
        const token = await getToken(messaging)
        return token
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      throw error
    }
  }

  const setupMessageListener = () => {
    const messaging = getMessaging($firebase)
    onMessage(messaging, (payload:any) => {
      new Notification(payload.notification.title, {
        body: payload.notification.body
      })
    })
  }

  return {
    requestPermission,
    setupMessageListener
  }
}