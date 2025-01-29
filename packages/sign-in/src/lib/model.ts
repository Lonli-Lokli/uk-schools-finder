import {
  createStore,
  createEvent,
  createEffect,
  combine,
  sample,
} from 'effector';
import { createAction } from 'effector-action';
import { User, UserCredential, getAuth, signOut } from 'firebase/auth';
import {
  createUserWithPasskey,
  signInWithPasskey,
} from '@firebase-web-authn/browser';
import { getFunctions } from 'firebase/functions';
import { message } from 'antd';
import { once } from 'patronum';

// Events
export const startAuthentication = createEvent();
export const userChanged = createEvent<User | null>();
export const usernameChanged = createEvent<string>();
export const modalOpened = createEvent();
export const modalClosed = createEvent();
export const signUpModeToggled = createEvent();
export const signOutClicked = createEvent();

// Stores
export const $user = createStore<User | null>(null);
const $username = createStore<string>('');
const $isModalOpen = createStore(false);
const $isSignUp = createStore(false);
const $isLoading = createStore(false);
const $authenticationStarted = createStore(false);
export const $viewModel = combine({
  user: $user,
  username: $username,
  isModalOpen: $isModalOpen,
  isSignUp: $isSignUp,
  isLoading: $isLoading,
});

// Effects
export const signUpFx = createEffect<string, UserCredential>();
export const signInFx = createEffect<void, void>();
export const signOutFx = createEffect<void, void>();

// Logic
createAction({
  clock: $authenticationStarted,
  source: {
    username: $username,
    isSignUp: $isSignUp,
    isModalOpen: $isModalOpen,
  },
  target: {
    signUpFx,
    signInFx,
    $isModalOpen,
  },
  fn: (target, source) => {
    if (source.isSignUp) {
      target.signUpFx(source.username);
    } else {
      target.signInFx();
    }
    target.$isModalOpen(false);
  },
});

createAction({
  clock: modalOpened,
  source: { isSignUp: $isSignUp },
  target: { $isModalOpen, $isSignUp },
  fn: (target) => {
    target.$isModalOpen(true);
    target.$isSignUp(false);
  },
});

createAction({
  clock: modalClosed,
  target: { $isModalOpen, $username, $isSignUp },
  fn: (target) => {
    target.$isModalOpen(false);
    target.$username('');
    target.$isSignUp(false);
  },
});

sample({
  clock: once(startAuthentication),
  fn: () => true,
  target: $authenticationStarted,
});

sample({
  clock: signOutClicked,
  target: signOutFx,
});

sample({
  clock: userChanged,
  target: $user,
});

sample({
  clock: signUpModeToggled,
  fn: () => true,
  target: $isSignUp,
});

sample({
  clock: usernameChanged,
  target: $username,
});


// Helpers
const functions = getFunctions();
const auth = getAuth();
auth.onAuthStateChanged((user) => {
  console.log('User activated', user);
  userChanged(user);
});

// Effect implementations
signUpFx.use(async (username) => {
  try {
    console.log('Starting signup with username:', username);
    const result = await createUserWithPasskey(auth, functions, username);
    console.log('Signup result:', result);
    message.success('Successfully signed up!');
    return result;
  } catch (error) {
    console.error('Detailed signup error:', error);
    if (error instanceof Error) {
      message.error('Failed to sign up: ' + error.message);
      throw error;
    }
    message.error('Failed to create passkey');
    throw new Error('Failed to create passkey');
  }
});

signInFx.use(async () => {
  try {
    await signInWithPasskey(auth, functions);
    message.success('Successfully signed in!');
  } catch (error) {
    message.error('Failed to sign in: ' + (error as Error).message);
    throw error;
  }
});

signOutFx.use(async () => {
  try {
    await signOut(auth);
    message.success('Successfully signed out!');
  } catch (error) {
    message.error('Failed to sign out: ' + (error as Error).message);
    throw error;
  }
});
