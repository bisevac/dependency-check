import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let subscribeId = null;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ dependency-check subscribe (POST)', () => {
    return request(app.getHttpServer())
      .post('/dependency-check')
      .send({
        url: 'https://github.com/codefresh-contrib/php-composer-sample-app',
        mails: ['bisevac@example.com'],
        subscribe: true,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.outdatedDependecyList).toBeInstanceOf(Array);
      })
      .then((res) => {
        subscribeId = res.body.subscribeId;
      });
  });

  it('/ dependency-check unsubscribe (POST)', () => {
    return request(app.getHttpServer())
      .post('/dependency-check/unsubscribe')
      .send({
        subscribeId,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toEqual(true);
      });
  });

  it('/ dependency-check unsubscribe non exists subscribeId (POST)', () => {
    return request(app.getHttpServer())
      .post('/dependency-check/unsubscribe')
      .send({
        subscribeId: '12341245',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toEqual(false);
      });
  });
});
