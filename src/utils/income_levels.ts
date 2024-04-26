export const incomeLevels = [
    {
        label: "Low",
        individualOrHouseHoldMax: [25000, 40000],
        budget: {
            essentialsRange: {range_min: 60, range_max: 70},
            debtRepaymentRange: {range_min: 10, range_max: 15},
            discretionarySpendingRange: {range_min: 5, range_max: 20},
            savingsRange: {range_min: 10, range_max: 15},
        }
    },
    {
        label: "Middle",
        individualOrHouseHoldMax: [75000, 125000],
        budget: {
            essentialsRange: {range_min: 50, range_max: 60},
            debtRepaymentRange: {range_min: 10, range_max: 20},
            discretionarySpendingRange: {range_min: 10, range_max: 20},
            savingsRange: {range_min: 20, range_max: 30},
        }
    },
    {
        label: "High",
        individualOrHouseHoldMax: [200000, 250000],
        budget: {
            essentialsRange: {range_min: 40, range_max: 50},
            debtRepaymentRange: {range_min: 5, range_max: 10},
            discretionarySpendingRange: {range_min: 10, range_max: 15},
            savingsRange: {range_min: 30, range_max: 40},
        }
    },
    {
        label: "DAMN",
        individualOrHouseHoldMax: [999999999999, 999999999999],
        budget: {
            essentialsRange: {range_min: 30, range_max: 40},
            debtRepaymentRange: {range_min: 0, range_max: 10},
            discretionarySpendingRange: {range_min: 10, range_max: 30},
            savingsRange: {range_min: 40, range_max: 50},
        }
    }
];