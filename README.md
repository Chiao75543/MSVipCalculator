# MSVipCalculator

🍁 楓之谷樂豆點回饋幣值計算機 - 分析投資樂豆點的獲利潛力

## 💡 功能特色

### 儲值方式（三選一）
1. **讀卡機模式**：固定5%回饋 → 1台幣 = 1.05樂豆點
2. **點卡折數模式**：例如95折 → 0.95台幣 = 1樂豆點  
3. **原價模式**：1台幣 = 1樂豆點（無折扣）

### 兌換鏈條
```
台幣 → 樂豆點（依儲值方式）
↓ 1:1等值轉換
樂豆點 → 楓點
↓ 消費回饋（每花1樂豆點 → VIP點數）
VIP點數 → 楓點（300:1固定比率）
↓ 
楓點 → 楓幣（可調整兌換率）
↓
市場價值（依當前楓幣市價計算）
```

## 📁 專案結構

```
MSVipCalculator/
├── cmd/                  # 命令行工具
│   ├── msvip-calculator/ # 主程式
│   └── demo/            # 示例程式
├── pkg/                 # 核心邏輯
│   └── calculator/      # 計算器套件
├── docs/                # Web 前端
│   ├── index.html      # 主頁面
│   ├── styles.css      # 樣式表
│   ├── calculator.js   # 前端邏輯
│   └── _config.yml     # GitHub Pages 配置
├── .github/workflows/   # CI/CD 配置
├── Makefile            # 建構腳本
└── README.md
```

## 🚀 快速開始

### 安裝需求
- Go 1.21 或更高版本

### CLI 版本使用

```bash
# 克隆專案
git clone <repository-url>
cd MSVipCalculator

# 安裝依賴
make deps

# 運行 CLI 版本
make run-cli
# 或
go run ./cmd/msvip-calculator

# 運行示例
make run-demo
# 或
go run ./cmd/demo
```

### Web 版本使用
