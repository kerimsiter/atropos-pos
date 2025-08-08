import { Module } from '@nestjs/common';

// Deprecated: Item işlemleri artık OrdersController altında nested route olarak sunuluyor.
// Bu modül AppModule'den de devre dışı bırakıldı. Dosyayı projede tutuyoruz ama boş modül olarak bırakıyoruz.
@Module({})
export class OrderItemsModule {}
