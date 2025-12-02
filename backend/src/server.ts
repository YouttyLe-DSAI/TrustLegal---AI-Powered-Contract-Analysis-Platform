import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, UserRole, ProcessingStatus, Sender, PlanType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// --- CẤU HÌNH ---
dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = 5000;


app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '50mb' })); 


const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, Date.now() + '-' + originalName.replace(/\s+/g, '_'));
    }
});
const upload = multer({ storage });


// Cấu hình gửi mail (Nếu cần dùng sau này)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', 
        pass: 'your-app-password'
    }
});

// ==================================================
// [HELPER] VALIDATION & UTILS
// ==================================================

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeFileName(originalName: string): string {
    // 1. Chuyển tiếng Việt có dấu thành không dấu
    let str = originalName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // 2. Xóa đuôi file (Extension) vì Bedrock cấm dấu chấm trong tên
    const lastDotIndex = str.lastIndexOf(".");
    if (lastDotIndex !== -1) {
        str = str.substring(0, lastDotIndex);
    }

    // 3. Thay thế ký tự lạ bằng khoảng trắng
    str = str.replace(/[^a-zA-Z0-9 \-\(\)\[\]]/g, " ");
    
    // 4. Xóa khoảng trắng thừa
    str = str.replace(/\s+/g, " ").trim();
    
    // 5. Fallback
    if (!str) str = "Uploaded-Document";

    return str;
}

// ==================================================
// [HELPER] GỌI AI LAMBDA (QUAN TRỌNG)
// ==================================================

async function callAILambda(filePath: string, fileName: string, mimeType: string) {
    let fileFormat = 'txt';
    if (mimeType.includes('pdf')) fileFormat = 'pdf';
    else if (mimeType.includes('word') || mimeType.includes('officedocument') || mimeType.includes('msword')) fileFormat = 'docx';
    else if (mimeType.includes('text') || mimeType.includes('plain')) fileFormat = 'txt';

    // Fix cứng dựa trên đuôi file
    if (fileName.toLowerCase().endsWith('.docx')) fileFormat = 'docx';
    if (fileName.toLowerCase().endsWith('.doc')) fileFormat = 'doc';

    const safeName = sanitizeFileName(fileName);
    const fileBuffer = fs.readFileSync(filePath);
    const base64String = fileBuffer.toString('base64');

    const lambdaUrl = process.env.AI_LAMBDA_URL;
    if (!lambdaUrl) {
        console.error("❌ Lỗi: Thiếu AI_LAMBDA_URL trong .env");
        return null;
    }

    try {
        console.log(`📡 Đang gửi file: "${safeName}" (${fileFormat}) sang AI...`);
        
        const response = await axios.post(lambdaUrl, {
            file_name: safeName,
            file_format: fileFormat,
            file_bytes_base64: base64String,
            language: "vi"
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 120000 // 2 phút
        });

        console.log("✅ AI Phản hồi thành công!");
        
        // Xử lý data trả về (Parse nếu là string)
        let finalData = response.data;
        if (typeof finalData === 'string') {
            try { finalData = JSON.parse(finalData); } 
            catch (e) { console.error("❌ Parse Error"); return null; }
        }
        
        // Kiểm tra cấu trúc lồng nhau
        if (!finalData.analysis && finalData.body) {
             return typeof finalData.body === 'string' ? JSON.parse(finalData.body) : finalData.body;
        }
        return finalData;

    } catch (error: any) {
        const detail = error.response?.data?.detail || error.message;
        console.error("❌ Lỗi gọi AI Lambda:", detail);
        return null; // Trả về null để hàm cha xử lý lỗi
    }
}

