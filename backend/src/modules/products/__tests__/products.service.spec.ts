import { Test, TestingModule } from '@nestjs/testing'
import { ProductsService } from '../products.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Product } from '../../../infrastructure/database/entities/product.entity'
import { Repository } from 'typeorm'

describe('ProductsService', () => {
  let service: ProductsService
  let repository: Repository<Product>

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    repository = module.get<Repository<Product>>(getRepositoryToken(Product))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return array of products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100, stock: 10 },
        { id: '2', name: 'Product 2', price: 200, stock: 5 },
      ]
      
      mockRepository.find.mockResolvedValue(mockProducts)
      
      const result = await service.findAll()
      
      expect(result.isSuccess()).toBe(true)
      expect(result.getValue()).toEqual({
        success: true,
        data: mockProducts,
      })
    })

    it('should handle repository errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'))
      
      const result = await service.findAll()
      
      expect(result.isSuccess()).toBe(false)
    })
  })
})
