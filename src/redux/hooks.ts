import {
  TypedUseSelectorHook,
  useDispatch as useDispatchDefault,
  useSelector as useSelectorDefault,
} from 'react-redux'
import { RootState, AppDispatch } from './store'

export const useDispatch = () => useDispatchDefault<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorDefault
