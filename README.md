# Product Stats API

Mahsulotlar statistikasi uchun API. Bu loyiha NestJS framework asosida qurilgan va PostgreSQL ma'lumotlar bazasidan foydalanadi.

## Texnologiyalar

- NestJS - Backend framework
- TypeORM - ORM (Object Relational Mapping)
- PostgreSQL - Ma'lumotlar bazasi
- JWT - Autentifikatsiya
- Swagger - API hujjatlashtirish

## O'rnatish

1. Loyihani clone qiling:

```bash
git clone <repository-url>
cd product-stats
```

2. Kerakli paketlarni o'rnating:

```bash
npm install
```

3. `.env` faylini yarating va quyidagi ma'lumotlarni o'zingizning postgresql ma'lumotlar bazangizga moslab o'zgartiring:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_stats
DB_PASSWORD=
DB_USERNAME=

PORT=8080

JWT_SECRET=you_never_walk_alone
JWT_REFRESH_SECRET_KEY=passport
JWT_REFRESH_EXPIRATION=7d
```

4. Ma'lumotlar bazasini yarating:

```bash
# PostgreSQL da product_stats nomli ma'lumotlar bazasini yarating
```

5. Admin foydalanuvchini yarating:

```bash
npm run seed:run
```

Bu buyruq admin foydalanuvchini quyidagi ma'lumotlar bilan yaratadi:

- Foydalanuvchi nomi: john_doe
- Parol: password123
- Roli: admin

## Ishga tushirish

Development mode:

```bash
npm run start:dev
```

## API Qo'llanma

### Postman Collection

Loyiha API larini testlash uchun Postman collection qo'shilgan. Uni import qilish uchun:

1. Postman dasturini oching
2. Import tugmasini bosing
3. `Product-API.postman_collection.json` faylini tanlang
4. Kolleksiyani import qiling va API larni test qilishni boshlang

### API Endpoints

Asosiy API endpointlar:

- **Auth**

  - `POST /auth/register` - Ro'yxatdan o'tish
  - `POST /auth/login` - Tizimga kirish

- **Products**
  - `GET /products` - Barcha mahsulotlarni olish (pagination va search imkoniyati bilan)
  - `POST /products` - Yangi mahsulot qo'shish rasm bilan (Admin)
  - `GET /products/:id` - Mahsulot ma'lumotlarini olish
  - `POST /products/:id/view` - Mahsulot ko'rilganlar sonini oshirish
  - `POST /products/:id/like` - Mahsulotga layk bosish (Autentifikatsiya kerak)
  - `POST /products/:id/share` - Mahsulotni ulashish sonini oshirish

## Hujjatlar

Swagger hujjatlari manzili: `http://localhost:8080/api/docs`

API so'rovlari va javoblarining batafsil ma'lumotlari uchun Swagger hujjatlarini tekshiring.
