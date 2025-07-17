package calculator

import (
	"fmt"
	"math"
)

type PurchaseMode int

const (
	DiscountMode PurchaseMode = iota
	CashbackMode
)

const (
	MesoPerYi = 100000000 // 1億楓幣
	Epsilon   = 1e-9      // 浮點數比較精度
)

type Calculator struct {
	PurchaseMode     PurchaseMode
	DiscountRate     float64
	CashbackRate     float64
	VIPPointsPerBean float64
	VIPToMapleRate   float64
	MapleToMesoRate  float64
	MarketRate       float64
	MinPurchase      float64
	MaxPurchase      float64
}

type CalculationResult struct {
	InputTWD     float64
	BeanPoints   float64
	InitialMaple float64
	VIPPoints    float64
	BonusMaple   float64
	TotalMaple   float64
	TotalMeso    float64
	MarketValue  float64
	ProfitRate   float64
	Steps        []string
}

func NewCalculator() *Calculator {
	return &Calculator{
		PurchaseMode:     CashbackMode,
		DiscountRate:     0.95,
		CashbackRate:     0.05,
		VIPPointsPerBean: 40,
		VIPToMapleRate:   300,
		MapleToMesoRate:  7,
		MarketRate:       17,
		MinPurchase:      50,
		MaxPurchase:      1000000,
	}
}

func (c *Calculator) ValidateInput(amount float64) error {
	if amount <= 0 {
		return fmt.Errorf("購買金額必須大於0")
	}
	if amount < c.MinPurchase {
		return fmt.Errorf("最低購買金額為 %.0f 台幣", c.MinPurchase)
	}
	if amount > c.MaxPurchase {
		return fmt.Errorf("最大購買金額為 %.0f 台幣", c.MaxPurchase)
	}
	return nil
}

func (c *Calculator) validateRates() error {
	if c.DiscountRate <= 0 || c.DiscountRate > 1 {
		return fmt.Errorf("折扣率必須在 0 到 1 之間")
	}
	if c.CashbackRate < 0 {
		return fmt.Errorf("回饋率不能為負數")
	}
	if c.VIPPointsPerBean <= 0 {
		return fmt.Errorf("VIP點數獲得率必須大於0")
	}
	if math.Abs(c.VIPToMapleRate) < Epsilon {
		return fmt.Errorf("VIP兌換楓點率不能為0")
	}
	if math.Abs(c.MapleToMesoRate) < Epsilon {
		return fmt.Errorf("楓點兌換楓幣率不能為0")
	}
	if math.Abs(c.MarketRate) < Epsilon {
		return fmt.Errorf("市場匯率不能為0")
	}
	return nil
}

