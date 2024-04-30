import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlots, GridRenderEditCellParams, GridFilterOperator
} from '@mui/x-data-grid';
import React, {Dispatch, SetStateAction, useMemo, useState} from "react";
import AddExpense from "@/components/AddExpense";
import DeleteSelectedButton from "@/components/DeleteSelectedButton";
import DeleteDialog from "@/components/DeleteDialog";
import {userSettings} from "@/utils/user_settings";
import {CATEGORY, CATEGORY_MAP, CATEGORY_TYPE, PAYMENT, TYPE} from "@/utils/constants";
import {InputLabel, TextField} from "@mui/material";
import {useSession} from "next-auth/react";
import {EnumPayment, EnumType} from "@prisma/client";

interface EditToolbarProps {
    handleDeleteSelectedClick: Function;
    setShowAddExpense: Function;
    deleteIDs: [];
}

function EditToolbar(props: EditToolbarProps) {
    const {handleDeleteSelectedClick, setShowAddExpense, deleteIDs} = props;

    const handleAcceptDelete = () => {
        handleDeleteSelectedClick();
    };

    return (
        <GridToolbarContainer className="justify-between">
            <Button startIcon={<AddIcon/>} onClick={() => setShowAddExpense(true)}>
                Add expense</Button>
            {deleteIDs.length !== 0 &&
                <DeleteSelectedButton functionOnDelete={handleAcceptDelete} expenses={deleteIDs.length}/>}
        </GridToolbarContainer>
    );
}

const CustomDescriptionInput = (props: GridRenderEditCellParams) => {
    const {id, value, api, field} = props;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue.length > 30) {
            return;
        }
        api.setEditCellValue({id, field, value: newValue}, event);
    };

    return (
        <TextField
            sx={{flexDirection: "unset"}}
            value={value ?? ""}
            onChange={handleInputChange}
            fullWidth
            inputProps={{maxLength: 30}}
        />
    );
};

const CustomAmountInput = ({id, value, api, field}: GridRenderEditCellParams) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (!/^(|0(|\.\d{0,2})?|[1-9]\d{0,8}(|\.\d{0,2}))$/.test(newValue)) {
            return;
        }
        api.setEditCellValue({id, field, value: newValue}, event);
    };

    return (
        <TextField
            sx={{flexDirection: "unset"}}
            value={value}
            onChange={handleInputChange}
            fullWidth
        />
    );
};

type DataProps = {
    id: string;
    description: string;
    payment: EnumPayment;
    type: EnumType;
    category: CATEGORY_TYPE;
    amount: number;
}

type CrudGridProps = {
    rows: GridRowsProp;
    setRows: Dispatch<SetStateAction<DataProps[]>>;
    date: Date;
}

