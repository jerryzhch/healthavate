import React, { useState, useEffect } from 'react'
import { getDevice } from 'framework7/lite-bundle'
import { f7, f7ready, App, Panel, View, Page, Navbar, Block, BlockTitle, NavRight, Link, Button } from 'framework7-react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously, signOut } from '@firebase/auth'
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, initializeFirestore } from 'firebase/firestore'
import { ref, getDatabase, set, get, update, child } from 'firebase/database'
import { useObject } from 'react-firebase-hooks/database'

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
export const fireDb = initializeFirestore(firebase, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})
const realDb = getDatabase(firebase)

export const auth = getAuth(firebase)
let globalCurrentUser = auth.currentUser

enableIndexedDbPersistence(fireDb).catch((err) => {
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
  const { username, loadingUsername, errorUsername } = useUsernameState(currentUser)
  const { schats, loadingSchtats, errorSchtats } = useSchatsState(currentUser)

  // Login screen demo data
  const device = getDevice()
  // Framework7 Parameters
  const f7params = {
    name: 'SchElevate', // App name
    theme: 'ios', // Automatic theme detection

    id: 'io.framework7.SchElevate', // App bundle ID
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
        globalCurrentUser = user
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

  const writeUserNameToDb = (userInput) => {
    set(ref(realDb, `users/${currentUser.uid}/username/`), userInput)
      .then(() => {
        f7.dialog.alert('Username was saved!')
      })
      .catch(() => {
        f7.dialog.alert('Username could not be saved!')
      })
  }

  const setUsername = () => {
    f7.dialog.prompt('Edit your user name', 'Edit Username', (userInput) => writeUserNameToDb(userInput), undefined, username?.val()).open()
  }

  return (
    userLoggedIn && (
      <App {...f7params}>
        {/* Left panel with cover effect*/}
        <Panel left reveal>
          <View>
            <Page style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Navbar title="My Schtats" />

              <Button
                style={{
                  backgroundImage: 'url(https://cdn.framework7.io/placeholder/people-100x100-9.jpg)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  borderRadius: '50%',
                  width: '120px',
                  height: '120px',
                  margin: '10px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                }}
              ></Button>
              <BlockTitle style={{ fontSize: '25px', height: '25px', margin: '20px' }}>
                {(!loadingUsername && !errorUsername && username && username.val()) || 'No Username'}
              </BlockTitle>
              <Block>
                <Button onClick={setUsername} fill>
                  Edit UserName
                </Button>
              </Block>
              <BlockTitle className="statsTitle">Elevatier</BlockTitle>
              <Block>
                <p>{(!loadingSchtats && !errorSchtats && schats && schats.val()?.elevatier) || 0}</p>
              </Block>
              <BlockTitle className="statsTitle">Points</BlockTitle>
              <Block>
                <p>{(!loadingSchtats && !errorSchtats && schats && schats.val()?.points) || 0}</p>
              </Block>
              <BlockTitle className="statsTitle">Ranking</BlockTitle>
              <Block>
                <p>{(!loadingSchtats && !errorSchtats && schats && schats.val()?.ranking) || 0}</p>
              </Block>
            </Page>
          </View>
        </Panel>

        {/* Right panel with reveal effect*/}
        <Panel right reveal>
          <View>
            <Page>
              <Navbar title="Schindlerboard" />
              <Block>Right panel content goes here</Block>
              <Block>Version: 1.0.0</Block>
              <Button
                fill
                className={'reset-button'}
                onClick={() => {
                  localStorage.removeItem('appState')
                  localStorage.removeItem('rangeSliderValue')
                  localStorage.removeItem('elevatorDestination')
                  signOut(auth).then(() => {
                    f7.dialog.alert('Click ok to restart application', 'App was resetted', () => {
                      location.reload()
                    })
                  })
                }}
              >
                Reset App
              </Button>
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

const useUsernameState = (currentUser) => {
  const [username, loadingUsername, errorUsername] = useObject(currentUser == null ? null : ref(realDb, `users/${currentUser.uid}/username`))
  return { username, loadingUsername, errorUsername }
}
const useSchatsState = (currentUser) => {
  const [schats, loadingSchtats, errorSchtats] = useObject(currentUser == null ? null : ref(realDb, `users/${currentUser.uid}/schtats`))
  return { schats, loadingSchtats, errorSchtats }
}

export const storePoints = (points) => {
  const dbRef = ref(realDb, `users/${globalCurrentUser.uid}/schtats/`)
  console.log(globalCurrentUser.uid)
  get(dbRef).then((snap) => {
    const prevPoints = snap.val()?.points ?? 0
    set(child(dbRef, 'points/'), prevPoints + points)
  })
}
