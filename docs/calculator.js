class MapleStoryCalculator {
    constructor() {
        this.purchaseMode = 'cashback';
        this.discountRate = 0.95;
        this.cashbackRate = 0.05;
        this.vipPointsPerBean = 40;
        this.vipToMapleRate = 300;
        this.mapleToMesoRate = 7;
        this.marketRate = 17000000;
        this.minPurchase = 50;
        this.maxPurchase = 1000000;
        this.MESO_PER_YI = 100000000;
        this.EPSILON = 1e-9;
    }

    validateInput(amount) {
        if (amount <= 0) {
            throw new Error('購買金額必須大於0');
        }
        if (amount < this.minPurchase) {
            throw new Error(`最低購買金額為 ${this.minPurchase} 台幣`);
        }
        if (amount > this.maxPurchase) {
            throw new Error(`最大購買金額為 ${this.maxPurchase} 台幣`);
        }
    }

    validateRates() {
        if (this.discountRate <= 0 || this.discountRate > 1) {
            throw new Error('折扣率必須在 0 到 1 之間');
        }
        if (this.cashbackRate < 0) {
            throw new Error('回饋率不能為負數');
        }
        if (this.vipPointsPerBean <= 0) {
            throw new Error('VIP點數獲得率必須大於0');
        }
        if (Math.abs(this.vipToMapleRate) < this.EPSILON) {
            throw new Error('VIP兌換楓點率不能為0');
        }
        if (Math.abs(this.mapleToMesoRate) < this.EPSILON) {
            throw new Error('楓點兌換楓幣率不能為0');
        }
        if (Math.abs(this.marketRate) < this.EPSILON) {
            throw new Error('市場匯率不能為0');
        }
    }

    calculate(amountTWD) {
        this.validateInput(amountTWD);
        this.validateRates();

        const result = {
            inputTWD: amountTWD,
            steps: []
        };

        // 計算樂豆點
        if (this.purchaseMode === 'discount') {
            const actualCost = amountTWD;
            const faceValue = amountTWD / this.discountRate;
            result.beanPoints = faceValue;
            result.steps.push(`💳 點卡模式 (${(this.discountRate * 100).toFixed(0)}折): ${actualCost.toFixed(2)}台幣購買 → ${result.beanPoints.toFixed(2)}樂豆點 (面額${faceValue.toFixed(2)})`);
        } else {
            const basePoints = amountTWD;
            const cashbackPoints = amountTWD * this.cashbackRate;
            result.beanPoints = basePoints + cashbackPoints;
            result.steps.push(`💳 刷卡模式: ${basePoints.toFixed(2)}台幣 + ${(this.cashbackRate * 100).toFixed(1)}%回饋(${cashbackPoints.toFixed(2)}) = ${result.beanPoints.toFixed(2)}樂豆點`);
        }

        // 樂豆點轉楓點 (1:1)
        result.initialMaple = result.beanPoints;
        result.steps.push(`樂豆點轉楓點 (1:1): ${result.beanPoints.toFixed(2)}樂豆點 → ${result.initialMaple.toFixed(2)}楓點`);

        // VIP點數獲得
        result.vipPoints = result.beanPoints * this.vipPointsPerBean;
        result.steps.push(`VIP點數獲得: ${result.beanPoints.toFixed(2)}樂豆點 × ${this.vipPointsPerBean.toFixed(0)} = ${result.vipPoints.toFixed(0)} VIP點數`);

        // VIP兌換楓點
        result.bonusMaple = result.vipPoints / this.vipToMapleRate;
        result.steps.push(`VIP兌換楓點: ${result.vipPoints.toFixed(0)} VIP點數 ÷ ${this.vipToMapleRate.toFixed(0)} = ${result.bonusMaple.toFixed(2)}楓點`);

        // 總楓點
        result.totalMaple = result.initialMaple + result.bonusMaple;
        result.steps.push(`總楓點: ${result.initialMaple.toFixed(2)} + ${result.bonusMaple.toFixed(2)} = ${result.totalMaple.toFixed(2)}楓點`);

        // 楓幣計算
        result.totalMeso = (result.totalMaple / this.mapleToMesoRate) * this.MESO_PER_YI;
        result.steps.push(`楓幣計算: ${result.totalMaple.toFixed(2)}楓點 ÷ ${this.mapleToMesoRate.toFixed(0)} × ${this.MESO_PER_YI.toFixed(0)} = ${result.totalMeso.toFixed(0)}楓幣`);

        // 市場價值計算
        result.marketValue = result.totalMeso / this.marketRate;
        result.steps.push(`市場價值: ${result.totalMeso.toFixed(0)}楓幣 ÷ ${this.marketRate.toFixed(0)} = ${result.marketValue.toFixed(2)}台幣`);

        // 獲利率計算
        if (Math.abs(amountTWD) < this.EPSILON) {
            result.profitRate = 0;
            result.steps.push('⚠️ 投入金額過小，無法計算獲利率');
        } else {
            result.profitRate = ((result.marketValue - amountTWD) / amountTWD) * 100;
            let profitEmoji = '📈';
            if (result.profitRate < 0) {
                profitEmoji = '📉';
            } else if (Math.abs(result.profitRate) < this.EPSILON) {
                profitEmoji = '⚖️';
            }
            result.steps.push(`${profitEmoji} 獲利率: (${result.marketValue.toFixed(2)} - ${amountTWD.toFixed(2)}) ÷ ${amountTWD.toFixed(2)} × 100% = ${result.profitRate.toFixed(2)}%`);
        }

        return result;
    }
    updateParameters() {
        this.purchaseMode = document.querySelector('input[name="purchaseMode"]:checked').value;
        this.cashbackRate = parseFloat(document.getElementById('cashbackRate').value) / 100;
        this.discountRate = parseFloat(document.getElementById('discountRate').value) / 100;
        this.vipPointsPerBean = parseFloat(document.getElementById('vipPointsPerBean').value);
        this.vipToMapleRate = parseFloat(document.getElementById('vipToMapleRate').value);
        this.mapleToMesoRate = parseFloat(document.getElementById('mapleToMesoRate').value);
        this.marketRate = parseFloat(document.getElementById('marketRate').value) * 10000000;
    }
}

