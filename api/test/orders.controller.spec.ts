/* eslint-disable */

/**
 * Тесты для контроллера заказов
 *
 * ВАЖНО: В этих тестах мы мокаем RolesGuard, чтобы обойти проверку ролей.
 * Это позволяет нам тестировать логику контроллера без необходимости настраивать
 * полную аутентификацию и авторизацию.
 */

import {log, debug} from 'console'

import { Test, TestingModule } from '@nestjs/testing'
import { OrdersController } from '../src/controllers/orders.controller'
import { OrdersService } from '../src/services/orders.service'
import { UpdateOrderDto } from '../src/dto/update-order.dto'
import { Readable } from 'stream'
import mongoose from 'mongoose'
import { RolesGuard } from '../src/guards/roles.guard'
import { TokenAuthService } from '../src/services/token-auth.service'
import { RolesService } from '../src/services/roles.service'
import { RequestWithUser } from 'src/types'

// Мокаем RolesGuard, чтобы он пропускал все запросы
jest.mock('../src/guards/roles.guard', () => ({
  RolesGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}))

describe('OrdersController', () => {
  let controller: OrdersController
  let service: OrdersService

  const mockOrder = {
    _id: 'order-id',
    orderNumber: 'ORD-123',
    client: 'client-id',
    stock: 'stock-id',
    products: [
      {
        product: 'product-id',
        amount: 5,
      },
    ],
    sent_at: new Date(),
    status: 'в сборке',
    isArchived: false,
  }

  const mockUserId = 'user-id'

  const mockUser = {
    _id: mockUserId
  }

  const mockRequest = {
    user: mockUser
  } as RequestWithUser

  const mockOrdersService = {
    getAll: jest.fn(),
    getAllWithClient: jest.fn(),
    getAllByClient: jest.fn(),
    getAllArchived: jest.fn(),
    getById: jest.fn(),
    getByIdWithPopulate: jest.fn(),
    getArchivedById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    unarchive: jest.fn(),
    delete: jest.fn(),
  }

  const mockTokenAuthService = {
    validateToken: jest.fn().mockResolvedValue(true),
  }

  const mockRolesService = {
    checkRoles: jest.fn().mockReturnValue(true),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: TokenAuthService,
          useValue: mockTokenAuthService,
        },
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<OrdersController>(OrdersController)
    service = module.get<OrdersService>(OrdersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllOrders', () => {
    it('should return all orders without populate when neither client nor populate is not provided', async () => {
      const orders = [mockOrder]
      mockOrdersService.getAll.mockResolvedValue(orders)

      const result = await controller.getAllOrders()

      expect(service.getAll).toHaveBeenCalledWith(false)
      expect(result).toEqual(orders)
    })

    it('should return all orders with client when called with client id', async () => {
      const populatedOrders = [{
        ...mockOrder,
        client: { _id: mockOrder.client, name: 'Test Client' },
        stock: { _id: mockOrder.stock, name: 'Test Stock' },
      }]
      mockOrdersService.getAllByClient.mockResolvedValue(populatedOrders)

      const result = await controller.getAllOrders('client-id', '1')

      expect(service.getAllByClient).toHaveBeenCalledWith('client-id', true)
      debug(result)
      expect(result[0].client).toBeDefined()
      expect(result[0].stock).toBeDefined()
      expect(result).toEqual(populatedOrders)
    })
  })

  describe('getAllArchivedOrders', () => {
    it('should return all archived orders', async () => {
      const archivedOrders = [{ ...mockOrder, isArchived: true }]
      mockOrdersService.getAllArchived.mockResolvedValue(archivedOrders)

      const result = await controller.getAllArchivedOrders()

      expect(service.getAllArchived).toHaveBeenCalled()
      expect(result).toEqual(archivedOrders)
    })
  })

  describe('getOrderById', () => {
    it('should return an order by id without populate when populate is not true', async () => {
      mockOrdersService.getById.mockResolvedValue(mockOrder)

      const result = await controller.getOrderById('order-id', 'false')

      expect(service.getById).toHaveBeenCalledWith('order-id')
      expect(result).toEqual(mockOrder)
    })

    it('should return an order by id with populate when populate is true', async () => {
      const populatedOrder = {
        ...mockOrder,
        client: { _id: mockOrder.client, name: 'Test Client' },
        stock: { _id: mockOrder.stock, name: 'Test Stock' },
        products: [
          {
            product: { _id: mockOrder.products[0].product, name: 'Test Product' },
            amount: 5,
          },
        ],
      }

      mockOrdersService.getByIdWithPopulate.mockResolvedValue(populatedOrder)

      const result = await controller.getOrderById('order-id', 'true')

      expect(service.getByIdWithPopulate).toHaveBeenCalledWith('order-id')
      expect(result.client).toBeDefined()
      expect(result.stock).toBeDefined()
      expect(result.products[0].product).toBeDefined()
    })
  })

  describe('getArchivedOrder', () => {
    it('should return an archived order by id', async () => {
      const archivedOrder = { ...mockOrder, isArchived: true }
      mockOrdersService.getArchivedById.mockResolvedValue(archivedOrder)

      const result = await controller.getArchivedOrder('order-id')

      expect(service.getArchivedById).toHaveBeenCalledWith('order-id')
      expect(result).toEqual(archivedOrder)
    })
  })

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: any = {
        client: new mongoose.Types.ObjectId(),
        stock: new mongoose.Types.ObjectId(),
        products: [
          {
            product: new mongoose.Types.ObjectId(),
            amount: 5,
            description: 'Тестовый продукт',
          },
        ],
        price: 500,
        sent_at: new Date(),
        status: 'в сборке',
      }

      const files: Express.Multer.File[] = [
        {
          fieldname: 'file',
          originalname: 'test.pdf',
          encoding: '7bit',
          mimetype: 'application/pdf',
          destination: './uploads',
          filename: 'test-123.pdf',
          path: 'uploads/test-123.pdf',
          size: 12345,
          buffer: Buffer.from('test'),
          stream: new Readable({
            read() {
              this.push(null)
            },
          }),
        },
      ]

      const newOrder = { ...mockOrder, ...createOrderDto }
      mockOrdersService.create.mockResolvedValue(newOrder)

      const result = await controller.createOrder(createOrderDto, files, mockRequest)

      expect(service.create).toHaveBeenCalledWith(createOrderDto, files, mockUserId)
      expect(result).toEqual(newOrder)
    })
  })

  describe('updateOrder', () => {
    it('should update an order successfully', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'в пути',
      }

      const files: Express.Multer.File[] = [
        {
          fieldname: 'file',
          originalname: 'updated.pdf',
          encoding: '7bit',
          mimetype: 'application/pdf',
          destination: './uploads',
          filename: 'updated-123.pdf',
          path: 'uploads/updated-123.pdf',
          size: 12345,
          buffer: Buffer.from('test'),
          stream: new Readable({
            read() {
              this.push(null)
            },
          }),
        },
      ]

      const updatedOrder = { ...mockOrder, ...updateOrderDto }

      mockOrdersService.update.mockResolvedValue(updatedOrder)

      const result = await controller.updateOrder('order-id', updateOrderDto, files, mockRequest)

      expect(service.update).toHaveBeenCalledWith('order-id', updateOrderDto, files, mockUserId)
      expect(result.status).toBe(updateOrderDto.status)
    })
  })

  describe('archiveOrder', () => {
    it('should archive an order successfully', async () => {
      const archiveMessage = { message: 'Заказ перемещен в архив' }

      mockOrdersService.archive.mockResolvedValue(archiveMessage)

      const result = await controller.archiveOrder('order-id', mockRequest)

      expect(service.archive).toHaveBeenCalledWith('order-id', mockUserId)
      expect(result).toEqual(archiveMessage)
    })
  })

  describe('unarchiveOrder', () => {
    it('should unarchive an order successfully', async () => {
      const unarchiveMessage = { message: 'Заказ восстановлен из архива' }

      mockOrdersService.unarchive.mockResolvedValue(unarchiveMessage)

      const result = await controller.unarchiveOrder('order-id', mockRequest)

      expect(service.unarchive).toHaveBeenCalledWith('order-id', mockUserId)
      expect(result).toEqual(unarchiveMessage)
    })
  })

  describe('deleteOrder', () => {
    it('should delete an order successfully', async () => {
      const deleteMessage = { message: 'Заказ успешно удален' }

      mockOrdersService.delete.mockResolvedValue(deleteMessage)

      const result = await controller.deleteOrder('order-id')

      expect(service.delete).toHaveBeenCalledWith('order-id')
      expect(result).toEqual(deleteMessage)
    })
  })
})
