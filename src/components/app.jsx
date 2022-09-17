import React, { useState, useEffect, useCallback } from 'react'
import { getDevice } from 'framework7/lite-bundle'
import { f7, f7ready, App, Panel, View, Page, Navbar, Block, BlockTitle } from 'framework7-react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously } from '@firebase/auth'
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, initializeFirestore } from 'firebase/firestore'

import capacitorApp from '../js/capacitor-app'
import routes from '../js/routes'
import store from '../js/store'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDkD6vGNMYuuQ6XhDrDOKrXk4v0C8R9MnU',
  authDomain: 'hackzurich22-4062.firebaseapp.com',
  databaseURL: 'https://hackzurich22-4062-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'hackzurich22-4062',
  storageBucket: 'hackzurich22-4062.appspot.com',
  messagingSenderId: '304118974005',
  appId: '1:304118974005:web:7f666a470baa585f60537c',
  measurementId: 'G-5V03GVLDCX',
}

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig)
export const db = initializeFirestore(firebase, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})

export const auth = getAuth(firebase)

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
})

const MyApp = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  // Login screen demo data
  const device = getDevice()
  // Framework7 Parameters
  const f7params = {
    name: 'Healthavate', // App name
    theme: 'ios', // Automatic theme detection

    id: 'io.framework7.healthavate', // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,

    // Input settings
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    // Capacitor Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  }
  const alertLoginData = () => {
    f7.dialog.alert('Username: ' + username + '<br>Password: ' + password, () => {
      f7.loginScreen.close()
    })
  }
  f7ready(() => {
    // Init capacitor APIs (see capacitor-app.js)
    if (f7.device.capacitor) {
      capacitorApp.init(f7)
    }
    // Call F7 APIs here
  })

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        console.log(user.uid)
        setUserLoggedIn(true)
      } else {
        console.log('Sign in')
        signInAnonymously(auth)
          .then(() => setUserLoggedIn(true))
          .catch(() =>
            f7.dialog.alert('Sign In failed! Please try again later', 'Alert', () => {
              location.reload()
            })
          )
      }
    })
    return () => {}
  }, [])

  return (
    userLoggedIn && (
      <App {...f7params}>
        {/* Left panel with cover effect*/}
        <Panel left reveal>
          <View>
            <Page>
              <Navbar title="My Score" />
              <BlockTitle>Level 7: 103 Points</BlockTitle>
            </Page>
          </View>
        </Panel>

        {/* Right panel with reveal effect*/}
        <Panel right reveal>
          <View>
            <Page>
              <Navbar title="Right Panel" />
              <Block>Right panel content goes here</Block>
            </Page>
          </View>
        </Panel>

        {/* Your main view, should have "view-main" class */}
        <View main className="safe-areas" url="/" />
      </App>
    )
  )
}
export default MyApp
