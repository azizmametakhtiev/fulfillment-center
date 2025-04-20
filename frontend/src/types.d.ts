export interface Client {
  _id: string
  name: string
  phone_number: string
  email: string
  inn: string
  address?: string
  banking_data?: string
  ogrn?: string
}

export type ClientMutation = Omit<Client, '_id'>

export interface GlobalError {
  message: string
}

export interface ValidationError {
  type: string
  errors: {
    [key: string]: {
      name: string
      messages: string[]
    }
  }
}

export interface DynamicField {
  key: string
  label: string
  value: string
}

export interface Log {
  user: string
  change: string
  date: string
}

export type LogWithPopulate = Omit<Log, 'user'> & {
  user: UserStripped
}

export interface Product {
  _id: string
  client: string
  title: string
  barcode: string
  article: string
  dynamic_fields?: DynamicField[]
  logs?: Log[]
}

export interface ProductWithPopulate {
  _id: string
  client: Client
  title: string
  barcode: string
  article: string
  dynamic_fields: DynamicField[]
  logs?: Log[]
}

export type ProductMutation = Omit<Product, '_id'>

export interface Defect {
  product: string
  defect_description: string
  amount: number
}

export type DefectWithPopulate = Omit<Defect, 'product'> & {
  product: Product
}

export interface DefectMutation extends Defect {
  productName: string
}

export interface ProductOrder {
  product: string
  description: string
  amount: number
}

export type ProductOrderMutation = Omit<ProductOrder, 'product'> & {
  _id: string
  product: Product
}

export interface ServiceOrder {
  service: string
  service_amount: number
  service_price: number
}

export interface ProductArrival {
  product: string
  description: string
  amount: number
}

export type ProductArrivalWithPopulate = Omit<ProductArrival, 'product'> & {
  product: Product
}

export interface ServiceArrival {
  service: string
  service_amount: number
  service_price: number
}

export type ServiceArrivalWithPopulate = Omit<ServiceArrival, 'service'> & {
  service: Service
}

export interface Arrival {
  _id: string
  client: string
  products: ProductArrival[]
  arrival_price?: number
  arrival_date: string
  sent_amount: string
  stock: string
  shipping_agent?: string | null
  pickup_location?: string
  defects?: Defect[]
  services?: ServiceArrival[]
  arrival_status: string
  received_amount?: ProductArrival[]
  logs?: Log[]
  arrivalNumber?: string
  documents?: { document: string }[]
}

export type ArrivalWithPopulate = Omit<Arrival, 'products' | 'defects' | 'received_amount' | 'client' | 'stock' | 'shipping_agent' | 'services'> & {
  client: Client
  products: ProductArrivalWithPopulate[]
  defects?: DefectWithPopulate[]
  received_amount: ProductArrivalWithPopulate[]
  logs?: LogWithPopulate[]
  stock: Stock
  shipping_agent?: Counterparty
  services?: ServiceArrivalWithPopulate[]
  documents?: { document: string }[]
}

export interface ArrivalWithClient extends Omit<Arrival, 'client' | 'stock' | 'shipping_agent'> {
  client: Client
  stock: Stock
  shipping_agent?: Counterparty | null
  documents?: { document: string }[]
}

export type ArrivalMutation = Omit<Arrival, '_id'>

export interface Order {
  _id: string
  client: string
  products: ProductOrder[]
  price: number
  stock: string
  sent_at: string
  delivered_at?: string
  comment?: string
  status: string
  orderNumber?: string
  logs?: Log[]
  defects: Defect[]
  services?: ServiceArrival[]
  documents?: { document: string }[]
}

export type OrderWithProducts = Omit<Order, 'products'> & {
  products: ProductOrderMutation[]
}

export type OrderWithProductsAndClients = Omit<Order, 'products'> & {
  products: ProductForOrderForm[]
  defects: DefectForOrderForm[]
  client: Client
  stock: Stock
}

