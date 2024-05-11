"use client";

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import CrudGridExpenses from "@/components/CrudGridExpenses";
import {userSettings} from "@/utils/user_settings";
import {EnumType, EnumPayment, EnumSubscriptionType} from "@prisma/client";
import {CATEGORY_TYPE} from "@/utils/constants";
import {format} from "date-fns";
import SubscriptionNotification from "@/components/SubscriptionNotification";

type DataProps = {
    id: string;
    description: string;
    payment: EnumPayment;
    type: EnumType;
    category: CATEGORY_TYPE;
    amount: number;
}

type DataNoIDProps = {
    description: string;
    payment: EnumPayment;
    type: EnumType;
    category: CATEGORY_TYPE;
    amount: number;
}

type SubscriptionsProps = {
    id: string;
    name: string;
    renews: Date;
    type: EnumSubscriptionType;
    amount: number;
}

type StateProps = {
    loading: boolean;
    error: boolean;
}

type DayOverlayProps = {
    day: number;
    month: number;
    year: number;
    numberOfDays: number;
}

const DayOverlay = ({day, month, year, numberOfDays}: DayOverlayProps) => {
    const {data: session} = useSession();
    const [state, setState] = useState<StateProps>({
        loading: true,
        error: false
    });
    const [dataRows, setDataRows] = useState<DataProps[]>([]);
    const [subscriptions, setSubscriptions] = useState<SubscriptionsProps[]>([]);
    const date = new Date(year, month - 1, day);
    const formattedDate = new Date(format(date, 'yyyy-MM-dd'));

    useEffect(() => {
        const fetchDailyExpenses = async () => {
            await fetch(`/api/daily_expenses/${session?.user?.id}`, {
                method: "POST",
                body: JSON.stringify({date: formattedDate})
            })
                .then(response => response.json())
                .then(response => {
                    setDataRows(response.expenses);
                    setSubscriptions(response.subscriptions);
                    setState((prev) => ({...prev, loading: false}));
                })
                .catch((error) => {
                    setState((_prev) => ({loading: false, error: true}));
                    console.log(error);
                });
        }
        fetchDailyExpenses().then();
    }, []);

    const updateDate = (date: Date, type: EnumSubscriptionType) => {
        const newDate = new Date(date);
        if (type === "Weekly") {
            newDate.setDate(newDate.getDate() + 7);
        } else if (type === "Monthly") {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }
        return newDate;
    }

    const updateSubscription = async (subscription: SubscriptionsProps) => {
        const {id: subscription_id, ...subscription_props} = subscription;
        await fetch(`/api/subscription/${subscription_id}`, {
            method: "PATCH",
            body: JSON.stringify({
                ...subscription_props, userId: session?.user?.id,
                renews: updateDate(subscription.renews, subscription.type)
            })
        })
            .catch((error) => {
                console.log(error)
            });
    }

    const paySubscription = async (subscription: SubscriptionsProps, index: number) => {
        setSubscriptions(prev => {
            return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
        updateSubscription(subscription).then();
        const expense_details: DataNoIDProps = {
            description: subscription.name, payment: "Card", type: "Discretionary", category: "Entertainment",
            amount: subscription.amount,
        }
        await fetch(`/api/expense/${session?.user?.id}`, {
            method: "POST",
            body: JSON.stringify({...expense_details,
                date: new Date(format(new Date(subscription.renews), 'yyyy-MM-dd'))})
        })
            .then(response => response.json())
            .then(response => {
                setDataRows(prev => [...prev, {...expense_details, id: response.id}]);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const skipSubscription = (subscription: SubscriptionsProps, index: number) => {
        setSubscriptions(prev => {
            return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
        updateSubscription(subscription).then();
    }

    if (state.loading || state.error)
        return (
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)"}}>
                {state.loading && <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>Loading...</span>}
                {state.error && <span className="p-5 text-2xl" style={{color: "#00cf8d"}}>ERROR</span>}
            </div>
        )
    const totalDay = userSettings.income / 12 / numberOfDays;
    const overallExpenses = dataRows.reduce((acc, row) => acc + row.amount, 0);
    return (
        <div style={{marginTop: 10}}>
            {subscriptions.length !== 0 &&
                <SubscriptionNotification setSubscriptions={setSubscriptions} subscriptions={subscriptions}
                                          paySubscription={paySubscription} skipSubscription={skipSubscription}/>}
            <div className="pb-3 font-semibold text-xl flex justify-center">
                {day + ' ' + date.toLocaleString('default', {month: 'long'}) + ' ' + year}
            </div>
            <div className="flex justify-center align-middle text-2xl pb-2">
                <label className={`${(overallExpenses > totalDay) ? "text-red-600" : "inherit"}`}
                       id="today-expenses">
                    Overall expenses:&nbsp;
                </label>
                <span className={`${(overallExpenses > totalDay) ? "text-red-600" : "inherit"}`}>
                    {userSettings.currency}{overallExpenses.toFixed(2)}
                </span>
            </div>
            <div className="flex justify-center">
                <CrudGridExpenses rows={dataRows} setRows={setDataRows} date={formattedDate}/>
            </div>
        </div>
    )
};

export default DayOverlay;