export default function CrudGrid({rows, setRows, date}: CrudGridProps) {
    const {data: session} = useSession();
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [deleteIDs, setDeleteIDs] = useState([]);
    const [deleteID, setDeleteID] = useState<GridRowId>();
    const [description, setDescription] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [heightChange, setHeightChange] = useState(5);

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleDeleteClick = (id: GridRowId) => {
        handleDeleteExpense(id as string).then();
        setRows(prevRows => {
            const rowIndex = prevRows.findIndex(row => row.id === id);
            if (rowIndex === -1) return prevRows;
            return [...prevRows.slice(0, rowIndex), ...prevRows.slice(rowIndex + 1)];
        });
    };

    const handleDeleteSelectedClick = () => {
        const deleteIDsSet = new Set<any>(deleteIDs);
        handleDeleteManyExpenses(deleteIDs).then();
        setRows(prevRows => prevRows.filter(row => !deleteIDsSet.has(row.id)));
    }

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });
    };

    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        const updatedRow: GridRowModel = {...newRow};
        updatedRow.description = updatedRow.description.trim();
        if (updatedRow.description.length > 30) {
            return oldRow;
        }
        if (updatedRow.amount === "" || updatedRow.amount === "-" || updatedRow.amount === "-0") {
            updatedRow.amount = 0;
        }
        updatedRow.amount = parseFloat(parseFloat(updatedRow.amount).toFixed(2));
        if (updatedRow.amount >= 1000000000 || updatedRow.amount <= -1000000000) {
            return oldRow;
        }
        if (updatedRow.description === oldRow.description && updatedRow.amount === oldRow.amount
            && updatedRow.paymentType === oldRow.paymentType && updatedRow.expenseType === oldRow.expenseType
            && updatedRow.category === oldRow.category) {
            return oldRow;
        }
        handleUpdateExpense(updatedRow).then();
        setRows(prevRows => {
            const rowIndex = prevRows.findIndex(row => row.id === updatedRow.id);
            if (rowIndex === -1) return prevRows;
            const newRows = [...prevRows];
            newRows[rowIndex] = updatedRow as DataProps;
            return newRows;
        });
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const hideDialog = () => {
        setOpenDialog(false);
        setDeleteID(undefined);
        setDescription("");
    }

    const handleSaveExpense = async (form: any) => {
        await fetch(`/api/expense/${session?.user?.id}`, {
            method: "POST",
            body: JSON.stringify({...form, date: date})
        })
            .then(response => response.json())
            .then(response => {
                setRows(prevRows =>
                    [...prevRows, {...form, id: response.id, category: CATEGORY_MAP[form.category] || form.category}]);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleUpdateExpense = async (row: any) => {
        const {id: expense_id, ...row_props} = row;
        await fetch(`/api/expense/${expense_id}`, {
            method: "PATCH",
            body: JSON.stringify({
                ...row_props, category: CATEGORY_MAP[row.category] || row.category,
                date: date, userId: session?.user?.id
            })
        })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleDeleteExpense = async (expense_id: string) => {
        await fetch(`/api/expense/${expense_id}`, {
            method: "DELETE",
        })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleDeleteManyExpenses = async (expenses_id: string[]) => {
        await fetch(`/api/expenses`, {
            method: "DELETE",
            body: JSON.stringify(expenses_id)
        })
            .catch((error) => {
                console.log(error)
            });
    }

    const customAmountFilter: GridFilterOperator[] = [
        {
            label: '=',
            value: 'equals',
            getApplyFilterFn: (filterItem) => {
                if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                    return null;
                }

                return (value, _row, _column, _apiRef) => {
                    return Number(value) === Number(filterItem.value);
                };
            },
            InputComponent: ({item, applyValue}) => (
                <div>
                    <InputLabel id="value-label" htmlFor="value-id" variant="standard"/>
                    <TextField
                        id="value-id"
                        label="Value"
                        value={item.value || ''}
                        onChange={(event) => applyValue({...item, value: event.target.value})}
                        placeholder="Filter value"
                        type="number"
                        variant="standard"
                        fullWidth
                    />
                </div>
            )
        },
        {
            label: '≠',
            value: 'different',
            getApplyFilterFn: (filterItem) => {
                if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                    return null;
                }

                return (value, _row, _column, _apiRef) => {
                    return Number(value) !== Number(filterItem.value);
                };
            },
            InputComponent: ({item, applyValue}) => (
                <div>
                    <InputLabel id="value-label" htmlFor="value-id" variant="standard"/>
                    <TextField
                        id="value-id"
                        label="Value"
                        value={item.value || ''}
                        onChange={(event) => applyValue({...item, value: event.target.value})}
                        placeholder="Filter value"
                        type="number"
                        variant="standard"
                        fullWidth
                    />
                </div>
            )
        },
        {
            label: '>',
            value: 'greaterThan',
            getApplyFilterFn: (filterItem) => {
                if (!filterItem.field || !filterItem.value) {
                    return null;
                }
                return (value, _row, _column, _apiRef) => {
                    return Number(value) > Number(filterItem.value);
                };
            },
            InputComponent: ({item, applyValue}) => (
                <div>
                    <InputLabel id="value-label" htmlFor="value-id" variant="standard"/>
                    <TextField
                        id="value-id"
                        label="Value"
                        value={item.value || ''}
                        onChange={(event) => applyValue({...item, value: event.target.value})}
                        placeholder="Filter value"
                        type="number"
                        variant="standard"
                        fullWidth
                    />
                </div>
            )
        },
        {
            label: '<',
            value: 'lessThan',
            getApplyFilterFn: (filterItem) => {
                if (!filterItem.field || !filterItem.value) {
                    return null;
                }
                return (value, _row, _column, _apiRef) => {
                    return Number(value) < Number(filterItem.value);
                };
            },
            InputComponent: ({item, applyValue}) => (
                <div>
                    <InputLabel id="value-label" htmlFor="value-id" variant="standard"/>
                    <TextField
                        id="value-id"
                        label="Value"
                        value={item.value || ''}
                        onChange={(event) => applyValue({...item, value: event.target.value})}
                        placeholder="Filter value"
                        type="number"
                        variant="standard"
                        fullWidth
                    />
                </div>
            )
        },
        {
            label: '≥',
            value: 'greaterThanEqual',
            getApplyFilterFn: (filterItem) => {
                if (!filterItem.field || !filterItem.value) {
                    return null;
                }
                return (value, _row, _column, _apiRef) => {
                    return Number(value) >= Number(filterItem.value);
                };
            },
            InputComponent: ({item, applyValue}) => (
                <div>
                    <InputLabel id="value-label" htmlFor="value-id" variant="standard"/>
                    <TextField
                        id="value-id"
                        label="Value"
                        value={item.value || ''}
                        onChange={(event) => applyValue({...item, value: event.target.value})}
                        placeholder="Filter value"
                        type="number"
                        variant="standard"
                        fullWidth
                    />
                </div>
            )
        },
        {
            label: '≤',
            value: 'lessThanEqual',
            getApplyFilterFn: (filterItem) => {
                if (!filterItem.field || !filterItem.value) {
                    return null;
                }
                return (value, _row, _column, _apiRef) => {
                    return Number(value) <= Number(filterItem.value);
                };
            },
            InputComponent: ({item, applyValue}) => (
                <div>
                    <InputLabel id="value-label" htmlFor="value-id" variant="standard"/>
                    <TextField
                        id="value-id"
                        label="Value"
                        value={item.value || ''}
                        onChange={(event) => applyValue({...item, value: event.target.value})}
                        placeholder="Filter value"
                        type="number"
                        variant="standard"
                        fullWidth
                    />
                </div>
            )
        },
        {
            label: 'Between',
            value: 'between',
            getApplyFilterFn: (filterItem) => {
                if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
                    return null;
                }
                if (filterItem.value[0] == null || filterItem.value[1] == null) {
                    return null;
                }
                return (value) => {
                    return (
                        value !== null &&
                        filterItem.value[0] <= value &&
                        value <= filterItem.value[1]
                    );
                };
            },
            InputComponent: ({item, applyValue}) => {
                const handleChange = (index: any) => (event: any) => {
                    const newValue = [...(item.value || [null, null])];
                    newValue[index] = event.target.value !== '' ? Number(event.target.value) : null;
                    applyValue({...item, value: newValue});
                };
                return (
                    <Box sx={{display: 'inline-flex', flexDirection: 'row', alignItems: 'end', height: 48}}>
                        <TextField
                            id="value1-id"
                            label="Value"
                            value={item.value ? item.value[0] || '' : ''}
                            onChange={handleChange(0)}
                            placeholder="Filter value"
                            type="number"
                            variant="standard"
                            fullWidth
                        />
                        <TextField
                            id="value2-id"
                            label="Value"
                            value={item.value ? item.value[1] || '' : ''}
                            onChange={handleChange(1)}
                            placeholder="Filter value"
                            type="number"
                            variant="standard"
                            fullWidth
                        />
                    </Box>
                )
            }
        },
    ];

    const columns: GridColDef[] = [
        {
            field: 'description', headerName: 'Description', width: 300, editable: true, maxWidth: 500,
            renderEditCell: CustomDescriptionInput,
        },
        {
            field: 'payment', headerName: 'Payment', width: 120, maxWidth: 200, editable: true,
            type: 'singleSelect', valueOptions: PAYMENT,
        },
        {
            field: 'type', headerName: 'Type', width: 150, maxWidth: 200, editable: true, type: 'singleSelect',
            valueOptions: TYPE,
        },
        {
            field: 'category', headerName: 'Category', width: 180, maxWidth: 200, editable: true, type: 'singleSelect',
            valueOptions: CATEGORY,
        },
        {
            field: 'amount', headerName: 'Amount', width: 120, maxWidth: 200, headerAlign: "left", align: "left",
            editable: true, hideable: false, renderEditCell: CustomAmountInput, filterOperators: customAmountFilter,
            valueFormatter: (value: number) => userSettings.currency + value.toFixed(2),
        },
        {
            field: 'actions', type: 'actions', headerName: 'Actions', width: 100, cellClassName: 'actions',
            align: "left", headerAlign: "left", resizable: false, getActions: ({id, row}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key="grid-cell-save"
                            icon={<SaveIcon/>}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key="grid-cell-cancel"
                            icon={<CancelIcon sx={{fill: "red",}}/>}
                            label="Cancel"
                            onClick={handleCancelClick(id)}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        key="grid-cell-edit"
                        icon={<EditIcon/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key="grid-cell-delete"
                        icon={<DeleteIcon sx={{fill: "red",}}/>}
                        label="Delete"
                        onClick={() => {
                            setDeleteID(id);
                            setDescription(row.description);
                            setOpenDialog(true);
                        }}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    const SLOTS = useMemo(() => {
        return {
            toolbar: EditToolbar as GridSlots['toolbar'],
        }
    }, []);

    const INITIAL_STATE = useMemo(() => {
        return {
            pagination: {
                paginationModel: {page: 0, pageSize: 5},
            },
        };
    }, []);

    return (
        <div>
            <Box sx={{
                width: "100%",
                maxHeight: (heightChange === 5) ? 419 : 679,
                height: (heightChange === 5) ? 419 : 679
            }}>
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            fontSize: 18
                        },
                        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                            outline: "solid #00cf8d 0px"
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: 18
                        },
                        '& .MuiDataGrid-cell input': {
                            fontSize: 18
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: "#00cf8d44"
                        },
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: "#00cf8d66"
                        },
                        '& .MuiDataGrid-row.Mui-selected:hover': {
                            backgroundColor: "#00cf8d88"
                        },
                        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                            outline: "solid #00cf8d 0px"
                        },
                        '& .MuiSelect-select:focus': {
                            backgroundColor: "inherit"
                        },
                        '& .MuiDataGrid-cell.MuiDataGrid-cell--editing:focus-within': {
                            outline: 'solid #00cf8d 0px',
                        },
                    }}
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onRowModesModelChange={handleRowModesModelChange}
                    slots={SLOTS}
                    slotProps={{toolbar: {handleDeleteSelectedClick, setShowAddExpense, deleteIDs}}}
                    initialState={INITIAL_STATE}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection={true}
                    onRowSelectionModelChange={(ids: any) => {
                        setDeleteIDs(ids);
                    }}
                    ignoreDiacritics={true}
                    onPaginationModelChange={(model) => {
                        if (heightChange === 5 && heightChange !== model.pageSize)
                            setHeightChange(model.pageSize);
                        else if (heightChange !== 5 && model.pageSize === 5)
                            setHeightChange(model.pageSize)
                    }}
                />
                <DeleteDialog description={description} openDialog={openDialog} hideDialog={hideDialog}
                              functionOnDelete={() => {
                                  handleDeleteClick(deleteID!);
                                  hideDialog();
                              }}/>
            </Box>
            {showAddExpense &&
                <AddExpense setShowAddExpense={setShowAddExpense} handleSaveExpense={handleSaveExpense}/>}
        </div>
    );
}