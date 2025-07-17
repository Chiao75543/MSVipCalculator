package main

import (
	"fmt"

	"github.com/MSVipCalculator/pkg/calculator"
)

func main() {
	fmt.Println("🎮 MapleStory 獲利率計算器 - 功能演示")
	fmt.Println("═══════════════════════════════════════════════════════════════")

	calc := calculator.NewCalculator()

	fmt.Println("\n💰 單次計算範例 (預設：5%回饋模式)")
	fmt.Println("─────────────────────────────────────────────────────────────")

	result, _ := calc.Calculate(1000)
	fmt.Printf("📊 投入金額: %.0f台幣\n", result.InputTWD)
	for _, step := range result.Steps {
		fmt.Println(step)
	}

	fmt.Println("\n💰 另一個計算範例 (1000台幣)")
	fmt.Println("─────────────────────────────────────────────────────────────")

	result2, _ := calc.Calculate(1000)
	fmt.Printf("📊 投入金額: %.0f台幣\n", result2.InputTWD)
	fmt.Printf("💰 總獲利率: %.2f%%\n", result2.ProfitRate)
	fmt.Printf("💵 市場價值: %.0f台幣\n", result2.MarketValue)

	fmt.Println("🎉 演示完成！使用以下指令啟動完整互動介面：")
	fmt.Println("go run ./cmd/msvip-calculator")
}