// ==================================================
// [HELPER] CRAWLER TIN TỨC
// ==================================================
const BACKUP_IMAGES = {
    law: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    economy: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    meeting: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
    default: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
};
const getSmartImage = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("kinh tế") || t.includes("ngân hàng")) return BACKUP_IMAGES.economy;
    if (t.includes("số") || t.includes("công nghệ")) return BACKUP_IMAGES.tech;
    if (t.includes("hội nghị") || t.includes("chỉ đạo")) return BACKUP_IMAGES.meeting;
    if (t.includes("luật")) return BACKUP_IMAGES.law;
    return BACKUP_IMAGES.default;
};
async function fetchArticleDetails(url: string) {
    try {
        const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 5000 });
        const $ = cheerio.load(data);
        const imgTag = $(".detail-content figure img").first();
        let image = imgTag.attr("data-original") || imgTag.attr("src") || "";
        const time = $(".detail-time").text().trim() || $(".article-header .meta").text().trim();
        if (image && !image.startsWith("http") && url.includes("baochinhphu")) image = "https://baochinhphu.vn" + image;
        return { image, time };
    } catch (e) { return { image: "", time: "" }; }
}
function parseNews($: any, sourceName: string, tagName: string) {
    const items: any[] = [];
    $(".box-stream-item, .av-item, .story").each((i: number, el: any) => {
        if (i > 5) return;
        const titleEl = $(el).find(".box-stream-link-title, h3 a, h2 a, .story__heading a").first();
        const title = titleEl.text().trim();
        let link = titleEl.attr("href");
        const desc = $(el).find(".box-stream-sapo, .summary, .story__summary").text().trim();
        const time = $(el).find(".box-stream-meta, .time, .story__meta").text().trim();
        const imgTag = $(el).find("img").first();
        let img = imgTag.attr("data-src") || imgTag.attr("data-original") || imgTag.attr("src") || "";
        if (link && !link.startsWith("http")) link = sourceName === "Báo Chính Phủ" ? "https://baochinhphu.vn" + link : "https://chinhphu.vn" + link;
        if (img && !img.startsWith("http") && !img.startsWith("data:")) img = sourceName === "Báo Chính Phủ" ? "https://baochinhphu.vn" + img : "https://chinhphu.vn" + img;
        if (!img || img.includes("base64")) img = getSmartImage(title);
        if (title && link) items.push({ id: `news-${tagName}-${i}`, title, link, desc: desc || "Tin tức mới.", source: sourceName, tag: tagName, date: time || "Vừa xong", image: img });
    });
    return items;
}

// ==================================================
// [API] AUTH & USER
// ==================================================

// Register (Đã cập nhật Phone, Dob, Provider)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone, dob } = req.body;

        // 1. Validation
        if (!email || !password) return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
        if (!isValidEmail(email)) return res.status(400).json({ message: "Email không hợp lệ" });
        if (password.length < 6) return res.status(400).json({ message: "Mật khẩu quá ngắn" });

        // 2. Check User
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            if (existingUser.provider === 'google') {
                return res.status(409).json({ message: "Email này đã liên kết Google." });
            }
            return res.status(409).json({ message: "Email đã tồn tại." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User & Subscription
        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: { 
                    email, 
                    passwordHash: hashedPassword, 
                    fullName: name || "Người dùng", 
                    phone: phone || null, 
                    dob: dob || null,
                    role: UserRole.USER,
                    provider: "credentials"
                }
            });
            await tx.subscription.create({
                data: {
                    userId: newUser.id,
                    planType: PlanType.FREE_TRIAL,
                    maxUploads: 5,
                    startDate: new Date(),
                    endDate: new Date(new Date().setDate(new Date().getDate() + 30))
                }
            });
            return newUser;
        });
        
        const { passwordHash: _, ...u } = result;
        res.status(201).json({ message: "Đăng ký thành công", user: u });

    } catch (e) { 
        console.error("Register Error:", e);
        res.status(500).json({ message: "Lỗi Server khi đăng ký" }); 
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } });
// Thêm !user.passwordHash vào để đảm bảo có mật khẩu mới đem đi so sánh
        if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: "Sai thông tin đăng nhập" });
    }
        const { passwordHash: _, ...u } = user;
        res.status(200).json({ message: "Success", user: u });
    } catch (e) { res.status(500).json({ message: "Lỗi Server" }); }
});

