export const incomeLevels = [
    {
        label: "Low",
        individualOrHouseHoldMax: [25000, 40000],
        budget: {
            essentials: {range_min: 60, range_max: 70},
            debtRepayment: {range_min: 10, range_max: 10},
            discretionarySpending: {range_min: 5, range_max: 20},
            savings: {range_min: 10, range_max: 15},
        }
    },
    {
        label: "Middle",
        individualOrHouseHoldMax: [75000, 125000],
        budget: {
            essentials: {range_min: 50, range_max: 60},
            debtRepayment: {range_min: 10, range_max: 20},
            discretionarySpending: {range_min: 10, range_max: 20},
            savings: {range_min: 20, range_max: 30},
        }
    },
    {
        label: "High",
        individualOrHouseHoldMax: [200000, 250000],
        budget: {
            essentials: {range_min: 40, range_max: 50},
            debtRepayment: {range_min: 5, range_max: 10},
            discretionarySpending: {range_min: 10, range_max: 15},
            savings: {range_min: 30, range_max: 40},
        }
    },
    {
        label: "DAMN",
        individualOrHouseHoldMax: [999999999999, 999999999999],
        budget: {
            essentials: {range_min: 30, range_max: 40},
            debtRepayment: {range_min: 0, range_max: 10},
            discretionarySpending: {range_min: 10, range_max: 30},
            savings: {range_min: 40, range_max: 50},
        }
    }
];

export const currencySymbols = ["€", "$", "£"];
