import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { google } from 'googleapis';
import path from 'path/posix';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private repo: Repository<Order>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.repo.find();
  }

  async create(dto: CreateOrderDto) {
    const order = this.repo.create(dto);
    const saved = await this.repo.save(order);

    console.log('Order saved:', saved);
    this.sendToGoogleSheets(saved).catch((err) =>      console.error('Error sending to Google Sheets:', err),
    );

    return saved;
  }

  async sendToGoogleSheets(order: Order) {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: this.configService.get<string>('GOOGLE_SHEET_ID'),
      range: 'Hoja 1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            order.nombre,
            order.apellido,
            order.telefono,
            order.direccion,
            order.numero,
            order.departamento,
            order.provincia || '',
            order.municipio || '',
            order.referencia || '',
            JSON.stringify(order.items),
            order.subtotal,
            order.total,
          ],
        ],
      },
    });
  }
}