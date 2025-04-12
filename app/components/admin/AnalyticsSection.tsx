import { View, Text, useWindowDimensions, ScrollView } from "react-native"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import styles from "../../styles/AdminDashboard.style"
import { useState, useEffect } from "react"

interface AnalyticsSectionProps {
  userGrowthData: any
  departmentDistributionData: any
  systemUsageData: any
}

export default function AnalyticsSection({
  userGrowthData,
  departmentDistributionData,
  systemUsageData,
}: AnalyticsSectionProps) {
  const [isClient, setIsClient] = useState(false)
  const { width } = useWindowDimensions()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null // 🧠 Avoid SSR crash

  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const isDesktop = width >= 1024

  const getChartWidth = () => {
    if (isDesktop) return (width - 240 - 64) / 3 - 16
    else if (isTablet) return (width - 64) / 2 - 8
    else return width - 40
  }

  const chartWidth = getChartWidth()

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Analytics</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* LineChart */}
          <ScrollView horizontal>
            <View>
              <Text style={styles.chartTitle}>User Growth</Text>
              <LineChart
                data={userGrowthData}
                width={chartWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "6", strokeWidth: "2", stroke: "#4169E1" },
                }}
                style={styles.chart}
              />
            </View>
          </ScrollView>

          {/* PieChart */}
          <ScrollView horizontal>
            <View>
              <Text style={styles.chartTitle}>Department Distribution</Text>
              <PieChart
                data={departmentDistributionData}
                width={chartWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </ScrollView>

          {/* BarChart */}
          <ScrollView horizontal>
            <View>
              <Text style={styles.chartTitle}>System Usage (Last Week)</Text>
              <BarChart
                data={systemUsageData}
                width={chartWidth}
                height={220}
                yAxisSuffix=" hrs"
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(64, 191, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                  barPercentage: 0.7,
                }}
                style={styles.chart}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}
