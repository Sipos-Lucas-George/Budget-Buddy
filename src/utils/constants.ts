import {EnumType, EnumPayment, EnumCategory} from "@prisma/client";

export const PAYMENT = Object.keys(EnumPayment);
export const TYPE = Object.keys(EnumType);
export const CATEGORY = Object.keys(EnumCategory).map(value => {
    if (value.replace(/[^A-Z]/g, "").length >= 2) {
        if (value === "GiftsDonations")
            return "Gifts/Donations";
        return value.replace(/([A-Z])/g, " $1").trim();
    } else {
        return value;
    }
});

export type CATEGORY_TYPE = "Personal Spending" | "Family Expenses" | "Food" | "Entertainment" | "Transportation"
    | "Housing" | "Utilities" | "Healthcare" | "Insurance" | "Education" | "Investments" | "Debt Payments" | "Travel"
    | "Gifts/Donations" | "Miscellaneous" | "Other";

export const CATEGORY_MAP: { [key: string]: string } = {
    "Personal Spending": "PersonalSpending",
    "Family Expenses": "FamilyExpenses",
    "Gifts/Donations": "GiftsDonations",
    "Debt Payments": "DebtPayments",
    "PersonalSpending": "Personal Spending",
    "FamilyExpenses": "Family Expenses",
    "GiftsDonations": "Gifts/Donations",
    "DebtPayments": "Debt Payments",
}