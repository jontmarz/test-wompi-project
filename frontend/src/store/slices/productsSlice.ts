import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '../../types'
import { productsApi } from '../../api/products'

interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    // console.log('fetchProducts thunk called')
    try {
      const response = await productsApi.getProducts()
      // console.log('API response:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        // console.log('fetchProducts fulfilled with:', action.payload)
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar productos'
      })
  },
})

export const { clearError } = productsSlice.actions
export default productsSlice.reducer