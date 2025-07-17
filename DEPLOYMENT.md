# 🚀 GitHub Pages 部署指南

## 📋 部署需求

此專案已配置為可部署到 GitHub Pages 靜態網站。包含以下檔案：

### 網站檔案
- `index.html` - 主頁面
- `styles.css` - 樣式檔案  
- `calculator.js` - JavaScript 計算邏輯
- `_config.yml` - GitHub Pages 配置

### 部署配置
- `.github/workflows/deploy.yml` - GitHub Actions 自動部署
- `.gitignore` - 排除不需要的檔案

## 🔧 部署步驟

### 1. 推送到 GitHub
```bash
git add .
git commit -m "Add web calculator for GitHub Pages"
git push origin main
```

### 2. 啟用 GitHub Pages
1. 前往 GitHub 儲存庫設定
2. 點選左側選單的 "Pages"
3. 在 "Source" 部分選擇 "GitHub Actions"
4. 儲存設定

### 3. 自動部署
- 每次推送到 `main` 分支會自動觸發部署
- 部署完成後可在 `https://你的用戶名.github.io/MSVipCalculator` 訪問

## 🎯 功能特色

### 響應式設計
- 支援桌面、平板、手機裝置
- 現代化的漸層背景和玻璃效果
- 優雅的動畫過渡效果

### 互動功能
- 即時參數調整
- 單次計算和批量分析
- 四種分析模式：
  - 購買模式比較
  - VIP獲得率分析  
  - 市場匯率敏感度
  - 投入金額效益

### 計算邏輯
- 完全移植 Go 版本的計算邏輯
- 輸入驗證和錯誤處理
- 詳細的計算步驟顯示

## 🛠️ 本地測試

在推送到 GitHub 前，可以本地測試：

```bash
# 方法1: 使用 Python 內建伺服器
python3 -m http.server 8000

# 方法2: 使用 Node.js 的 live-server
npx live-server

# 方法3: 使用 VS Code 的 Live Server 擴充功能
```

然後在瀏覽器開啟 `http://localhost:8000`

## 📱 使用說明

1. **選擇購買模式**：點卡折數 vs 刷卡回饋
2. **調整參數**：VIP獲得率、市場匯率等
3. **單次計算**：輸入金額獲得詳細分析
4. **批量分析**：點選不同分析標籤進行比較

## 🔄 更新部署

修改網站內容後：
```bash
git add .
git commit -m "Update calculator features"
git push origin main
```

GitHub Actions 會自動重新部署更新的內容。

## 🛡️ 注意事項

- 此計算器僅供分析參考，不構成投資建議
- 所有計算基於輸入參數，實際情況可能有所不同
- 請遵守 MapleStory 遊戲服務條款