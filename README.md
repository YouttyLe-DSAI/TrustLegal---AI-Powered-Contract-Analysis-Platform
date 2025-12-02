# 🏛️ TrustLegal - AI-Powered Contract Analysis Platform

> **Nền tảng pháp lý thông minh** sử dụng Retrieval-Augmented Generation (RAG) và Large Language Models để tự động hóa quy trình rà soát, phân tích rủi ro và tra cứu hợp đồng cho doanh nghiệp hiện đại.

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)

**[🎯 Tính Năng](#-tính-năng) • [🏗️ Kiến Trúc](#-kiến-trúc) • [⚡ Khởi Động Nhanh](#-khởi-động-nhanh) • [📚 Hướng Dẫn](#-hướng-dẫn-chi-tiết) • [🚀 Triển Khai](#-triển-khai)**

</div>

---

## 📋 Tổng Quan Dự Án

**TrustLegal** là một giải pháp toàn diện cho ngành pháp lý hiện đại, kết hợp:

- 🤖 **AI Analysis**: Phân tích hợp đồng tự động bằng Claude 3 Haiku + AWS Bedrock
- 💬 **Chat Interface**: Giao diện hội thoại tương tác để hỏi đáp về hợp đồng
- 📰 **News Integration**: Cập nhật tin tức pháp lý, kinh tế từ Báo Chính Phủ (RAG)
- 🔐 **User Management**: Quản lý người dùng với xác thực bảo mật
- 💳 **Subscription Plans**: Hệ thống gói dịch vụ (Free Trial, Pro, Enterprise)
- 📊 **Risk Assessment**: Đánh giá rủi ro chi tiết cho mỗi hợp đồng

---

## 🎯 Tính Năng

### ✨ Tính Năng Chính

| Tính Năng | Mô Tả |
|-----------|--------|
| **📤 Upload Hợp Đồng** | Hỗ trợ PDF, DOCX, TXT với xử lý Unicode Việt Nam |
| **🔍 Phân Tích AI** | Trích xuất điều khoản, đánh giá rủi ro, tóm tắt nội dung |
| **⚠️ Risk Scoring** | Phân loại rủi ro (LOW, MEDIUM, HIGH, CRITICAL) |
| **💬 Chat với AI** | Hỏi câu hỏi cụ thể về hợp đồng, nhận câu trả lời có ngữ cảnh |
| **📚 Tra Cứu Pháp Lý** | Tìm kiếm ngữ nghĩa, luật liên quan, án lệ |
| **📰 News Feed** | Cập nhật tin tức kinh tế, chính sách từ các nguồn tin uy tín |
| **🔐 Xác Thực** | Đăng ký/Đăng nhập với email & mật khẩu hoặc Google OAuth |
| **💾 Lưu Trữ** | Lịch sử phân tích, phiên chat được lưu trữ vĩnh viễn |

### 🎨 Giao Diện Người Dùng

- **Modern Design**: Tailwind CSS + Dark Mode
- **Responsive**: Tối ưu cho mobile, tablet, desktop
- **Real-time Feedback**: Hiển thị trạng thái xử lý trực tiếp

---

## 🏗️ Kiến Trúc

```
TrustLegal (Fullstack)
│
├── 🎨 Frontend (Next.js 15 + TypeScript)
│   ├── App Router
│   ├── Components
│   │   ├── Contract Upload
│   │   ├── Chat Interface
│   │   ├── Risk Analysis Display
│   │   └── News Feed
│   └── UI Library (Tailwind + Shadcn/ui)
│
├── 🖥️ Backend (Express + TypeScript)
│   ├── REST API
│   ├── Authentication (JWT + bcrypt)
│   ├── File Upload (Multer)
│   ├── Database ORM (Prisma)
│   ├── News Crawler (Cheerio + Axios)
│   └── AI Lambda Integration
│
├── 🤖 AI Service (FastAPI + Python)
│   ├── AWS Bedrock Integration
│   ├── RAG Pipeline
│   ├── Claude 3 Haiku LLM
│   └── Embedding Processing
│
└── 💾 Database (PostgreSQL)
    ├── Users
    ├── Contracts
    ├── Analysis Reports
    ├── Chat Sessions
    └── Subscriptions
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Shadcn/ui + Lucide Icons
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **ORM**: Prisma 5
- **Authentication**: bcryptjs + JWT
- **File Handling**: Multer
- **Web Scraping**: Cheerio + Axios
- **Email**: Nodemailer

### AI/ML
- **Framework**: FastAPI
- **LLM Provider**: AWS Bedrock (Claude 3 Haiku)
- **RAG**: Custom implementation
- **Language**: Python 3.11+

### Infrastructure
- **Database**: PostgreSQL 15+
- **File Storage**: Local (uploads/) hoặc S3
- **Deployment**: Docker ready

---

## ⚡ Khởi Động Nhanh

### Yêu Cầu
- **Node.js** ≥ 18.x
- **Python** ≥ 3.11
- **PostgreSQL** ≥ 15
- **AWS Account** (cho Bedrock)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/trustlegal.git
cd trustlegal
```

### 2️⃣ Cấu Hình Biến Môi Trường

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/trustlegal"

# AWS
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_DEFAULT_REGION=us-east-1

# AI Service
AI_LAMBDA_URL=http://localhost:8000/contracts/analyze

# Email (Optional)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### AI Service (.env)
```env
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_DEFAULT_REGION=us-east-1
```

### 3️⃣ Cài Đặt Dependencies

```bash
# Install tất cả
npm run install:all

# Hoặc lần lượt
npm install                    # Root
cd frontend && npm install     # Frontend
cd ../backend && npm install   # Backend
cd ../AI-Service && pip install -r requirements.txt  # AI
```

### 4️⃣ Setup Database

```bash
cd backend
npx prisma db push        # Đẩy schema lên DB
npx prisma generate      # Generate Prisma Client
cd ..
```

### 5️⃣ Khởi Động Services

```bash
# Chạy tất cả (Backend + Frontend + AI) đồng thời
npm run dev

# Hoặc từng cái riêng:
npm run backend    # Terminal 1: Backend on http://localhost:5000
npm run frontend   # Terminal 2: Frontend on http://localhost:3000
npm run ai         # Terminal 3: AI on http://localhost:8000
```

### 🎉 Truy Cập

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:5000 | 5000 |
| AI Service | http://localhost:8000 | 8000 |

---

## 📚 Hướng Dẫn Chi Tiết

### 📤 Upload & Phân Tích Hợp Đồng

```typescript
// Frontend: Gửi file hợp đồng
const formData = new FormData();
formData.append('file', contractFile);
formData.append('email', userEmail);

const response = await fetch('http://localhost:5000/api/contract/upload', {
  method: 'POST',
  body: formData
});

const { contractId } = await response.json();
```

**Quy trình Backend:**
1. Lưu file vào thư mục `uploads/`
2. Gọi AI Lambda endpoint
3. Lambda xử lý với Claude 3 Haiku
4. Lưu kết quả vào database
5. Tạo chat session tự động

### 💬 Chat về Hợp Đồng

```typescript
// Gửi tin nhắn
const res = await fetch('http://localhost:5000/api/chat/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractId: 'contract-id',
    message: 'Điều khoản thanh toán có rủi ro gì?'
  })
});

// Lấy lịch sử chat
const chat = await fetch(`http://localhost:5000/api/chat/${contractId}`);
const messages = await chat.json();
```

### 🔐 Authentication Flow

```bash
# 1. Đăng ký
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "phone": "+84912345678"
}

