import { createStore } from 'framework7/lite'
import { AppState } from './appState'

const store = createStore({
  state: {
    bubbleTexts: [
      {
        id: AppState.ChooseDestination,
        title: 'Choose Your Destination Level',
        description: 'Welcome to SchElevate, a fun and interactive app to elevate the elevator experience (get it ;)?). I\'m the Dude. Let\'s start by choosing your Destination.',
      },
      {
        id: AppState.GuessDoor,
        title: 'Guess Your assigned SchElevator!',
        description: 'As soon as you provided your guess, your assigned elevator will head to your pick up. Guess correctly to earn SchPoints',
      },
      {
        id: AppState.FeelingLucky,
        title: 'Are You the born winner?!',
        description:
          'If you feel like you got what it takes to beat the odds, press the "Feeling Lucky" Button. The elevator will then randomly select one floor between the start and finish. If your selected destination is drawn, you win. Otherwise you will have to take the stairs to complete your journey, which benefits your health anyway.',
      },
      {
        id: AppState.GoToDestination,
        title: 'Your SchElevator: ',
        description: 'Please remain calm while I will bring you to your destination, Swoosh',
      },
      {
        id: AppState.RandomiseDestination,
        title: 'Your SchElevator: ',
        description: 'You felt lucky today. My fancy randomised calculation takes you to this new destination: ',
      },
      {
        id: AppState.WalkStairs,
        title: 'Your ride ends here prematurely ',
        description: 'Your destination was not quite reached yet, as the SchRrandomiser did not choose your destination. Head to the stairs!',
      },
      {
        id: AppState.WalkStairs,
        title: 'Your ride ends here ',
        description: 'You have arrived your desired destination. Thanks for using SchElevate!',
      },
    ],
  },
  getters: {
    products({ state }) {
      return state.bubbleTexts
    },
  },
  actions: {
    addProduct({ state }, bubbleText) {
      state.bubbleTexts = [...state.bubbleTexts, bubbleText]
    },
  },
})
export default store
