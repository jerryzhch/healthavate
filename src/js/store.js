import { createStore } from 'framework7/lite'
import { AppState } from './appState'

const store = createStore({
  state: {
    bubbleText: [
      {
        id: AppState.ChooseDestination,
        title: 'Choose Your Destination Level',
        description: 'Welcome to Healthavate, a fun and interactive app to elevate the elevator experience (get it ;)?). Start by choosing your Destiantion Level.',
      },
      {
        id: AppState.GuessDoor,
        title: 'Guess Your assigned Schindler elevator!',
        description: 'As soon as you provided your guess, your assigned elevator will head to your pick up. Guess correctly to earn SchPoints',
      },
      {
        id: AppState.FeelingLucky,
        title: 'Are You the born winner?!',
        description:
          'If you feel like you got what it takes to beat the odds, press the "Feeling Lucky" Button. The elevator will then randomly select one floor between the start and finish. If your selected destination is drawn, you win. Otherwise you will have to take the stairs to complete your journey, which benefits your health anyway',
      },
      {
        id: AppState.GoToDestination,
        title: 'Your Schindler Elevator: ',
        description: 'Please remain calm while I will bring to your destination',
      },
      {
        id: AppState.WalkStairs,
        title: 'Your ride ends hear prematurely ',
        description: 'Your destination was not quite reached yet, as the Schindler randomiser did not choose your destination. Head to the stairs!',
      },
      {
        id: AppState.WalkStairs,
        title: 'Your ride ends here ',
        description: 'You have arrived your desired destination. Thanks for using Healthavate!',
      },
    ],
  },
  getters: {
    products({ state }) {
      return state.products
    },
  },
  actions: {
    addProduct({ state }, product) {
      state.products = [...state.products, product]
    },
  },
})
export default store
