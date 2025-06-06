import { Route, Routes } from 'react-router-dom'
import { useAppSelector } from './app/hooks.ts'
import { selectUser } from './store/slices/authSlice.ts'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from '@/layout/Layout.tsx'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute.tsx'
import AllowedRoute from '@/components/AllowedRoute/AllowedRoute.tsx'
import LoginPage from './features/users/containers/LoginPage.tsx'
import ClientPage from './features/clients/containers/ClientPage.tsx'
import ArrivalPage from './features/arrivals/containers/ArrivalPage.tsx'
import ArrivalDetails from './features/arrivals/containers/ArrivalDetails.tsx'
import ProductPage from './features/products/containers/ProductPage.tsx'
import OrderPage from './features/orders/containers/OrderPage.tsx'
import OrderDetails from './features/orders/containers/OrderDetails.tsx'
import ReportPage from './features/reports/containers/ReportPage.tsx'
import TaskBoard from './features/tasks/components/TaskBoard.tsx'
import StockPage from './features/stocks/containers/StockPage.tsx'
import StockDetails from './features/stocks/containers/StockDetails.tsx'
import CounterpartiesPage from './features/counterparties/containers/CounterpartiesPage.tsx'
import ArchivePage from './features/archive/containers/ArchivePage.tsx'
import AdminPage from '@/features/admin/containers/AdminPage.tsx'
import InvoiceDetails from './features/invoices/containers/InvoiceDetails.tsx'
import AppUsage from '@/features/appUsage/containers/AppUsage.tsx'

const App = () => {
  const user = useAppSelector(selectUser)

  return (
    <TooltipProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute isAllowed={!!user}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager']}>
                <ClientPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager']}>
                <ClientPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/clients/:clientId"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager']}>
                <ClientPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/arrivals"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
                <ArrivalPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/arrivals/:arrivalId"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
                <ArrivalDetails />
              </AllowedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
                <ProductPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/products/:productId"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
                <ProductPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
                <OrderPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
                <OrderDetails />
              </AllowedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin']}>
                <ReportPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
                <TaskBoard />
              </AllowedRoute>
            }
          />

          <Route
            path="/tasks/:id"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager', 'stock-worker']}>
                <TaskBoard />
              </AllowedRoute>
            }
          />

          <Route
            path="/counterparties"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager']}>
                <CounterpartiesPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/stocks"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager']}>
                <StockPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/stocks/:stockId"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager']}>
                <StockDetails />
              </AllowedRoute>
            }
          />

          <Route
            path="/archives"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin']}>
                <ArchivePage />
              </AllowedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin']}>
                <AdminPage />
              </AllowedRoute>
            }
          />

          <Route
            path="/invoices/:invoiceId"
            element={
              <AllowedRoute allowedRoles={['super-admin', 'admin', 'manager']}>
                <InvoiceDetails />
              </AllowedRoute>
            }
          />

          <Route
            path="/app-usage"
            element={<AppUsage />}
          />

          <Route path="*" element={<h6 className="text-center my-8 font-bold text-2xl">Страница не найдена</h6>} />
        </Route>
      </Routes>
    </TooltipProvider>
  )
}

export default App
