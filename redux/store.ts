import { IUSER } from "@/utils";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import authReducer, { Auth, setUser } from "./slice/auth-slice";
import bracReducer from "./slice/bracsSlice";
import screenReducer from "./slice/checkScreen";
import fundCardReducer from "./slice/fundCardSlice";
import { default as intentReducer } from "./slice/intentSlice";
import { default as themesReducer } from "./slice/themeSlice";
import storage from "./storage";

const reducers = combineReducers({
  auth: authReducer,
  screen: screenReducer,
  themes: themesReducer,
  intents: intentReducer,
  fundCardSlice: fundCardReducer,
  bracDetails: bracReducer,
});
const persistConfig = { key: "root", storage: storage };
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, thunk: true }),
});

export const persistor = persistStore(store);
export const dispatch = store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const getState = () => store.getState();
export function useAppState(node?: undefined): Auth;
export function useAppState<K extends keyof RootState>(node: K): RootState[K];
export function useAppState(node?: keyof RootState): any {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSelector((state: RootState) => state[node ?? "auth"]);
}

export const onUpdateProfile = (object: IUSER | any) => {
  const user = store.getState().auth || {};
  dispatch(setUser({ ...user, ...object }));
};

export default store;
