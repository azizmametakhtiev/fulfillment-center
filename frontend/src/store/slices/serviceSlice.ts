import { createSlice } from '@reduxjs/toolkit'
import { GlobalError, PopulatedService, ValidationError } from '@/types'
import {
  fetchServices,
  fetchServiceById,
  createService,
  updateService,
  deleteService,
  archiveService, fetchArchivedServices, unarchiveService,
} from '../thunks/serviceThunk.ts'
import { RootState } from '@/app/store.ts'

interface ServiceState {
  service: PopulatedService | null;
  services: PopulatedService[];
  archivedServices: PopulatedService[] | null
  loadingFetch: boolean;
  loadingFetchOne: boolean;
  loadingFetchArchive: boolean
  loadingAdd: boolean;
  loadingArchive: boolean;
  loadingUnarchive: boolean
  loadingDelete: boolean;
  loadingUpdate: boolean;
  error: GlobalError | null;
  creationAndModificationError: ValidationError | GlobalError | null;
  deletionError: GlobalError | null;
}

const initialState: ServiceState = {
  service: null,
  services: [],
  archivedServices:null,
  loadingFetch: false,
  loadingFetchOne: false,
  loadingFetchArchive:false,
  loadingAdd: false,
  loadingArchive: false,
  loadingUnarchive: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
  creationAndModificationError: null,
  deletionError: null,
}

export const selectService = (state: RootState) => state.services.service
export const selectAllServices = (state: RootState) => state.services.services
export const selectAllArchivedServices = (state: RootState) => state.services.archivedServices
export const selectLoadingFetchService = (state: RootState) => state.services.loadingFetch
export const selectLoadingFetchOneService = (state: RootState) => state.services.loadingFetchOne
export const selectLoadingFetchArchiveService = (state: RootState) => state.services.loadingFetchArchive
export const selectLoadingAddService = (state: RootState) => state.services.loadingAdd
export const selectServiceError = (state: RootState) => state.services.error
export const selectServiceCreationAndModificationError = (state: RootState) => state.services.creationAndModificationError

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCreationAndModificationError: state => {
      state.creationAndModificationError = null
    },
    clearServiceError: state => {
      state.creationAndModificationError = null
      state.deletionError = null
      state.error = null
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchServices.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.services = action.payload
    })
    builder.addCase(fetchServices.rejected, state => {
      state.loadingFetch = false
    })

    builder.addCase(fetchServiceById.pending, state => {
      state.loadingFetchOne = true
    })
    builder.addCase(fetchServiceById.fulfilled, (state, action) => {
      state.loadingFetchOne = false
      state.service = action.payload
    })
    builder.addCase(fetchServiceById.rejected, state => {
      state.loadingFetchOne = false
    })

    builder.addCase(fetchArchivedServices.pending, state => {
      state.loadingFetchArchive = true
    })
    builder.addCase(fetchArchivedServices.fulfilled, (state, action) => {
      state.loadingFetchArchive = false
      state.archivedServices = action.payload
    })
    builder.addCase(fetchArchivedServices.rejected, state => {
      state.loadingFetchArchive = false
    })

    builder.addCase(createService.pending, state => {
      state.loadingAdd = true
    })
    builder.addCase(createService.fulfilled, state => {
      state.loadingAdd = false
    })
    builder.addCase(createService.rejected, (state, { payload: returnedError, error: thrownError }) => {
      state.loadingAdd = false
      state.creationAndModificationError =
        returnedError ?? (thrownError.message ? (thrownError as GlobalError) : { message: 'Неизвестная ошибка' })
    })

    builder.addCase(updateService.pending, state => {
      state.loadingUpdate = true
    })
    builder.addCase(updateService.fulfilled, state => {
      state.loadingUpdate = false
    })
    builder.addCase(updateService.rejected, (state, { payload: returnedError, error: thrownError }) => {
      state.loadingUpdate = false
      state.creationAndModificationError =
        returnedError ?? (thrownError.message ? (thrownError as GlobalError) : { message: 'Неизвестная ошибка' })
    })

    builder.addCase(archiveService.pending, state => {
      state.loadingArchive = true
      state.error = null
    })
    builder.addCase(archiveService.fulfilled, state => {
      state.loadingArchive = false
      state.error = null
    })
    builder.addCase(archiveService.rejected, (state, { payload: error }) => {
      state.loadingArchive = false
      state.error = error || null
    })

    builder.addCase(unarchiveService.pending, state => {
      state.loadingUnarchive = true
      state.error = null
    })

    builder.addCase(unarchiveService.fulfilled, (state, action) => {
      state.loadingUnarchive = false
      state.error = null

      if (state.archivedServices) {
        state.archivedServices = state.archivedServices.filter(service => service._id !== action.payload.id)
      }
    })
    builder.addCase(unarchiveService.rejected, (state, { payload: error }) => {
      state.loadingUnarchive = false
      state.error = error || null
    })

    builder.addCase(deleteService.pending, state => {
      state.loadingDelete = true
      state.error = null
    })
    builder.addCase(deleteService.fulfilled, state => {
      state.loadingDelete = false
      state.error = null
    })
    builder.addCase(deleteService.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.error = error || null
    })
  },
})

export const serviceReducer = serviceSlice.reducer
export const { clearCreationAndModificationError, clearServiceError } = serviceSlice.actions