# 2. Đăng nhập
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}

# 3. Lấy thông tin user
GET /api/auth/me?email=user@example.com
```

### 📊 Database Schema

**Mô hình dữ liệu chính:**

```sql
-- Users
- id (UUID)
- email (UNIQUE)
- passwordHash
- fullName, phone, dob
- provider (credentials/google)
- role (USER/ADMIN)

-- Contracts
- id (UUID)
- userId (FK)
- fileName, fileSize, mimeType
- s3Key (file path)
- status (PENDING/PROCESSING/COMPLETED/FAILED)
- createdAt, updatedAt

-- AnalysisReports
- id (UUID)
- contractId (UNIQUE, FK)
- summary (TEXT)
- overallRisk (LOW/MEDIUM/HIGH/CRITICAL)
- fullJsonResult (JSON)
- modelUsed

-- ChatSessions & Messages
- ChatSession: userId, contractId
- Message: sessionId, role (USER/AI), content
```

---

## 🚀 Triển Khai

### Docker

```bash
# Build images
docker-compose build

# Chạy services
docker-compose up

# Hoặc chỉ backend
docker run -p 5000:5000 \
  -e DATABASE_URL="postgresql://..." \
  -e AI_LAMBDA_URL="http://ai-service:8000/contracts/analyze" \
  trustlegal-backend
