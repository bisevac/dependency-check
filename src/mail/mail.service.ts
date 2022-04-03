import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import {
  Options as SMTPTransportOptions,
  SentMessageInfo,
} from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: Transporter<SentMessageInfo>;

  constructor() {
    const transportOptions: SMTPTransportOptions = {
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    };

    this.transporter = createTransport(transportOptions);
  }

  public async send(data: Mail.Options): Promise<SentMessageInfo> {
    if (!data.from) data.from = process.env.MAIL_FROM;

    const infoMail: SentMessageInfo = await this.transporter.sendMail(data);

    return infoMail;
  }
}
