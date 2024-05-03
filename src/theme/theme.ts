'use client';

import {createTheme} from '@mui/material/styles';
import {outlinedInputClasses} from "@mui/material";
import type {} from '@mui/x-date-pickers/themeAugmentation';

const theme = createTheme({
    typography: {
        fontFamily: "inherit",
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: '#00cf8d',
                    },
                    [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: '#00cf8d',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    '&.Mui-focused': {
                        color: '#00cf8d'
                    }
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '&:hover:not(.Mui-disabled, .Mui-error):before': {
                        borderBottom: 'solid #00cf8d 2px'
                    },
                    '&::after': {
                        borderBottom: 'solid #00cf8d 2px',
                    },
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    "&.Mui-focused:after": {
                        borderBottom: "solid #00cf8d 2px",
                    },
                    "&:hover:after": {
                        borderBottom: "solid #00cf8d 2px",
                    },
                    "&:hover .MuiOutlineInput-notchedOutline": {
                        borderColor: "#00cf8d"
                    },
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        background: "#00cf8d88",
                        ':hover': {
                            background: "#00cf8daa"
                        },
                        ':focus': {
                            background: "#00cf8d88"
                        },
                    },
                    ':focus': {
                        background: "transparent"
                    },
                    ':hover': {
                        background: "#00cf8d44"
                    },
                },
            },
            defaultProps: {
                disableRipple: true,
            }
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: 18,
                    color: "inherit",
                    ":hover": {
                        background: "#00cf8d44"
                    },
                    ":focus:hover": {
                        background: "#00cf8d88"
                    },
                }
            },
            defaultProps: {
                disableRipple: true,
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    ":hover": {
                        background: "#00cf8d99"
                    },
                },
            },
            defaultProps: {
                disableRipple: true,
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    ":hover": {
                        background: "#00cf8d44"
                    },
                }
            },
            defaultProps: {
                disableRipple: true,
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: "#00cf8d",
                    fontFamily: "inherit"
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    fontFamily: "inherit",
                    textTransform: "none",
                    color: "inherit",
                    ":hover": {
                        background: "#00cf8d44"
                    },
                    ":focus:hover": {
                        background: "#00cf8d88"
                    },
                    "&.Mui-selected": {
                        background: "#00cf8d66",
                        '&:hover': {
                            backgroundColor: '#00cf8d88',
                        }
                    },
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: "#00cf8d",
                    height: 8,
                },
                thumb: {
                    color: "white",
                    "&:hover, &.Mui-focusVisible": {
                        boxShadow: `0px 0px 0px 8px #00cf8d44`
                    },
                    "&.Mui-active": {
                        color: "#00cf8d",
                        boxShadow: `0px 0px 0px 14px #00cf8d44`
                    }
                },
                track: {
                    color: '#00cf8d',
                    height: 8,
                    borderRadius: 4,
                },
                rail: {
                    color: '#bfbfbf',
                    opacity: 1,
                    height: 8,
                    borderRadius: 4,
                },
                valueLabel: {
                    backgroundColor: '#00cf8d',
                    '& *': {
                        background: 'transparent',
                    },
                }
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    color: '#00cf8d',
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    "& .MuiAutocomplete-listbox": {
                        "& .MuiAutocomplete-option[aria-selected='true']": {
                            background: "#00cf8d",
                            "&.Mui-focused": {
                                background: "#00cf8d",
                            }
                        }
                    },
                    "& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused": {
                        background: "#00cf8d",
                    }
                }
            }
        },
        MuiPickersDay: { // problems
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        background: "#00cf8daa !important",
                        ':hover': {
                            background: "#00cf8d"
                        }
                    },
                    ':hover': {
                        background: "#00cf8d55"
                    },
                    ':focus': {
                        background: "transparent"
                    }
                }
            }
        },
        MuiPickersMonth: {
            styleOverrides: {
                monthButton: {
                    '&.Mui-selected': {
                        color: "#fff",
                        background: "#00cf8daa !important",
                        ':hover': {
                            background: "#00cf8d"
                        }
                    },
                    ':hover': {
                        background: "#00cf8d55"
                    },
                    ':focus': {
                        background: "transparent"
                    }
                }
            }
        },
        MuiPickersYear: {
            styleOverrides: {
                yearButton: {
                    '&.Mui-selected': {
                        color: "#fff",
                        background: "#00cf8daa !important",
                        ':hover': {
                            background: "#00cf8d"
                        }
                    },
                    ':hover': {
                        background: "#00cf8d55"
                    },
                    ':focus': {
                        background: "transparent"
                    }
                }
            }
        }
    },
});

export default theme;