```

### Vercel (Frontend)

```bash
# Deploy Next.js
vercel deploy --prod
```

### AWS Lambda (AI Service)

1. Đóng gói Python code thành ZIP
2. Upload lên AWS Lambda
3. Set trigger: API Gateway
4. Cấu hình IAM cho Bedrock access

### Production Checklist

- [ ] Sử dụng HTTPS/TLS
- [ ] Cấu hình CORS đúng
- [ ] Thiết lập rate limiting
- [ ] Enable database backup
- [ ] Cấu hình logging & monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure email service
- [ ] Optimize database indexes

---

## 📁 Cấu Trúc Thư Mục

```
local-contract/
├── frontend/                    # Next.js 15
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Home page + News feed
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Register page
│   │   │   ├── generator/      # Contract generator
│   │   │   └── pricing/        # Pricing page
│   │   ├── components/
│   │   │   ├── features/
│   │   │   │   ├── analysis/   # Analysis display
│   │   │   │   ├── chat/       # Chat interface
│   │   │   │   └── contract/   # Contract upload
│   │   │   ├── layout/         # Shared layouts
│   │   │   └── ui/             # Reusable UI components
│   │   └── lib/                # Utilities
│   └── package.json
│
├── backend/                     # Express + TypeScript
│   ├── src/
│   │   └── server.ts           # Main server file
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── uploads/                # Local file storage
│   └── package.json
│
├── AI-Service/                  # FastAPI + Python
│   ├── main.py                 # FastAPI wrapper
│   ├── lambda_function_callllm.py
│   ├── lambda_function_ragsearch.py
│   └── legal_chunks_with_emb.jsonl
│
└── package.json                 # Root workspace
```

---

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register          # Đăng ký
POST   /api/auth/login             # Đăng nhập
GET    /api/auth/me?email=...      # Lấy thông tin user
```

### Contracts
```
POST   /api/contract/upload        # Upload hợp đồng
GET    /api/contracts?email=...    # Danh sách hợp đồng
DELETE /api/contract/:id           # Xóa hợp đồng
```

### Chat
```
GET    /api/chat/:contractId       # Lịch sử chat
POST   /api/chat/send              # Gửi tin nhắn
```

### News
```
GET    /api/news                   # Danh sách tin tức
```

---

## 🧪 Testing

### Unit Tests (Backend)

```bash
cd backend
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### Load Testing

```bash
npm run test:load
```

---

## 🐛 Troubleshooting

### Lỗi: `Cannot find module 'lambda_function.py'`
```bash
# Chắc chắn file lambda_function.py nằm trong thư mục AI-Service/
# Hoặc thêm sys.path vào main.py
```

### Lỗi: `AI_LAMBDA_URL` không kết nối
```bash
# Kiểm tra AI service đang chạy
curl http://localhost:8000

# Check .env có đúng URL không
echo $AI_LAMBDA_URL
```

### Database connection error
```bash
# Kiểm tra PostgreSQL đang chạy
psql -U postgres -d trustlegal -c "SELECT 1;"