app.get('/api/auth/me', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: "Missing email" });
        const user = await prisma.user.findUnique({ where: { email: String(email) }, include: { subscription: true } });
        if (!user) return res.status(404).json({ message: "User not found" });
        const { passwordHash: _, ...u } = user;
        res.json({ user: u });
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});

// ==================================================
// [API] UPLOAD & AI PIPELINE
// ==================================================
app.post('/api/contract/upload', upload.single('file'), async (req: any, res: any) => {
    try {
        const file = req.file;
        const email = req.body.email;
        if (!file || !email) return res.status(400).json({ message: "Thiếu data" });

        const user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } });
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        // Quota Check
        if (user.subscription && user.subscription.currentUploads >= user.subscription.maxUploads) {
            return res.status(403).json({ message: "Hết lượt upload. Vui lòng nâng cấp!" });
        }

        // Create Contract
        const contract = await prisma.contract.create({
            data: {
                fileName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
                s3Key: file.path, fileSize: file.size, mimeType: file.mimetype, userId: user.id,
                status: ProcessingStatus.PENDING
            }
        });

        await prisma.subscription.update({ where: { userId: user.id }, data: { currentUploads: { increment: 1 } } });
        res.json({ message: "Đang xử lý...", contractId: contract.id });

        // BACKGROUND PROCESS
        (async () => {
            try {
                await prisma.contract.update({ where: { id: contract.id }, data: { status: ProcessingStatus.PROCESSING } });
                
                const aiResult = await callAILambda(file.path, file.originalname, file.mimetype);

                if (aiResult && aiResult.analysis) {
                    const ana = aiResult.analysis;
                    await prisma.$transaction(async (tx) => {
                        let dbRisk = 'LOW';
                        const r = ana.overall_risk_level?.toUpperCase();
                        if (r === 'HIGH' || r === 'CRITICAL') dbRisk = 'HIGH';
                        else if (r === 'MEDIUM') dbRisk = 'MEDIUM';

                        await tx.analysisReport.create({
                            data: {
                                contractId: contract.id,
                                summary: ana.summary || "N/A",
                                overallRisk: dbRisk as any,
                                fullJsonResult: ana,
                                modelUsed: aiResult.model
                            }
                        });
                        await tx.contract.update({ where: { id: contract.id }, data: { status: ProcessingStatus.COMPLETED } });
                        
                        const session = await tx.chatSession.create({ data: { userId: user.id, contractId: contract.id, title: "Phân tích AI" } });
                        const riskCount = ana.risk_items ? ana.risk_items.length : 0;
                        const introMsg = `✅ **Phân tích hoàn tất!**\n\n` +
                                         `📊 Đánh giá: **${ana.overall_risk_level}**\n` +
                                         `📝 Tóm tắt: ${ana.summary}\n\n` +
                                         `⚠️ Tìm thấy **${riskCount} vấn đề** tiềm ẩn.`;
                        await tx.message.create({
                            data: { sessionId: session.id, role: Sender.AI, content: introMsg }
                        });
                    });
                } else {
                    throw new Error("AI trả về dữ liệu rỗng/lỗi.");
                }
            } catch (err: any) {
                console.error("❌ AI Pipeline Error:", err);
                await prisma.contract.update({ 
                    where: { id: contract.id }, 
                    data: { status: ProcessingStatus.FAILED, errorMessage: "Lỗi kết nối AI" } 
                });
            }
        })();

    } catch (error) { res.status(500).json({ message: "Lỗi Upload" }); }
});

app.get('/api/contracts', async (req, res) => {
    try {
        const email = req.query.email as string;
        if (!email) return res.json({ data: [] });
        const contracts = await prisma.contract.findMany({
            where: { user: { email: email } },
            orderBy: { createdAt: 'desc' },
            include: { analysis: true }
        });
        const responseData = contracts.map(c => ({
            id: c.id, fileName: c.fileName, createdAt: c.createdAt,
            status: c.status, overallRisk: c.analysis?.overallRisk || "UNKNOWN"
        }));
        res.json({ data: responseData });
    } catch (error) { res.status(500).json({ message: "Lỗi server" }); }
});