export type OrderWithClient = Omit<Order, 'client' | 'stock'> & {
  client: Client
  stock: Stock
}

export type OrderMutation = Omit<Order, '_id'>

export interface User {
  _id: string
  email: string
  displayName: string
  role: 'super-admin' | 'admin' | 'manager' | 'stock-worker'
  token: string
}

export type UserStripped = Omit<User, 'token'>

export type UserMutation = Omit<User, '_id' | 'token'> & {
  password: string
}

export type UserWithPopulate = Omit<User, 'token'> & {
  password?: string;
}

export interface LoginMutation {
  email: string
  password: string
}

export type UserRegistrationMutation = {
  email: string
  password: string
  displayName: string
  role: 'super-admin' | 'admin' | 'manager' | 'stock-worker'
}

export interface ErrorsFields {
  client: string
  product: string
  price: string
  arrival_date: string
  arrival_price: string
  stock: string
  amount: string
  defect_description: string
  arrival_status?: string
  sent_at: string
  status?: string
  service?: string
  service_amount?: string
  service_price?: string
}

export interface Task {
  _id: string
  taskNumber: string
  user: string
  title: string
  type: string
  associated_order?: string | null
  associated_arrival?: string | null
  description: string
  date_ToDO?:string | Date
  date_inProgress?:string | Date
  date_Done?: string | Date
  status?: string | null
  logs?: Log[]
}

export interface TaskWithPopulate {
  _id: string
  taskNumber: string
  user: {
    _id: string
    email: string
    displayName: string
    role: string
  }
  title: string
  description: string
  status: string
  logs?: Log[]
  type: string
  associated_order?: {
    _id: string | null,
    orderNumber: string
  }
  associated_arrival?: {
    _id: string | null,
    arrivalNumber: string
  }
  createdAt: string,
  updatedAt: string,
  date_inProgress:string | null,
  date_Done:string | null,
  date_ToDO:string | null,
}

export interface TaskMutation {
  user: string
  title: string
  type: string
  associated_order?: string | null
  associated_arrival?: string | null
  description: string
}

export interface Service {
  _id: string
  name: string
  serviceCategory: string
  price: number
  description: string
  type: string
  logs?: Log[]
}

export interface ServiceCategory {
  _id: string
  name: string
}

export type ServiceMutation = Omit<Service, '_id' | 'logs'>

export type ServiceCategoryMutation = Omit<ServiceCategory, '_id'>

export interface PopulatedService extends Omit<Service, 'serviceCategory'> {
  serviceCategory: ServiceCategory
}

export interface ProductStockPopulate {
  _id: string
  product: ProductWithPopulate
  amount: number
}

export interface Stock {
  _id: string
  name: string
  address: string
  products?: ProductStockPopulate[]
}

export interface StockPopulate {
  _id: string
  name: string
  address: string
  products?: ProductStockPopulate[]
}

export interface StockError {
  name: string
  address: string
}

export type StockMutation = Omit<Stock, '_id'>

export interface Counterparty {
  _id: string
  name: string
  address?: string
  phone_number?: string
  isArchived: boolean
}

export type CounterpartyMutation = Omit<Counterparty, '_id'>

export interface UserTaskReport {
  user: {
    _id: string;
    displayName: string;
  };
  tasks: {
    _id: string
    taskNumber: string
    isArchived: boolean
  }[],
  taskCount: number;
}


export interface DailyTaskCount {
  date: string;
  taskCount: number;
}

export interface ReportTaskResponse {
  userTaskReports: UserTaskReport[];
  dailyTaskCounts: DailyTaskCount[];
}

export interface ClientOrderReport {
  client: {
    _id: string;
    name: string;
    isArchived: boolean
  };
  orders: {
    _id: string
    orderNumber: string
    status:string
    isArchived: boolean
  }[],
  orderCount: number;
}

export interface ReportClientResponse {
  clientOrderReport: ClientOrderReport[];
}
