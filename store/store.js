import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import packageReducer from "./slices/packageSlice";
import userReducer from "./slices/userSlice";
import generalReducer from "./slices/generalSlice";
import notificationReducer from "./slices/notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  packages: packageReducer,
  user: userReducer,
  general: generalReducer,
  notification: notificationReducer,
});

const persistConfig = {
  key: "frontend-root",
  version: 1,
  storage,
  whitelist: ["auth"], // Only persist auth for now
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
