'use client';
import {DonutChart, List, ListItem} from '@tremor/react';
import {userSettings} from "@/utils/user_settings";

const currencyFormatter = (number: number) => {
	return userSettings.currency + number.toFixed(2);
};

type DataCategoryProps = {
	amount: number;
	category: string;
}

type StatisticsCategoryProps = {
	dataCategory: DataCategoryProps[];
};

function styleColor(color: string) {
	return {className: `bg-${color} h-3 w-3 shrink-0 rounded-sm`};
}

export default function StatisticsCategory({dataCategory}: StatisticsCategoryProps) {
	const colors = ["indigo-300", "blue-400", "cyan-400", "sky-300", "teal-300", "green-400", "emerald-500",
		"lime-400", "yellow-300", "orange-300", "rose-400", "pink-300", "fuchsia-300", "violet-400", "zinc-300", "stone-100"];
	const totalAmount = dataCategory.reduce((sum, current) => sum + current.amount, 0);
	let data = dataCategory.map((item, index) => ({
		amount: item.amount,
		name: item.category,
		color: colors[index],
		share: (item.amount !== 0) ? `${((item.amount / totalAmount) * 100).toFixed(2)}%` : "0.00%",
	}));

	return (
		<div className="flex w-full h-full flex-col">
			<span className="flex justify-center text-xl font-semibold">
					Total expenses by category
			</span>
			<div className="w-full h-full flex items-center">
				<div className="flex w-2/3 h-full items-center">
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
					<p className="mt-3 flex items-center justify-between">
						<span className="text-lg font-medium">Category</span>
						<span className="text-lg font-medium">Amount / Share</span>
					</p>
					<List>
						{data.map((item) => (
							<ListItem key={item.name} className="space-x-6 pt-1.5 pb-1">
								<div className="flex items-center space-x-2.5 truncate">
                                <span
									{...styleColor(item.color)}
									aria-hidden={true}
								/>
									<span className="truncate text-lg">{item.name}</span>
								</div>
								<div className="flex items-center space-x-2">
									<span className="text-lg font-medium pr-1">{currencyFormatter(item.amount)}</span>
									<span className="w-14 flex justify-center rounded-tremor-small
									bg-tremor-background-subtle px-1.5 py-0.5">
										{item.share}
									</span>
								</div>
							</ListItem>
						))}
					</List>
				</div>
			</div>
		</div>
	);
}