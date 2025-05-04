import dayjs from 'dayjs'
import { useOrderDetails } from '../hooks/useOrderDetails.ts'
import Modal from '@/components/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import { Link } from 'react-router-dom'
import ProductsTable from '@/components/Tables/ProductsTable.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { basename } from 'path-browserify'
import EditButton from '@/components/Buttons/EditButton.tsx'
import BackButton from '@/components/Buttons/BackButton.tsx'
import ArchiveButton from '@/components/Buttons/ArchiveButton.tsx'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import Loader from '@/components/Loader/Loader.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { cn } from '@/lib/utils.ts'
import { ArrowUpRight, ClipboardList, File, Minus, Phone } from 'lucide-react'
import CopyText from '@/components/CopyText/CopyText.tsx'
import { orderStatusStyles, tabTriggerStyles } from '@/utils/commonStyles.ts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { capitalize } from '@/utils/capitalizeFirstLetter.ts'
import ServicesTable from '@/components/Tables/ServicesTsble.tsx'

const OrderDetails = () => {
  const { order, loading, open, openArchiveModal, handleArchive, setOpen, setOpenArchiveModal, tabs, setTabs } =
    useOrderDetails()

  return (
    <>
      {loading && <Loader />}

      {order ? (
        <>
          <Modal handleClose={() => setOpen(false)} open={open}>
            <OrderForm initialData={order} onSuccess={() => setOpen(false)} />
          </Modal>

          <ConfirmationModal
            open={openArchiveModal}
            entityName="этот заказ"
            actionType="archive"
            onConfirm={() => handleArchive()}
            onCancel={() => setOpenArchiveModal(false)}
          />

          <div className="w-full max-w-[600px] mx-auto px-4 sm:space-y-7 space-y-5 text-primary">
            <BackButton />

            <div className="rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between gap-6">
              <div>
                <Badge
                  className={cn(
                    orderStatusStyles[order.status] || orderStatusStyles.default,
                    'py-2 px-2.5 font-bold mb-4',
                  )}
                >
                  {capitalize(order.status)}
                </Badge>

                <div className="space-y-5">
                  <h3 className="text-xl font-bold flex gap-1 items-center mb-3">
                    <ClipboardList />
                    {order.orderNumber}
                  </h3>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-muted-foreground">Дата отправки</p>
                    <p className="font-bold">{dayjs(order.sent_at).format('D MMMM YYYY')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-muted-foreground">Дата доставки</p>
                    <p className="font-bold">
                      {order.delivered_at ? (
                        dayjs(order.delivered_at).format('D MMMM YYYY')
                      ) : (
                        <Minus className="w-6 h-6" />
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-start justify-between">
                <div className="flex gap-2 mt-4 md:mt-0 md:mb-4 order-last md:order-none items-start">
                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <EditButton onClick={() => setOpen(true)} />
                  </ProtectedElement>
                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <ArchiveButton onClick={() => setOpenArchiveModal(true)} />
                  </ProtectedElement>
                </div>

                <div>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-muted-foreground font-bold">Склад</p>
                    <Link
                      to={`/stocks/${ order.stock._id }`}
                      className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors m-0 p-0"
                    >
                      {order.stock.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-bold">Заказчик</p>
                    <Link
                      to={`/clients/${ order.client._id }`}
                      className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors m-0 p-0"
                    >
                      {order.client.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>

                    <div className="flex gap-2 items-center">
                      <CopyText text={order.client.phone_number} children={<Phone className="h-4 w-4" />} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl shadow p-6 mb-6">
              <h3 className="font-bold uppercase mb-3 text-muted-foreground">Дополнительно</h3>
              <Tabs value={tabs.toString()} onValueChange={val => setTabs(Number(val))}>
                <TabsList className="mb-5 w-full rounded-2xl">
                  <div className="inline-flex flex-nowrap px-2 space-x-2 sm:space-x-4 overflow-x-auto">
                    <TabsTrigger value="0" className={cn(tabTriggerStyles, 'sm:text-sm sm:my-2.5')}>
                      Товары
                    </TabsTrigger>
                    <TabsTrigger value="1" className={cn(tabTriggerStyles, 'sm:text-sm sm:my-2.5')}>
                      Дефекты
                    </TabsTrigger>
                    <TabsTrigger value="2" className={cn(tabTriggerStyles, 'sm:text-sm sm:my-2.5')}>
                      Услуги
                    </TabsTrigger>
                    <TabsTrigger value="3" className={cn(tabTriggerStyles, 'sm:text-sm sm:my-2.5')}>
                      Документы
                    </TabsTrigger>
                    <TabsTrigger value="4" className={cn(tabTriggerStyles, 'sm:text-sm sm:my-2.5')}>
                      История
                    </TabsTrigger>
                  </div>
                </TabsList>

                <TabsContent value="0">
                  <ProductsTable products={order.products} />
                </TabsContent>
                <TabsContent value="1">{order.defects && <ProductsTable defects={order.defects} />}</TabsContent>
                <TabsContent value="2">
                  <ServicesTable services={order.services} />
                </TabsContent>
                <TabsContent value="3">
                  <div className={cn('flex flex-wrap gap-4 mt-3 px-2', !order.documents && 'flex-col items-center')}>
                    {order.documents ? (
                      order.documents.map((doc, idx) => (
                        <Link
                          key={idx}
                          to={`http://localhost:8000/uploads/documents/${ basename(doc.document) }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center items-center gap-2 hover:text-blue-500 transition-colors"
                        >
                          <File className="h-6 w-6" />
                          <span className="text-xs truncate w-40">{basename(doc.document)}</span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-muted-foreground font-bold text-center text-sm">Документы отсутствуют.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="4">
                  <p className="px-2">История</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      ) : (
        <p className="font-bold text-center text-lg mt-6">Заказ не найден</p>
      )}
    </>
  )
}

export default OrderDetails