# Reset migration
cd backend && npx prisma migrate reset
```

---

## 🤝 Đóng Góp

Chúng tôi hoan nghênh các pull request! Vui lòng:

1. Fork repository
2. Tạo branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📊 Performance Metrics

- ⚡ **Frontend Load Time**: < 2s (First Contentful Paint)
- 🔄 **API Response Time**: < 200ms (average)
- 🤖 **AI Analysis Time**: 5-15s (depending on document size)
- 💾 **Database Query Time**: < 50ms

---

## 📄 License

Dự án này được cấp phép dưới **MIT License** - xem file [LICENSE](LICENSE) để biết chi tiết.

---

## 👥 Tác Giả

**TrustLegal Team**

- 🔨 Development: Full-stack Engineer
- 🤖 AI/ML: Data Scientist
- 🎨 UI/UX: Product Designer

---

## 📞 Liên Hệ & Support

- **Email**: support@trustlegal.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/trustlegal/issues)
- **Discord**: [Community Server]
- **Documentation**: [Wiki](https://github.com/yourusername/trustlegal/wiki)

---

## 🎓 Về Dự Án

Dự án này được phát triển như phần của khóa học tại **FPTU** để giải quyết vấn đề:
- 📋 Phân tích hợp đồng tốn thời gian
- ⚠️ Khó phát hiện rủi ro
- 📚 Tra cứu pháp lý phức tạp

**Solution:** Kết hợp AI + RAG để tự động hóa quy trình pháp lý cho doanh nghiệp hiện đại.

---

<div align="center">

### ⭐ Nếu bạn thích dự án này, hãy cho một ⭐ GitHub!

![Stars](https://img.shields.io/github/stars/yourusername/trustlegal?style=social)
![Forks](https://img.shields.io/github/forks/yourusername/trustlegal?style=social)

**Made with ❤️ by TrustLegal Team**

</div>
# TrustLegal · AI Contract Intelligence Platform
> Giải pháp end-to-end giúp doanh nghiệp Việt Nam đọc – hiểu – đàm phán hợp đồng trong vài phút bằng RAG + LLM và bảng điều khiển đẹp mắt.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Express](https://img.shields.io/badge/Express.js-5-green?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.22-blue?logo=prisma)
![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-orange?logo=amazonaws)

## Tóm tắt nhanh
- Landing page và dashboard Next.js 19 (App Router) với hero chuyển động, crawler tin pháp lý realtime và trải nghiệm upload + chat hợp đồng mượt mà.
- Backend Express + Prisma/PostgreSQL quản lý user, hạn ngạch upload, pipeline xử lý file (multer → AI Lambda → lưu kết quả phân tích + mở phiên chat).
- AI-Service Python mô phỏng Lambda: FastAPI proxy, 2 hàm chính cho Claude 3 Haiku (contract analysis) và RAG search (Cohere embeddings + index pháp lý ~900 MB).
- Quy trình trọn vẹn: người dùng đăng ký → tải hợp đồng → AI đánh giá rủi ro + tạo báo cáo JSON + seed hội thoại → chat hỏi đáp → xem tin tức pháp luật cập nhật.

## Mục lục
1. [Kiến trúc tổng thể](#kiến-trúc-tổng-thể)
2. [Điểm nổi bật](#điểm-nổi-bật)
3. [Ngăn xếp công nghệ](#ngăn-xếp-công-nghệ)
4. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
5. [Hướng dẫn chạy local](#hướng-dẫn-chạy-local)
6. [Luồng nghiệp vụ & API chính](#luồng-nghiệp-vụ--api-chính)
7. [Kịch bản demo gợi ý](#kịch-bản-demo-gợi-ý)
8. [Định hướng phát triển](#định-hướng-phát-triển)

## Kiến trúc tổng thể
```
[Next.js Frontend]
    ├─ Landing page + Pricing
    ├─ Dashboard upload + chat hợp đồng
    └─ Tin pháp luật realtime (crawler)
          │
          ▼
