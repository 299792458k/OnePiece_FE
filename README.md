## Treasure Hunt: bài toán tìm kho báu

## Tính năng

- Nhập thông số bài toán (n, m, p)
- Nhập ma trận kho báu với validation
- Hiển thị kết quả nhiên liệu tối thiểu
- Hiển thị lộ trình di chuyển
- Lưu trữ và xem lịch sử các bài toán đã giải

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Cấu trúc thư mục

```
src/
├── components/
│   ├── problemSolve/
│   │   ├── TreasureHuntForm.js    # Form nhập liệu chính
│   │   ├── MatrixInput.js         # Component nhập ma trận
│   │   └── ResultDisplay.js       # Hiển thị kết quả
│   ├── problemHistory/
│   │   └── HistoryList.js         # Danh sách lịch sử
│   └── problemDescription/
│       └── ProblemDescription.js  # Mô tả bài toán
├── services/
│   └── Api.js                     # API service
├── models/
│   └── HistoryModel.js            # Model cho dữ liệu lịch sử
├── utils/
│   └── Formatters.js              # Hàm format dữ liệu
├── enums/
│   └── TabIndex.js                # Enum cho các tab
├── App.js                         # Component chính
└── index.js                       # Entry point
```

## API Endpoints

- `POST /api/treasure-hunt/solve` - Giải bài toán
- `GET /api/treasure-hunt/history` - Lấy lịch sử
- `GET /api/treasure-hunt/:id` - Chi tiết bài toán
- `DELETE /api/treasure-hunt/:id` - Xóa bài toán

## Validation

- **n, m**: 1 ≤ n, m ≤ 500
- **p**: 1 ≤ p ≤ n × m
- **Ma trận**: Mỗi ô phải có giá trị từ 1 đến p
- **Rương kho báu**: Phải có ít nhất 1 ô có giá trị p

