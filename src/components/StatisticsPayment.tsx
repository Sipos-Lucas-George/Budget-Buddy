'use client';
import {DonutChart, List, ListItem} from '@tremor/react';
import {userSettings} from "@/utils/user_settings";

const currencyFormatter = (number: number) => {
	return userSettings.currency + number.toFixed(2);
};

type DataPaymentProps = {
	amount: number;
	payment: string;
}

type StatisticsPaymentProps = {
	dataPayment: DataPaymentProps[];
};

function styleColor(color: string) {
	return {className: `bg-${color} h-3 w-3 shrink-0 rounded-sm`};
}

export default function StatisticsPayment({dataPayment}: StatisticsPaymentProps) {
	const colors = ["green-400", "indigo-300"];
	const totalAmount = dataPayment.reduce((sum, current) => sum + current.amount, 0);
	let data = dataPayment.map((item, index) => ({
		amount: item.amount,
		name: item.payment,
		color: colors[index],
		share: (item.amount !== 0) ? `${((item.amount / totalAmount) * 100).toFixed(2)}%` : "0.00%",
	}));

	return (
		<div className="flex w-full h-full flex-col">
			<span className="flex justify-center text-xl font-semibold">
					Total expenses by payment
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
					<p className="mt-8 flex items-center justify-between">
						<span className="text-lg font-medium">Payment</span>
						<span className="text-lg font-medium">Amount / Share</span>
					</p>
					<List className="mt-2">
						{data.map((item) => (
							<ListItem key={item.name} className="space-x-6">
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