# MSVipCalculator

### 購買模式（二選一）
1. **點卡折數模式**：例如95折 → 0.95台幣 = 1樂豆點
2. **刷卡回饋模式**：例如5%回饋 → 1台幣 = 1.05樂豆點

### 兌換鏈條
```
樂豆點 → 楓點（1:1等值）
↓ 消費回饋（每花1樂豆點 → X點VIP點數）
VIP點數 → 楓點（300:1固定比率）
↓ 
楓點 → 楓幣（Y楓點 = 1億楓幣，可設定）
↓
市場價值（1台幣 = Z楓幣，可調整參數）
```

## 📁 專案結構

```
MSVipCalculator/
├── cmd/                  
│   ├── msvip-calculator/   
│   └── demo/              
├── pkg/                  
│   └── calculator/      
├── internal/           
├── docs/                 
│   ├── index.html
│   ├── styles.css
│   ├── calculator.js
│   └── _config.yml
├── .github/workflows/    
├── Makefile              
└── README.md
```

## 開發
- 使用claude code Vibe Coding，計算錯誤請開issue

### 安裝需求
- Go 1.21 或更高版本

### CLI 版本使用

```bash
git clone <repository-url>
cd MSVipCalculator

make deps

make run-cli

go run ./cmd/msvip-calculator

make run-demo

go run ./cmd/demo
```

### Web 版本使用

#### 線上版本
訪問：`https://chiao75543.github.io/MSVipCalculator/`
