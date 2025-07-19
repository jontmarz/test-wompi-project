import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  loading: boolean
  currentStep: number
  error: string | null
}

const initialState: UiState = {
  loading: false,
  currentStep: 1,
  error: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setLoading, setCurrentStep, setError } = uiSlice.actions
export default uiSlice.reducer