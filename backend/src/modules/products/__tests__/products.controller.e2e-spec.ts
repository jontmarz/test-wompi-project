import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../../app.module'

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('/api/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/products')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true)
        expect(res.body).toHaveProperty('data')
        expect(Array.isArray(res.body.data)).toBe(true)
      })
  })

  it('/api/products/:id (GET) - should return single product', () => {
    return request(app.getHttpServer())
      .get('/api/products/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('id', '1')
      })
  })

  it('/api/products/:id (GET) - should return 404 for non-existent product', () => {
    return request(app.getHttpServer())
      .get('/api/products/999')
      .expect(404)
  })

  it('/api/health (GET) - should return health status', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok')
        expect(res.body).toHaveProperty('timestamp')
        expect(res.body).toHaveProperty('uptime')
      })
  })
})
