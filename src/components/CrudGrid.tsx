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
    GridSlots, GridColumnMenuContainer, GridColumnMenuFilterItem
} from '@mui/x-data-grid';
import {useState} from "react";
import AddExpense from "@/components/add_expense/AddExpense";
import DeleteSelectedButton from "@/components/DeleteSelectedButton";
import DeleteDialog from "@/components/DeleteDialog";
import AlertDialog from "@/components/AlertDialog";

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    handleDeleteSelectedClick: Function;
    setShowAddExpense: Function;
    deleteIDs: [];
}

function EditToolbar(props: EditToolbarProps) {
    const {setRows, handleDeleteSelectedClick, setShowAddExpense, deleteIDs} = props;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleAcceptDelete = () => {
        handleDeleteSelectedClick();
    };

    const handleClick = () => {
        // const id = -1;
        // setRows((oldRows) => [...oldRows, {id, description:'', type: 'Card', price: 0.0}]);
        // setRowModesModel((oldModel) => ({
        //     ...oldModel,
        //     [id]: {mode: GridRowModes.Edit, fieldToFocus: 'name'},
        // }));
    };

    return (
        <GridToolbarContainer className="justify-between">
            <Button startIcon={<AddIcon/>} onClick={() => setShowAddExpense(true)}>Add expense</Button>
            {deleteIDs.length !== 0 &&
                <DeleteSelectedButton functionOnDelete={handleAcceptDelete} expenses={deleteIDs.length}/>}
        </GridToolbarContainer>
    );
}

export default function CrudGrid(data: { rows: GridRowsProp, setRows: Function }) {
    const {rows, setRows} = data
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [deleteIDs, setDeleteIDs] = useState([]);
    const [deleteID, setDeleteID] = useState<GridRowId>();
    const [description, setDescription] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleDeleteSelectedClick = () => {
        const deleteIDsSet = new Set<any>(deleteIDs);
        setRows(rows.filter((row) => !deleteIDsSet.has(row.id)));
    }

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        const updatedRow = {...newRow};

        updatedRow.description = updatedRow.description.trim();
        if (updatedRow.description.length === 0 || updatedRow.description.length > 30) {
            setErrorTitle("Description Column");
            setErrorMessage("Description cannot be empty or over 30 characters!");
            setShowError(true);
            return oldRow;
        }
        updatedRow.price = parseFloat(updatedRow.price.toFixed(2));
        if (updatedRow.price > 999999999 || updatedRow.price < -999999999) {
            setErrorTitle("Price Column");
            setErrorMessage("Price should be between -999999999 and 999999999!");
            setShowError(true);
            return oldRow;
        }

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const hideDialog = () => {
        setOpenDialog(false);
        setDescription("");
        setDeleteID(undefined);
    }

    const columns: GridColDef[] = [
        {field: 'description', headerName: 'Description', width: 300, editable: true},
        {
            field: 'type',
            headerName: 'Type',
            width: 120,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Card', 'Cash'],
        },
        {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            width: 120,
            headerAlign: "left",
            align: "left",
            editable: true,
            valueFormatter: (value: number) => "$" + value.toFixed(2)
        },
        {
            field: 'actions', type: 'actions', headerName: 'Actions', width: 100, cellClassName: 'actions',
            getActions: ({id, row}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon/>}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon sx={{fill: "red",}}/>}
                            label="Cancel"
                            onClick={handleCancelClick(id)}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
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

    return (
        <div>
            <Box sx={{height: 412, width: '100%',}}>
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
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar as GridSlots['toolbar'],
                        columnMenu: CustomColumnMenu as GridSlots['columnMenu']
                    }}
                    slotProps={{
                        toolbar: {setRows, handleDeleteSelectedClick, setShowAddExpense, deleteIDs},
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 5},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection={true}
                    onRowSelectionModelChange={(ids: any) => {
                        setDeleteIDs(ids);
                    }}
                />
                <DeleteDialog description={description} openDialog={openDialog} hideDialog={hideDialog}
                              functionOnDelete={() => {
                                  handleDeleteClick(deleteID!);
                                  hideDialog();
                              }}/>
                <AlertDialog openDialog={showError} hideDialog={setShowError} dialogTitle={errorTitle}
                             dialogMessage={errorMessage}/>
            </Box>
            {showAddExpense && <AddExpense setShowAddExpense={setShowAddExpense}/>}
        </div>
    );
}

const CustomColumnMenu = (props: any) => {
    const {hideMenu, currentColumn} = props;

    return (
        <GridColumnMenuContainer
            hideMenu={hideMenu}
            open={props.open}
            colDef={props.colDef}>
            <GridColumnMenuFilterItem column={currentColumn} onClick={hideMenu} colDef={props.colDef}/>
        </GridColumnMenuContainer>
    );
};