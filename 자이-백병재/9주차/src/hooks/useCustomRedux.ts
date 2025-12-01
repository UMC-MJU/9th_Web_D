import {
    useDispatch as useDefaultDispatch,
    useSelector as useDefaultSelector,
  } from 'react-redux';
  import type { TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '../stores/store';


  export const useAppDispatch: () => AppDispatch = useDefaultDispatch;

  export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;