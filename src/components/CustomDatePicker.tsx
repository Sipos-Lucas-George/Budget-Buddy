import React from 'react';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFnsV3';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import enUS from 'date-fns/locale/en-US';
import {Locale} from "date-fns";

const customLocale: Locale = {
	...enUS,
	options: {
		...enUS.options,
		// Sunday = 0, Monday = 1
		weekStartsOn: 1,
	},
};

type CustomDatePicker = {
	value: Date;
	onChange: Function;
	noLabel: boolean;
}

const today = new Date()
const minDate = new Date(today.getFullYear() - 9, 0, 1);
const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const CustomDatePicker = ({value, onChange, noLabel}: CustomDatePicker) => (
	<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={customLocale}>
		<DatePicker
			sx={{flexDirection: "unset"}}
			label={(!noLabel) ? "Renews" : ""}
			value={value}
			onChange={(newValue) => onChange(newValue)}
			views={['year', 'month', 'day']}
			minDate={minDate}
			maxDate={maxDate}
			format="dd - MM - yyyy"
			slotProps={{
				textField: {
					fullWidth: true,
					inputProps: {
						readOnly: true
					}
				}
			}}
		/>
	</LocalizationProvider>
);

export default CustomDatePicker;
