'use client';
import {DonutChart, List, ListItem} from '@tremor/react';
import {userSettings} from "@/utils/user_settings";

const currencyFormatter = (number: number) => {
	return userSettings.currency + number.toFixed(2);
};

type DataTypeProps = {
	amount: number;
	type: string;
}

type StatisticsTypeProps = {
	dataType: DataTypeProps[];
};

function styleColor(color: string) {
	return {className: `bg-${color} h-3 w-3 shrink-0 rounded-sm`};
}

export default function StatisticsPayment({dataType}: StatisticsTypeProps) {
	const colors = ['violet-400', 'cyan-300', 'fuchsia-300', 'emerald-400', 'zinc-300']
	const totalAmount = dataType.reduce((sum, current) => sum + current.amount, 0);
	const monthlyIncome = userSettings.income / 12;
	const textColor = (totalAmount > monthlyIncome) ? "#ff0000bb" : "inherit"
	const percentages = [userSettings.essentials, userSettings.debt, userSettings.discretionary];
	let data = dataType.map((item, index) => ({
		amount: item.amount,
		name: item.type,
		color: colors[index],
		share: (item.amount / monthlyIncome) * 100,
	}));
	if (totalAmount < monthlyIncome) {
		const savingPercentage = userSettings.savings / 100;
		if (totalAmount < monthlyIncome * savingPercentage) {
			const savingAmount = monthlyIncome * savingPercentage;
			data.push({amount: savingAmount, name: "Savings", color: colors[3], share: savingPercentage * 100});
			data.push({
				amount: monthlyIncome - savingAmount - totalAmount, name: "Not Spent", color: colors[4],
				share: ((monthlyIncome - savingAmount - totalAmount) / monthlyIncome) * 100
			})
		} else {
			data.push({
				amount: monthlyIncome - totalAmount, name: "Savings", color: colors[3],
				share: ((monthlyIncome - totalAmount) / monthlyIncome) * 100
			});
		}
	} else {
		data.push({amount: 0, name: "Savings", color: colors[3], share: 0})
	}

	return (
		<div className="flex w-full h-full flex-col">
			<span className="flex justify-center text-xl font-semibold">
					Total expenses by type
			</span>
			<div className="w-full h-full flex items-center">
				<div className="flex w-2/3 h-full items-center">
					<style> {`
                    	.fill-tremor-content-emphasis {
                        	fill: ${textColor};
                    	}
                    `}</style>
					<DonutChart
						className="h-3/4 text-2xl"
						data={data}
						category="amount"
						index="name"
						valueFormatter={currencyFormatter}
						showTooltip={true}
						colors={colors}
					/>
				</div>
				<div className="w-2/4">
					<p className="mt-8 flex items-center justify-between">
						<span className="text-lg font-medium">Type</span>
						<span className="text-lg font-medium">Amount / Share</span>
					</p>
					<List className="mt-2">
						{data.map((item, index) => {
							if (index === 4 || (index === 3 && item.share === userSettings.savings)
								|| item.share <= percentages[index]) {
								return (
									<ListItem key={item.name} className="space-x-6">
										<div className="flex items-center space-x-2.5 truncate">
											<span {...styleColor(item.color)} aria-hidden="true"/>
											<span className="truncate text-lg">{item.name}</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-lg font-medium pr-1">
												{currencyFormatter(item.amount)}
											</span>
											<span className="w-14 flex justify-center rounded-tremor-small
											bg-tremor-background-subtle px-1.5 py-0.5">
												{(item.share).toFixed(2)}%
											</span>
										</div>
									</ListItem>
								);
							} else {
								return (
									<ListItem key={item.name} className="space-x-6">
										<div className="flex items-center space-x-2.5 truncate">
											<span {...styleColor(item.color)} aria-hidden="true"/>
											<span className="truncate text-lg text-red-600">{item.name}</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-lg font-medium pr-1 text-red-600">
												{currencyFormatter(item.amount)}
											</span>
											<span className="w-14 flex justify-center rounded-tremor-small
											bg-tremor-background-subtle px-1.5 py-0.5 text-red-600">
												{(item.share).toFixed(2)}%
											</span>
										</div>
									</ListItem>
								);
							}
						})}
					</List>
				</div>
			</div>
		</div>
	);
}