// 全域計算器實例
const calculator = new MapleStoryCalculator();

// DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateParameterDisplay();
});

function initializeEventListeners() {
    // 計算表單提交事件
    document.querySelector('.calculator-form').addEventListener('submit', function(e) {
        e.preventDefault();
        performCalculation();
    });

    // 計算按鈕
    document.getElementById('calculateBtn').addEventListener('click', function(e) {
        e.preventDefault();
        performCalculation();
    });

    // 重置參數按鈕
    document.getElementById('resetParams').addEventListener('click', function(e) {
        e.preventDefault();
        resetParameters();
    });

    // 參數變更監聽
    const parameterInputs = ['cashbackRate', 'discountRate', 'vipPointsPerBean', 'vipToMapleRate', 'mapleToMesoRate', 'marketRate'];
    parameterInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateParameterDisplay);
    });

    // 購買模式變更監聽
    document.querySelectorAll('input[name="purchaseMode"]').forEach(radio => {
        radio.addEventListener('change', updateParameterDisplay);
    });

    // Tab 切換
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });

    // Enter 鍵觸發計算
    document.getElementById('investmentAmount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performCalculation();
        }
    });
}

function updateParameterDisplay() {
    const cashbackRate = document.getElementById('cashbackRate').value;
    const discountRate = document.getElementById('discountRate').value;
    const vipPointsPerBean = document.getElementById('vipPointsPerBean').value;
    const vipToMapleRate = document.getElementById('vipToMapleRate').value;
    const mapleToMesoRate = document.getElementById('mapleToMesoRate').value;
    const marketRate = document.getElementById('marketRate').value;
    const purchaseMode = document.querySelector('input[name="purchaseMode"]:checked').value;

    // 更新標籤顯示當前值
    document.getElementById('cashbackRate-label').textContent = `刷卡回饋率 (${cashbackRate}%)`;
    document.getElementById('discountRate-label').textContent = `點卡折數 (${discountRate}%)`;
    document.getElementById('vipPointsPerBean-label').textContent = `VIP點數獲得率 (${vipPointsPerBean}點/樂豆點)`;
    document.getElementById('vipToMapleRate-label').textContent = `VIP兌換楓點 (${vipToMapleRate}:1)`;
    document.getElementById('mapleToMesoRate-label').textContent = `楓點兌換楓幣 (1:${mapleToMesoRate}億楓幣)`;
    document.getElementById('marketRate-label').textContent = `市場匯率 (1台幣=${marketRate}千萬楓幣)`;

    // 更新模式描述
    const modeOptions = document.querySelectorAll('.mode-option .mode-desc');
    modeOptions[0].textContent = `1台幣 = ${(1 + cashbackRate/100).toFixed(2)}樂豆點 (${cashbackRate}%回饋)`;
    modeOptions[1].textContent = `${(discountRate/100).toFixed(2)}台幣 = 1樂豆點 (${discountRate}折)`;
}