func (c *Calculator) Calculate(amountTWD float64) (*CalculationResult, error) {
	if err := c.ValidateInput(amountTWD); err != nil {
		return nil, err
	}

	if err := c.validateRates(); err != nil {
		return nil, err
	}

	result := &CalculationResult{
		InputTWD: amountTWD,
		Steps:    make([]string, 0),
	}

	switch c.PurchaseMode {
	case DiscountMode:
		actualCost := amountTWD
		faceValue := amountTWD / c.DiscountRate
		result.BeanPoints = faceValue
		result.Steps = append(result.Steps, fmt.Sprintf("💳 點卡模式 (%.0f折): %.0f元購買 → %.0f樂豆點 (面額%.0f元)", c.DiscountRate*100, actualCost, result.BeanPoints, faceValue))
	case CashbackMode:
		basePoints := amountTWD
		cashbackPoints := amountTWD * c.CashbackRate
		result.BeanPoints = basePoints + cashbackPoints
		result.Steps = append(result.Steps, fmt.Sprintf("💳 刷卡模式: %.0f元 + %.1f%%回饋(%.0f) = %.0f樂豆點", basePoints, c.CashbackRate*100, cashbackPoints, result.BeanPoints))
	default:
		return nil, fmt.Errorf("不支援的購買模式")
	}

	result.InitialMaple = result.BeanPoints
	result.Steps = append(result.Steps, fmt.Sprintf("🔄 樂豆點轉楓點 (1:1): %.2f樂豆點 → %.2f楓點", result.BeanPoints, result.InitialMaple))

	result.VIPPoints = result.BeanPoints * c.VIPPointsPerBean
	result.Steps = append(result.Steps, fmt.Sprintf("⭐ VIP點數獲得: %.2f樂豆點 × %.0f = %.0f VIP點數", result.BeanPoints, c.VIPPointsPerBean, result.VIPPoints))

	result.BonusMaple = result.VIPPoints / c.VIPToMapleRate
	result.Steps = append(result.Steps, fmt.Sprintf("🎁 VIP兌換楓點: %.0f VIP點數 ÷ %.0f = %.2f楓點", result.VIPPoints, c.VIPToMapleRate, result.BonusMaple))

	result.TotalMaple = result.InitialMaple + result.BonusMaple
	result.Steps = append(result.Steps, fmt.Sprintf("📊 總楓點: %.2f + %.2f = %.2f楓點", result.InitialMaple, result.BonusMaple, result.TotalMaple))

	result.TotalMeso = (result.TotalMaple / c.MapleToMesoRate) * MesoPerYi
	result.Steps = append(result.Steps, fmt.Sprintf("💰 楓幣計算: %.2f楓點 ÷ %.0f × 1億 = %s楓幣", result.TotalMaple, c.MapleToMesoRate, formatMeso(result.TotalMeso)))

	result.MarketValue = result.TotalMeso / (c.MarketRate * 10000000)
	result.Steps = append(result.Steps, fmt.Sprintf("🏪 市場價值: %s楓幣 ÷ %s = %.2f台幣", formatMeso(result.TotalMeso), formatMarketRate(c.MarketRate), result.MarketValue))

	if math.Abs(amountTWD) < Epsilon {
		result.ProfitRate = 0
		result.Steps = append(result.Steps, "⚠️ 投入金額過小，無法計算獲利率")
	} else {
		result.ProfitRate = ((result.MarketValue - amountTWD) / amountTWD) * 100
		profitEmoji := "📈"
		if result.ProfitRate < 0 {
			profitEmoji = "📉"
		} else if math.Abs(result.ProfitRate) < Epsilon {
			profitEmoji = "⚖️"
		}
		result.Steps = append(result.Steps, fmt.Sprintf("%s 獲利率: (%.0f - %.0f) ÷ %.0f × 100%% = %.2f%%", profitEmoji, result.MarketValue, amountTWD, amountTWD, result.ProfitRate))
	}

	return result, nil
}

func (c *Calculator) SetPurchaseMode(mode PurchaseMode) {
	c.PurchaseMode = mode
}

func (c *Calculator) SetDiscountRate(rate float64) {
	c.DiscountRate = rate
}

func (c *Calculator) SetCashbackRate(rate float64) {
	c.CashbackRate = rate
}

func (c *Calculator) SetVIPPointsPerBean(points float64) {
	c.VIPPointsPerBean = points
}

func (c *Calculator) SetMarketRate(rate float64) {
	c.MarketRate = rate
}

func (c *Calculator) SetMapleToMesoRate(rate float64) {
	c.MapleToMesoRate = rate
}

func (c *Calculator) SetMaxPurchase(amount float64) {
	c.MaxPurchase = amount
}

func (c *Calculator) SetMinPurchase(amount float64) {
	c.MinPurchase = amount
}

func (c *Calculator) SetVIPToMapleRate(rate float64) {
	c.VIPToMapleRate = rate
}

// formatMeso 格式化楓幣顯示 - 超過億顯示為億，否則顯示為千萬
func formatMeso(meso float64) string {
	if meso >= MesoPerYi {
		yi := meso / MesoPerYi
		return fmt.Sprintf("%.1f億", yi)
	}
	qianwan := meso / 10000000
	return fmt.Sprintf("%.1f千萬", qianwan)
}

// formatMarketRate 格式化市場匯率顯示
func formatMarketRate(rate float64) string {
	return fmt.Sprintf("%.1f千萬", rate)
}
