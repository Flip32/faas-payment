import * as dotenv from 'dotenv'
import * as admin from 'firebase-admin'

dotenv.config()

if (!admin.apps.length) {
  admin.initializeApp()
}

export const db = admin.firestore()