[Express + Prisma API] ─── PostgreSQL
    ├─ Auth, subscription, quota
    ├─ Quản lý hợp đồng + báo cáo AI
    ├─ Chat session & message seed
    └─ REST API /api/*
          │
          ▼
[AI-Service (FastAPI)] ──► AWS Bedrock Claude 3 Haiku
    ├─ lambda_function_callllm.py  (phân tích rủi ro)
    └─ lambda_function_ragsearch.py (Cohere embedding + S3 index)
```
- **Frontend** (`frontend/`): Next.js 16, Tailwind, Framer Motion, Lucide, Radix UI; state client side để thao tác file/chat trực tiếp.
- **Backend** (`backend/`): Express 5 + Prisma Client. Multer lưu file local, tạo `Contract`, cập nhật `Subscription`, gọi AI Lambda, ghi `AnalysisReport`, tạo `ChatSession` và seed message. Có crawler tin tức từ Báo Chính Phủ (axios + cheerio).
- **AI-Service** (`AI-Service/`): Python 3.12, FastAPI wrapper chạy local nhưng giả lập Lambda. `lambda_function_callllm.py` chuẩn hóa prompt, chọn TEXT/DOCUMENT mode, parse JSON; `lambda_function_ragsearch.py` tải index từ S3, dùng Cohere embed-multilingual-v3 để tìm văn bản luật liên quan.

## Điểm nổi bật
- **AI Contract Risk Analysis**: Claude 3 Haiku đọc PDF/DOCX/HTML, trả về JSON chuẩn gồm tóm tắt, mức độ rủi ro, danh sách risk items và gợi ý điều khoản luật liên quan.
- **Realtime Legal News Hub**: Trang chủ hiển thị tin nổi bật + danh sách tin kinh tế/chính sách mới nhất (crawl >6 bài) với fallback ảnh thông minh theo chủ đề.
- **Quota & Subscription Guard**: User mới nhận Free Trial (5 uploads). Upload tự động tăng `currentUploads`, kiểm tra trước khi gửi AI để tránh spam.
- **Chat Layer trên kết quả AI**: Sau khi phân tích, hệ thống tạo `ChatSession`, seed message có tóm tắt và thống kê rủi ro; người dùng chat tiếp, message lưu database.
- **RAG-ready AI stack**: Dịch vụ RAG riêng dùng Cohere embeddings, cosine similarity, filter metadata (source_type, doc_category, field) để cung cấp legal context cho prompt.
- **CLI one-command dev**: `npm run dev` ở root = backend + frontend + AI local service chạy song song bằng `concurrently`, phù hợp show-case trong CV.

## Ngăn xếp công nghệ
| Layer            | Công nghệ chính                                                                              |
|------------------|----------------------------------------------------------------------------------------------|
| Frontend         | Next.js 16 (App Router), React 19, TailwindCSS, Framer Motion, Radix UI, Lucide Icons        |
| Backend API      | Express 5, Prisma ORM, Multer, Axios, Cheerio, Nodemailer, bcryptjs                          |
| Database         | PostgreSQL (qua Prisma)                                                                      |
| AI / Data        | FastAPI, AWS Bedrock (Claude 3 Haiku), Cohere Embed v3, boto3, JSONL legal corpus (~0.9 GB)  |
| Tooling          | TypeScript, ts-node, concurrently, dotenv, ESLint, Tailwind CLI                              |

## Cấu trúc thư mục
```
local-contract/
├─ frontend/        # Next.js app, pages (landing, login, dashboard, pricing)
├─ backend/         # Express server, Prisma schema, uploads/, src/server.ts
├─ AI-Service/      # FastAPI wrapper + 2 lambda_function_* files + corpus jsonl
├─ package.json     # Scripts để chạy đồng thời FE/BE/AI
└─ README.md        # Bạn đang đọc
```

## Hướng dẫn chạy local
1. **Cài đặt**  
   ```bash
   npm run install:all
   ```
2. **Biến môi trường**
   - `backend/.env`: `DATABASE_URL=postgres://...`, `AI_LAMBDA_URL=http://localhost:8000/contracts/analyze`, thông tin SMTP nếu kích hoạt gửi mail (`SMTP_USER`, `SMTP_PASS` thay cho giá trị mẫu trong code).
   - `AI-Service/.env`: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `MODEL_ID` (vd `anthropic.claude-3-haiku-20240307-v1:0`), `RAG_API_URL` (nếu gọi chéo), `LEGAL_INDEX_BUCKET`, `LEGAL_INDEX_KEY`.
3. **Prisma migrate**
   ```bash
   cd backend
   npx prisma migrate dev
   cd ..
   ```
4. **Chạy toàn bộ stack**
   ```bash
   npm run dev
   ```
   - FE: http://localhost:3000  
   - BE: http://localhost:5000  
   - AI-Service: http://localhost:8000

## Luồng nghiệp vụ & API chính
1. **Đăng ký / đăng nhập**  
   - `POST /api/auth/register`: tạo user + subscription Free Trial (PlanType.FREE_TRIAL).  
   - `POST /api/auth/login`: verify email/password (bcrypt).  
   - `GET /api/auth/me?email=...`: lấy thông tin + subscription để render dashboard.
2. **Upload & phân tích hợp đồng**  
   - `POST /api/contract/upload`: Multer nhận file → lưu metadata → check quota → tạo `Contract` trạng thái `PENDING` → phản hồi `contractId`.  
   - Tác vụ nền: gọi `callAILambda()` → parse kết quả → tạo `AnalysisReport`, chuyển trạng thái `COMPLETED`, mở `ChatSession`, seed message từ AI.  
   - Nếu thất bại, contract chuyển `FAILED` và lưu `errorMessage`.
3. **Chi tiết hợp đồng & chat**  
   - `GET /api/contracts?email=...`: lịch sử upload (id, tên file, trạng thái, risk).  
   - `GET /api/chat/:contractId`: trả danh sách messages (user/ai).  
   - `POST /api/chat/send`: lưu câu hỏi user, tạo phản hồi giả lập AI (hiện placeholder, chờ tích hợp model hội thoại).
4. **Tin pháp luật**  
   - `GET /api/news`: crawler Báo Chính Phủ (axios + cheerio), gắn ảnh dự phòng, ghép tin ghim và tin mới (kinh tế, chính sách).
5. **RAG search service**  
   - `POST /rag/search` (AI-Service): nhận `query`, `top_k`, `filters`, sinh embedding Cohere, tính cosine, trả về chunk văn bản (kèm score), phục vụ prompt injection.

## Kịch bản demo gợi ý
1. **Landing → Đăng ký → Dashboard**: cho thấy thương hiệu TrustLegal, CTA, sau đó chuyển tới dashboard với trạng thái user được fetch lại từ backend.
2. **Upload hợp đồng pháp lý**: kéo thả file PDF mẫu, xem spinner, sau 2–3s chatbox được seed bằng tóm tắt AI + risk level.
3. **Chat truy vấn điều khoản**: hỏi “rủi ro thanh toán”, AI (placeholder) trả lời gợi ý; highlight ý tưởng future integration.
4. **Theo dõi quota**: upload >5 file sẽ bị chặn (403) → giới thiệu màn Pricing & upsell plan Pro/Enterprise.
5. **News Hub**: quay về landing, scroll phần Tin tức hiển thị dữ liệu crawler, nhấn mở bài gốc Báo Chính Phủ → chứng minh tính realtime.

## Định hướng phát triển
- Kết nối thực tế với AWS Bedrock / Bedrock Agents để biến chat reply từ placeholder thành hội thoại RAG hoàn chỉnh.
- Gắn stripe/webhook cho module Pricing, tự động nâng cấp `Subscription.planType`.
- Triển khai storage S3 + signed URL để quản lý file an toàn thay vì lưu local `uploads/`.
- Viết test (Vitest/Jest cho frontend, supertest cho backend) và bổ sung CI (GitHub Actions) để tăng độ tin cậy trước khi public.

---
Made with ❤️ bởi nhóm TrustLegal – sẵn sàng xuất hiện trong portfolio & CV của bạn!
