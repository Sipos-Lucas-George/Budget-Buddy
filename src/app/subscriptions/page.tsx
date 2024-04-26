"use client";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import {Box} from '@mui/system';
import {useEffect, useState} from "react";


const _base = [
    { id: 1, name: 'Netflix', startDate: '2021-01-01', renews: 'Monthly', price: '8.99' },
    { id: 2, name: 'Spotify', startDate: '2021-02-15', renews: 'Monthly', price: '4.99' },
    { id: 3, name: 'Amazon Prime', startDate: '2021-03-22', renews: 'Yearly', price: '119.00' },
];

function generateSubscriptions(count: number) {
    let generatedSubscriptions = [];
    const baseLength = _base.length;

    for (let i = 0; i < count; i++) {
        const base = _base[i % baseLength];
        const newStartDate = new Date(base.startDate);
        // Increment the start date by a number of days equal to the index to diversify the dates
        newStartDate.setDate(newStartDate.getDate() + i);

        generatedSubscriptions.push({
            id: i + 5,
            name: base.name,
            startDate: newStartDate.toISOString().split('T')[0], // Format date back to YYYY-MM-DD
            renews: base.renews,
            price: (parseFloat(base.price) + Math.random()).toFixed(2) // Slightly vary the price
        });
    }

    return generatedSubscriptions;
}

interface Subscription {
    id: number;
    name: string;
    startDate: string;
    renews: string;
    price: string;
}


function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

    useEffect(() => {
        setSubscriptions(generateSubscriptions(100));
    }, []);

    return (
        <div>
            <div className="flex w-full flex-1 justify-center align-middle">
                <Box className="flex justify-center align-middle flex-col w-1/3">
                    <List className="h-1/2 max-h-96 overflow-y-auto">
                        {subscriptions && subscriptions.map(sub => (
                            <Button key={sub.id} className="w-full">
                                <ListItem>
                                    <ListItemText
                                        primary={sub.name}
                                        secondary={`Starts: ${sub.startDate} | Renews: ${sub.renews} | Price: $${sub.price}`}
                                    />
                                </ListItem>
                            </Button>
                        ))}
                    </List>
                    <Button>ADD</Button>
                </Box>
            </div>
        </div>
    );
}

export default Subscriptions;
