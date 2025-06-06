/* eslint-disable */

import {
  createMockExecutionContext,
  createMockFile,
  createMockModel,
  createMockRequestWithFiles,
  deepClone,
  wait,
} from './test-utils'
import { Document } from 'mongoose'
describe('Тестовые утилиты', () => {
  describe('createMockExecutionContext', () => {
    it('должен создавать мок ExecutionContext с пользователем и данными запроса', () => {
      const user = { id: '1', username: 'test', role: 'admin' }
      const request = { headers: { 'content-type': 'application/json' } }
      const context = createMockExecutionContext(user, request)
      expect(context).toBeDefined()
      expect(context.switchToHttp).toBeDefined()
      const req = context.switchToHttp().getRequest()
      expect(req.user).toEqual(user)
      expect(req.headers).toEqual(request.headers)
      const res = context.switchToHttp().getResponse()
      expect(res.status).toBeDefined()
      expect(res.json).toBeDefined()
      expect(res.send).toBeDefined()
    })
    it('должен создавать мок ExecutionContext без пользователя и запроса', () => {
      const context = createMockExecutionContext()
      expect(context).toBeDefined()
      const req = context.switchToHttp().getRequest()
      expect(req.user).toBeUndefined()
    })
  })
  describe('createMockModel', () => {
    it('должен создавать мок модели Mongoose с предопределенными методами', () => {
      const model = createMockModel<Document>()
      expect(model).toBeDefined()
      expect(model.find).toBeDefined()
      expect(model.findOne).toBeDefined()
      expect(model.findById).toBeDefined()
      expect(model.updateOne).toBeDefined()
      expect(model.deleteOne).toBeDefined()
      expect(model.create).toBeDefined()
      expect(model.find().exec).toBeDefined()
      expect(model.findOne().populate).toBeDefined()
      return model.updateOne({}, {}).then((result) => {
        expect(result.modifiedCount).toBe(1)
      })
    })
  })
  describe('createMockRequestWithFiles', () => {
    it('должен создавать мок запроса с файлами', () => {
      const files = [
        { filename: 'file1.txt', path: '/path/to/file1.txt' } as Express.Multer.File,
        { filename: 'file2.txt', path: '/path/to/file2.txt' } as Express.Multer.File,
      ]
      const request = createMockRequestWithFiles(files)
      expect(request).toBeDefined()
      expect(request.files).toEqual(files)
      expect(request.file).toEqual(files[0])
    })
    it('должен создавать мок запроса без файлов', () => {
      const request = createMockRequestWithFiles()
      expect(request).toBeDefined()
      expect(request.files).toEqual([])
      expect(request.file).toBeUndefined()
    })
  })
  describe('createMockFile', () => {
    it('должен создавать мок файла с дефолтными значениями', () => {
      const file = createMockFile()
      expect(file).toBeDefined()
      expect(file.fieldname).toBe('file')
      expect(file.originalname).toBe('test-file.txt')
      expect(file.mimetype).toBe('text/plain')
      expect(file.size).toBe(1024)
      expect(file.filename).toBe('test-file.txt')
      expect(file.path).toBe('/tmp/test-file.txt')
      expect(file.buffer).toBeDefined()
    })
    it('должен создавать мок файла с указанными параметрами', () => {
      const options = {
        originalname: 'custom-file.pdf',
        mimetype: 'application/pdf',
        size: 2048,
        filename: 'renamed-file.pdf',
        path: '/custom/path/renamed-file.pdf',
      }
      const file = createMockFile(options)
      expect(file).toBeDefined()
      expect(file.originalname).toBe('custom-file.pdf')
      expect(file.mimetype).toBe('application/pdf')
      expect(file.size).toBe(2048)
      expect(file.filename).toBe('renamed-file.pdf')
      expect(file.path).toBe('/custom/path/renamed-file.pdf')
    })
  })
  describe('wait', () => {
    it('должен ожидать указанное время', async () => {
      const start = Date.now()
      await wait(50) 
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(30) 
    })
  })
  describe('deepClone', () => {
    it('должен создавать глубокую копию объекта', () => {
      const original = {
        name: 'Test',
        nested: {
          value: 42,
          array: [1, 2, { key: 'value' }],
        },
      }
      const cloned = deepClone(original)
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original) 
      expect(cloned.nested).not.toBe(original.nested) 
      cloned.name = 'Modified'
      cloned.nested.value = 99
      expect(original.name).toBe('Test')
      expect(original.nested.value).toBe(42)
    })
  })
})