app.delete('/api/contract/:id', async (req, res) => {
    try {
        await prisma.contract.delete({ where: { id: req.params.id } });
        res.json({ message: "Đã xóa" });
    } catch (error) { res.status(500).json({ message: "Lỗi xóa" }); }
});

// ==================================================
// [API] CHAT SYSTEM
// ==================================================
app.get('/api/chat/:contractId', async (req, res) => {
    try {
        const session = await prisma.chatSession.findFirst({
            where: { contractId: req.params.contractId },
            orderBy: { createdAt: 'desc' },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
        if (!session) return res.json({ data: [] });
        const formattedMessages = session.messages.map(m => ({
            id: m.id, role: m.role === Sender.USER ? 'user' : 'ai', content: m.content
        }));
        res.json({ data: formattedMessages });
    } catch (error) { res.status(500).json({ message: "Lỗi tải chat" }); }
});

app.post('/api/chat/send', async (req, res) => {
    try {
        const { contractId, message } = req.body;
        let session = await prisma.chatSession.findFirst({ where: { contractId }, orderBy: { createdAt: 'desc' } });
        
        if (!session) {
            const contract = await prisma.contract.findUnique({ where: { id: contractId } });
            if (!contract) return res.status(404).json({ message: "Contract not found" });
            session = await prisma.chatSession.create({ data: { userId: contract.userId, contractId, title: "Hội thoại mới" } });
        }

        await prisma.message.create({ data: { sessionId: session.id, role: Sender.USER, content: message } });
        
        setTimeout(async () => {
            let reply = "Hệ thống đang phân tích...";
            if (message.toLowerCase().includes("rủi ro")) reply = "⚠️ Dựa trên phân tích, rủi ro lớn nhất là điều khoản thanh toán.";
            await prisma.message.create({ data: { sessionId: session!.id, role: Sender.AI, content: reply } });
        }, 1000);

        res.json({ status: "processing" });
    } catch (error) { res.status(500).json({ message: "Lỗi chat" }); }
});

// NEWS API
app.get('/api/news', async (req, res) => {
    try {
        const pinnedLinks = [
            { link: "https://baochinhphu.vn/day-nhanh-tien-do-cac-du-an-truyen-tai-dien-tren-dia-ban-tinh-ca-mau-10225111210171423.htm", tag: "KINH TẾ", id: "pin-1", title: "Đẩy nhanh tiến độ dự án điện Cà Mau", desc: "Công tác giải phóng mặt bằng đang được gấp rút triển khai." },
            { link: "https://baochinhphu.vn/tang-cuong-phan-cap-cai-cach-thu-tuc-trong-quan-ly-tai-san-cong-tai-co-quan-dang-102251118153720248.htm", tag: "TIÊU ĐIỂM", id: "pin-2", title: "Cải cách thủ tục quản lý tài sản công", desc: "Bộ Tài chính đề xuất quy định mới nhằm tăng cường phân cấp." }
        ];
        const pinnedNews = await Promise.all(pinnedLinks.map(async (item) => {
            const details = await fetchArticleDetails(item.link);
            return { ...item, source: "Báo Chính Phủ", date: details.time || "Hôm nay", image: details.image || getSmartImage(item.title) };
        }));
        const promiseKinhTe = axios.get("https://baochinhphu.vn/kinh-te.htm").then(r => parseNews(cheerio.load(r.data), "Báo Chính Phủ", "KINH TẾ")).catch(() => []);
        const promiseChinhSach = axios.get("https://baochinhphu.vn/chinh-sach-moi.htm").then(r => parseNews(cheerio.load(r.data), "Báo Chính Phủ", "CHÍNH SÁCH")).catch(() => []);
        const [news1, news2] = await Promise.all([promiseKinhTe, promiseChinhSach]);
        const allCrawled = [...news1, ...news2].filter(item => !pinnedNews.some(pin => pin.link === item.link));
        res.json({ success: true, data: [...pinnedNews, ...allCrawled] });
    } catch (error) { res.status(500).json({ success: false, data: [] }); }
});

app.listen(PORT, () => console.log(`🚀 AI-Integrated Backend running on http://localhost:${PORT}`));