function resetParameters() {
    // 重置為預設值
    document.getElementById('cashbackRate').value = 5;
    document.getElementById('discountRate').value = 95;
    document.getElementById('vipPointsPerBean').value = 40;
    document.getElementById('vipToMapleRate').value = 300;
    document.getElementById('mapleToMesoRate').value = 7;
    document.getElementById('marketRate').value = 1.7;
    document.querySelector('input[name="purchaseMode"][value="cashback"]').checked = true;

    // 更新顯示
    updateParameterDisplay();
    
    // 隱藏計算結果
    document.getElementById('calculationResult').style.display = 'none';
}

function performCalculation() {
    try {
        calculator.updateParameters();
        const amount = parseFloat(document.getElementById('investmentAmount').value);
        
        if (isNaN(amount)) {
            throw new Error('請輸入有效的投入金額');
        }

        const result = calculator.calculate(amount);
        displayCalculationResult(result);
    } catch (error) {
        displayError(error.message);
    }
}

function displayCalculationResult(result) {
    const resultSection = document.getElementById('calculationResult');
    const stepsContainer = document.getElementById('calculationSteps');
    const summaryContainer = document.getElementById('profitSummary');

    // 顯示計算步驟
    stepsContainer.innerHTML = result.steps.map(step => `<div class="calculation-step">${step}</div>`).join('');

    // 顯示獲利摘要
    const profitClass = result.profitRate > 0 ? 'profit-positive' : result.profitRate < 0 ? 'profit-negative' : 'profit-neutral';
    summaryContainer.innerHTML = `
        <div class="profit-rate ${profitClass}">
            <span class="profit-label">最終獲利率</span>
            <span class="profit-value">${result.profitRate.toFixed(2)}%</span>
        </div>
        <div class="profit-details">
            <div class="detail-item">
                <span class="detail-label">投入金額</span>
                <span class="detail-value">${result.inputTWD.toFixed(0)} 台幣</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">市場價值</span>
                <span class="detail-value">${result.marketValue.toFixed(2)} 台幣</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">總楓點</span>
                <span class="detail-value">${result.totalMaple.toFixed(2)} 點</span>
            </div>
        </div>
    `;

    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayError(message) {
    const resultSection = document.getElementById('calculationResult');
    const stepsContainer = document.getElementById('calculationSteps');
    const summaryContainer = document.getElementById('profitSummary');

    stepsContainer.innerHTML = `<div class="error-message">❌ 錯誤: ${message}</div>`;
    summaryContainer.innerHTML = '';
    
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function switchTab(tabId) {
    // 移除所有活動狀態
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // 添加活動狀態
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}