import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from '@reduxjs/toolkit'
import { counterSlice } from './slices/counter/counterSlice'
import cartReducer from './slices/cart/cartSlice'

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'] // Solo persiste el slice del carrito
}

// Combinar reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  counter: counterSlice.reducer,
})

// Aplicar persistencia al reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch