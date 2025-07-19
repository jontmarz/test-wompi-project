import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PaymentData, Transaction } from '../../types'
import { paymentsApi } from '../../api/payments'

interface PaymentState {
  paymentData: PaymentData | null
  transaction: Transaction | null
  loading: boolean
  error: string | null
}

const initialState: PaymentState = {
  paymentData: null,
  transaction: null,
  loading: false,
  error: null,
}

export const createTransaction = createAsyncThunk(
  'payment/createTransaction',
  async (data: PaymentData) => {
    const response = await paymentsApi.createTransaction(data)
    return response.data
  }
)

export const checkTransactionStatus = createAsyncThunk(
  'payment/checkStatus',
  async (transactionId: string) => {
    const response = await paymentsApi.getTransactionStatus(transactionId)
    return response.data
  }
)

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentData: (state, action: PayloadAction<PaymentData>) => {
      state.paymentData = action.payload
    },
    clearPaymentData: (state) => {
      state.paymentData = null
      state.transaction = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.transaction = action.payload
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al crear la transacción'
      })
      .addCase(checkTransactionStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkTransactionStatus.fulfilled, (state, action) => {
        state.loading = false
        state.transaction = action.payload
      })
      .addCase(checkTransactionStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al verificar el estado'
      })
  },
})

export const { setPaymentData, clearPaymentData, clearError } = paymentSlice.actions
export default paymentSlice.reducer