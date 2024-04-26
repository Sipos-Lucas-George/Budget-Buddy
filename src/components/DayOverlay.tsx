"use client";

import {useState} from "react";
import CrudGrid from "@/components/CrudGrid";
import {userSettings} from "@/utils/user_settings";

type DayOverlayProps = {
    day: number;
    month: number;
    year: number;
}

const DayOverlay = ({day, month, year}: DayOverlayProps) => {
    const [dataRows, setDataRows] = useState([
        {id: "1", description: 'Description 1', type: 'Card', price: 10.00},
        {id: "2", description: 'Description 1', type: 'Cash', price: 30.00},
        {id: "3", description: 'Description 1', type: 'Card', price: 20.00},
        {id: "4", description: 'Description 1', type: 'Cash', price: 80.00},
        {id: "5", description: 'Description 2', type: 'Cash', price: 80.00},
        {id: "6", description: 'Description 2', type: 'Card', price: 50.00},
        {id: "7", description: 'Description 1', type: 'Card', price: 50.00},
        {id: "8", description: 'Description 1', type: 'Card', price: 40.00},
        {id: "9", description: 'Description 1', type: 'Card', price: 40.00},
        {id: "10", description: 'Description 2', type: 'Cash', price: 20.00}
    ]);

    return (
        <div className="overlay-content" style={{marginTop: 10}}>
            <div>
                <div className="pb-3 font-semibold text-xl flex justify-center">
                    {day + ' ' + new Date(year, month - 1).toLocaleString('default', {month: 'long'}) + ' ' + year}
                </div>
                <div className="flex justify-center align-middle text-2xl pb-2">
                    <label id="today-expenses">Overall expenses:&nbsp;</label>
                    <span>{userSettings.currency}{(dataRows.reduce((acc, row) => acc + row.price, 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-center">
                    <CrudGrid rows={dataRows} setRows={setDataRows}/>
                </div>
            </div>
        </div>
    )
};

export default DayOverlay;