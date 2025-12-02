import uvicorn
import json
import os
import sys
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- 1. LOAD BIẾN MÔI TRƯỜNG (AWS KEY) ---
# Tự động đọc file .env trong cùng thư mục để lấy AWS_ACCESS_KEY_ID, v.v.
load_dotenv()

# Kiểm tra xem đã có Key chưa (Cảnh báo nếu thiếu)
if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("AWS_SECRET_ACCESS_KEY"):
    print("⚠️  CẢNH BÁO: Chưa tìm thấy AWS Key trong file .env hoặc biến môi trường!")
    print("   Code có thể sẽ lỗi khi gọi Bedrock.")

# --- 2. IMPORT LOGIC CỦA TEAM AI ---
# Thêm thư mục hiện tại vào sys.path để Python tìm thấy file lambda_function.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    # Import hàm chính từ file mà Leader gửi (lambda_function.py)
    from lambda_function import lambda_handler
    print("✅ Đã load thành công file lambda_function.py")
except ImportError as e:
    print("❌ LỖI NGHIÊM TRỌNG: Không tìm thấy file 'lambda_function.py'.")
    print(f"   Chi tiết: {e}")
    print("👉 Hãy chắc chắn bạn đã copy file của team AI vào thư mục 'ai_service'.")
    sys.exit(1)

# --- 3. KHỞI TẠO SERVER FASTAPI ---
app = FastAPI(title="AI Local Service Wrapper")

# Cấu hình CORS (Cho phép mọi nguồn gọi vào - Dễ test local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "AI Service is Running 🚀", "aws_region": os.getenv("AWS_DEFAULT_REGION", "Unknown")}

# --- 4. API ENDPOINT (GIỐNG HỆT AWS GATEWAY) ---
@app.post("/contracts/analyze")
async def proxy_to_lambda(request: Request):
    """
    Hàm này nhận JSON từ Node.js Backend,
    đóng gói lại thành 'AWS Event',
    gửi cho code của Leader xử lý,
    rồi trả kết quả về.
    """
    try:
        # A. Nhận dữ liệu từ Node.js
        body_data = await request.json()
        
        print(f"📥 Đang xử lý file: {body_data.get('file_name', 'Unknown File')}")

        # B. Giả lập 'Event' của AWS Lambda
        # Code của Leader thường mong đợi: event['body'] là chuỗi JSON
        fake_event = {
            "body": json.dumps(body_data), 
            "isBase64Encoded": False,
            "requestContext": {
                "http": {
                    "method": "POST"
                }
            }
        }
        
        # Giả lập Context (thường để trống ở local)
        fake_context = {}

        # C. GỌI HÀM CỦA LEADER (Chạy logic AI thật)
        # Lúc này code python sẽ dùng boto3 kết nối lên AWS Bedrock
        response = lambda_handler(fake_event, fake_context)

        # D. Xử lý kết quả trả về
        # Lambda trả về dict: {'statusCode': 200, 'body': '...string json...', ...}
        status_code = response.get("statusCode", 500)
        response_body = response.get("body", "{}")

        if status_code == 200:
            # Parse chuỗi JSON trong body thành Object để trả về cho Node.js
            return json.loads(response_body)
        else:
            # Nếu AI trả lỗi (400, 500...)
            print(f"❌ AI Error: {response_body}")
            raise HTTPException(status_code=status_code, detail=response_body)

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        print(f"❌ Lỗi Local Server Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --- 5. CHẠY SERVER (PORT 8000) ---
if __name__ == "__main__":
    print("\n==================================================")
    print("🤖 AI LOCAL SERVER ĐANG KHỞI ĐỘNG...")
    print("👉 URL kết nối: http://localhost:8000/contracts/analyze")
    print("👉 Bấm Ctrl + C để dừng server")
    print("==================================================\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)