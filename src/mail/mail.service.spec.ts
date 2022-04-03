import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { createTestAccount, getTestMessageUrl } from 'nodemailer';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    const testAccount = await createTestAccount();

    process.env.MAIL_HOST = 'smtp.ethereal.email';
    process.env.MAIL_PORT = '587';
    process.env.MAIL_USER = testAccount.user;
    process.env.MAIL_PASS = testAccount.pass;

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('send test email', async () => {
    const mailInfo = await service.send({
      from: '"Bisevac 👻" <bisevac@example.com>',
      to: 'bar@example.com, baz@example.com',
      subject: 'Hello ✔',
      text: 'Hello world!',
      html: '<h3>Hello world!</h3>',
    });

    console.log(`Mail Preview URL: ${getTestMessageUrl(mailInfo)}`);

    expect(mailInfo).toHaveProperty('response');
    expect(mailInfo).toHaveProperty('messageId');
  });
});
