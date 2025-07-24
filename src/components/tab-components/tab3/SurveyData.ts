export interface SurveyDataPoint {
    category: string;
    stronglyDisagree: number;
    disagree: number;
    neutral: number;
    agree: number;
    stronglyAgree: number;
}

export const surveyData: SurveyDataPoint[] = [
    {
        category: 'Work-Life Balance',
        stronglyDisagree: 5,
        disagree: 15,
        neutral: 20,
        agree: 35,
        stronglyAgree: 25
    },
    {
        category: 'Job Satisfaction',
        stronglyDisagree: 8,
        disagree: 12,
        neutral: 25,
        agree: 30,
        stronglyAgree: 25
    },
    {
        category: 'Team Collaboration',
        stronglyDisagree: 3,
        disagree: 7,
        neutral: 15,
        agree: 40,
        stronglyAgree: 35
    },
    {
        category: 'Management Support',
        stronglyDisagree: 12,
        disagree: 18,
        neutral: 30,
        agree: 25,
        stronglyAgree: 15
    },
    {
        category: 'Career Development',
        stronglyDisagree: 10,
        disagree: 20,
        neutral: 25,
        agree: 28,
        stronglyAgree: 17
    },
    {
        category: 'Compensation',
        stronglyDisagree: 15,
        disagree: 25,
        neutral: 20,
        agree: 25,
        stronglyAgree: 15
    }
];

export interface HierarchicalDataPoint {
    name: string;
    value?: number;
    children?: HierarchicalDataPoint[];
}

export const hierarchicalData: HierarchicalDataPoint = {
    name: "Total Sales",
    children: [
        {
            name: "North America",
            children: [
                {
                    name: "United States",
                    children: [
                        { name: "California", value: 2840000 },
                        { name: "Texas", value: 1950000 },
                        { name: "New York", value: 1680000 },
                        { name: "Florida", value: 1420000 }
                    ]
                },
                {
                    name: "Canada",
                    children: [
                        { name: "Ontario", value: 890000 },
                        { name: "Quebec", value: 650000 },
                        { name: "British Columbia", value: 520000 }
                    ]
                },
                {
                    name: "Mexico",
                    children: [
                        { name: "Mexico City", value: 480000 },
                        { name: "Guadalajara", value: 320000 }
                    ]
                }
            ]
        },
        {
            name: "Europe",
            children: [
                {
                    name: "Germany",
                    children: [
                        { name: "Berlin", value: 750000 },
                        { name: "Munich", value: 680000 },
                        { name: "Hamburg", value: 520000 }
                    ]
                },
                {
                    name: "United Kingdom",
                    children: [
                        { name: "London", value: 920000 },
                        { name: "Manchester", value: 380000 },
                        { name: "Birmingham", value: 290000 }
                    ]
                },
                {
                    name: "France",
                    children: [
                        { name: "Paris", value: 840000 },
                        { name: "Lyon", value: 420000 },
                        { name: "Marseille", value: 350000 }
                    ]
                }
            ]
        },
        {
            name: "Asia Pacific",
            children: [
                {
                    name: "Japan",
                    children: [
                        { name: "Tokyo", value: 1250000 },
                        { name: "Osaka", value: 680000 },
                        { name: "Nagoya", value: 420000 }
                    ]
                },
                {
                    name: "Australia",
                    children: [
                        { name: "Sydney", value: 580000 },
                        { name: "Melbourne", value: 520000 },
                        { name: "Brisbane", value: 320000 }
                    ]
                },
                {
                    name: "South Korea",
                    children: [
                        { name: "Seoul", value: 720000 },
                        { name: "Busan", value: 380000 }
                    ]
                }
            ]
        }
    ]
};

export interface StockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Generate more realistic stock data similar to Observable example
export const generateStockData = (): StockData[] => {
  const data: StockData[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-12-31');
  
  let currentPrice = 150; // Starting price similar to AAPL
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    
    // Generate realistic OHLC data with proper market behavior
    const volatility = 0.015 + Math.random() * 0.01; // 1.5-2.5% daily volatility
    const trend = Math.sin(i / 50) * 0.002; // Cyclical trend
    const randomWalk = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const priceChange = (trend + randomWalk) * currentPrice;
    const close = Math.max(1, open + priceChange);
    
    // Generate realistic intraday high/low
    const intradayRange = volatility * 0.6 * currentPrice;
    const maxPrice = Math.max(open, close);
    const minPrice = Math.min(open, close);
    
    const high = maxPrice + Math.random() * intradayRange;
    const low = Math.max(1, minPrice - Math.random() * intradayRange);
    
    data.push({
      date: new Date(date),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000 // 10M-60M volume
    });
    
    currentPrice = close;
  }
  
  return data;
};

export const stockData = generateStockData();