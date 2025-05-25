import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GlobalError, Invoice, ValidationError } from '@/types'
import { RootState } from '@/app/store'
import {
  archiveInvoice,
  createInvoices, deleteInvoice,
  fetchArchivedInvoices,
  fetchInvoiceById,
  fetchInvoices, unarchiveInvoice,
  updateInvoice,
} from '@/store/thunks/invoiceThunk.ts'

interface InvoiceState {
  invoices: Invoice[] | null
  archivedInvoices: Invoice[] | null
  invoice: Invoice | null
  loadingFetch: boolean
  loadingFetchArchive: boolean
  loadingAdd: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  loadingArchive: boolean
  loadingUnarchive: boolean
  error: GlobalError | null
  createAndUpdateError: ValidationError | null
  updateError: ValidationError | null
}

const initialState: InvoiceState = {
  invoices: null,
  archivedInvoices: null,
  invoice: null,
  loadingFetch: false,
  loadingFetchArchive: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  loadingArchive: false,
  loadingUnarchive: false,
  error: null,
  createAndUpdateError: null,
  updateError: null,
}

export const selectAllInvoices = (state: RootState) => state.invoices.invoices
export const selectAllArchivedInvoices = (state: RootState) => state.invoices.archivedInvoices
export const selectOneInvoice = (state: RootState) => state.invoices.invoice
export const selectInvoiceCreateAndUpdateError = (state: RootState) => state.invoices.createAndUpdateError

export const selectLoadingFetch = (state: RootState) => state.invoices.loadingFetch
export const selectLoadingFetchArchiveInvoice = (state: RootState) => state.invoices.loadingFetchArchive
export const selectLoadingAdd = (state: RootState) => state.invoices.loadingAdd

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearCreateAndUpdateError: (state, { payload }: PayloadAction<string>) => {
      if (state.createAndUpdateError){
        delete state.createAndUpdateError.errors[payload]
      }
    },
    clearErrors: state => {
      state.createAndUpdateError = null
      state.updateError = null
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInvoices.pending, state => {
        state.loadingFetch = true
      })
      .addCase(fetchInvoices.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.invoices = payload
      })
      .addCase(fetchInvoices.rejected, state => {
        state.loadingFetch = false
      })

      .addCase(fetchArchivedInvoices.pending, state => {
        state.loadingFetchArchive = true
        state.error = null
      })
      .addCase(fetchArchivedInvoices.fulfilled, (state, action) => {
        state.loadingFetchArchive = false
        state.archivedInvoices = action.payload
        state.error = null
      })
      .addCase(fetchArchivedInvoices.rejected, (state, action) => {
        state.loadingFetchArchive = false
        state.error = action.payload as GlobalError
      })

      .addCase(fetchInvoiceById.pending, state => {
        state.loadingFetch = true
      })
      .addCase(fetchInvoiceById.fulfilled, (state, { payload }) => {
        state.loadingFetch = false
        state.invoice = payload
      })
      .addCase(fetchInvoiceById.rejected, state => {
        state.loadingFetch = false
      })

      .addCase(createInvoices.pending, state => {
        state.loadingAdd = true
        state.createAndUpdateError = null
      })
      .addCase(createInvoices.fulfilled, state => {
        state.loadingAdd = false
        state.createAndUpdateError = null
      })
      .addCase(createInvoices.rejected, (state, { payload: error }) => {
        state.loadingAdd = false
        state.createAndUpdateError = error || null
      })

      .addCase(updateInvoice.pending, state => {
        state.loadingUpdate = true
        state.createAndUpdateError = null
      })
      .addCase(updateInvoice.fulfilled, state => {
        state.loadingUpdate = false
        state.createAndUpdateError = null
      })
      .addCase(updateInvoice.rejected, (state, { payload: error }) => {
        state.loadingUpdate = false
        state.createAndUpdateError = error || null
      })

      .addCase(archiveInvoice.pending, state => {
        state.loadingArchive = true
        state.error = null
      })
      .addCase(archiveInvoice.fulfilled, state => {
        state.loadingArchive = false
        state.error = null
      })
      .addCase(archiveInvoice.rejected, (state, { payload: error }) => {
        state.loadingArchive = false
        state.error = error || null
      })

      .addCase(unarchiveInvoice.pending, state => {
        state.loadingUnarchive = true
        state.error = null
      })
      .addCase(unarchiveInvoice.fulfilled, (state, action) => {
        state.loadingUnarchive = false
        state.error = null

        if (state.archivedInvoices) {
          state.archivedInvoices = state.archivedInvoices.filter(invoice => invoice._id !== action.payload.id)
        }
      })
      .addCase(unarchiveInvoice.rejected, (state, { payload: error }) => {
        state.loadingUnarchive = false
        state.error = error || null
      })

      .addCase(deleteInvoice.pending, state => {
        state.loadingDelete = true
        state.error = null
      })
      .addCase(deleteInvoice.fulfilled, state => {
        state.loadingDelete = false
      })
      .addCase(deleteInvoice.rejected, (state, { payload: error }) => {
        state.loadingDelete = false
        state.error = error || null
      })
  },
})

export const { clearErrors, clearCreateAndUpdateError } = invoicesSlice.actions
export const invoicesReducer = invoicesSlice.reducer
