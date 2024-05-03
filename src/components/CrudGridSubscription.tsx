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
import DeleteSelectedButton from "@/components/DeleteSelectedButton";
import DeleteDialog from "@/components/DeleteDialog";
import {userSettings} from "@/utils/user_settings";
import {SUBSCRIPTION_TYPE, SUBSCRIPTIONS_LIMIT} from "@/utils/constants";
import {InputLabel, TextField} from "@mui/material";
import {useSession} from "next-auth/react";
import {EnumSubscriptionType} from "@prisma/client";
import AddSubscription from "@/components/AddSubscription";
import {format} from "date-fns";
import CustomDatePicker from "@/components/CustomDatePicker";

type EditToolbarProps = {
    handleDeleteSelectedClick: Function;
    setShowAddSubscription: Function;
    deleteIDs: [];
    limit: number;
}

function EditToolbar(props: EditToolbarProps) {
    const {handleDeleteSelectedClick, setShowAddSubscription, deleteIDs, limit} = props;

    const handleAcceptDelete = () => {
        handleDeleteSelectedClick();
    };

    return (
        <GridToolbarContainer className="flex justify-between">
            <Button disabled={limit === SUBSCRIPTIONS_LIMIT} style={{textAlign: "left"}}
                    startIcon={<AddIcon style={{fill: (limit === SUBSCRIPTIONS_LIMIT) ? "#00000042" : ""}}/>}
                    onClick={() => setShowAddSubscription(true)}>
                Add subscription
            </Button>
            <div style={{textAlign: "center", fontWeight: 500, fontSize: 18}}>Limit: {limit}/{SUBSCRIPTIONS_LIMIT}</div>
            <div style={{textAlign: "right"}}>
                <DeleteSelectedButton functionOnDelete={handleAcceptDelete} numberOfDeletions={deleteIDs.length}
                                      disabled={deleteIDs.length === 0}/>
            </div>
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

const CustomRenewsInput = (props: GridRenderEditCellParams) => {
    const {id, value, api, field} = props;

    const handleInputChange = (date: Date) => {
        api.setEditCellValue({id, field, value: date});
    };

    return (
        <CustomDatePicker value={new Date(value)} onChange={handleInputChange} noLabel={true}/>
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
    name: string;
    renews: Date;
    type: EnumSubscriptionType;
    amount: number;
}

type CrudGridProps = {
    rows: GridRowsProp;
    setRows: Dispatch<SetStateAction<DataProps[]>>;
}

export default function CrudGridSubscription({rows, setRows}: CrudGridProps) {
    const {data: session} = useSession();
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [showAddSubscription, setShowAddSubscription] = useState(false);
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
        handleDeleteSubscription(id as string).then();
        setRows(prevRows => {
            const rowIndex = prevRows.findIndex(row => row.id === id);
            if (rowIndex === -1) return prevRows;
            return [...prevRows.slice(0, rowIndex), ...prevRows.slice(rowIndex + 1)];
        });
    };

    const handleDeleteSelectedClick = () => {
        const deleteIDsSet = new Set<any>(deleteIDs);
        handleDeleteManySubscription(deleteIDs).then();
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
        updatedRow.name = updatedRow.name.trim();
        if (updatedRow.name.length > 30) {
            return oldRow;
        }
        if (updatedRow.amount === "") {
            updatedRow.amount = 0;
        }
        updatedRow.amount = parseFloat(parseFloat(updatedRow.amount).toFixed(2));
        if (updatedRow.amount >= 1000000000) {
            return oldRow;
        }
        if (updatedRow.name === oldRow.name && updatedRow.amount === oldRow.amount && updatedRow.type === oldRow.type
            && updatedRow.renews.getDate() === oldRow.renews.getDate()
            && updatedRow.renews.getMonth() === oldRow.renews.getMonth()
            && updatedRow.renews.getFullYear() === oldRow.renews.getFullYear()) {
            return oldRow;
        }
        updatedRow.renews = new Date(format(updatedRow.renews, "yyyy-MM-dd"));
        handleUpdateSubscription(updatedRow).then();
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

    const handleSaveSubscription = async (form: any) => {
        await fetch(`/api/subscription/${session?.user?.id}`, {
            method: "POST",
            body: JSON.stringify({...form})
        })
            .then(response => response.json())
            .then(response => {
                setRows(prevRows => [...prevRows, {...form, id: response.id}]);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleUpdateSubscription = async (row: any) => {
        const {id: subscription_id, ...row_props} = row;
        await fetch(`/api/subscription/${subscription_id}`, {
            method: "PATCH",
            body: JSON.stringify({
                ...row_props, userId: session?.user?.id
            })
        })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleDeleteSubscription = async (subscription_id: string) => {
        await fetch(`/api/subscription/${subscription_id}`, {
            method: "DELETE",
        })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleDeleteManySubscription = async (subscriptions_id: string[]) => {
        await fetch(`/api/subscriptions`, {
            method: "DELETE",
            body: JSON.stringify(subscriptions_id)
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
            field: 'name', headerName: 'Name', width: 300, editable: true, maxWidth: 500,
            renderEditCell: CustomDescriptionInput,
        },
        {
            field: 'renews', headerName: 'Renews', width: 180, maxWidth: 200, editable: true,
            type: 'date', renderEditCell: CustomRenewsInput,
            valueFormatter: (value: Date) => format(value, "dd - MM - yyyy"),
        },
        {
            field: 'type', headerName: 'Type', width: 120, maxWidth: 200, editable: true, type: 'singleSelect',
            valueOptions: SUBSCRIPTION_TYPE,
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
                    slotProps={{
                        toolbar: {
                            handleDeleteSelectedClick,
                            setShowAddSubscription,
                            deleteIDs,
                            limit: rows.length
                        }
                    }}
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
            {showAddSubscription &&
                <AddSubscription setShowAddSubscription={setShowAddSubscription}
                                 handleSaveSubscription={handleSaveSubscription}/>}
        </div>
    );
}