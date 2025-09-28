import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from '@mui/icons-material/Close';
import {Link} from "react-router-dom";

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle  sx={{width:450}}{...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

export default function BasicMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(false);
    const open = Boolean(anchorEl);
    const [openDialog, setDialog] = React.useState(Boolean(false));
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setDialog(false)
    };
    const handleDelete = () => {
        var storedNames = JSON.parse(localStorage.getItem("names")).reverse()
        storedNames = storedNames.filter(function(value){
            return value !== props.props.toString();
        });
        localStorage.setItem("names", JSON.stringify(storedNames));
        props.set(props.rows.filter(function(value){
            return value.id !== props.props;
        }))
    };
    const handleDialog = () => {
        setAnchorEl(null);
        setDialog(true)
    };
    return (
        <div>
            <IconButton
                size={'small'}
                style={{ marginLeft: 16}}
                onClick={handleClick}
            >
                <MoreVertIcon></MoreVertIcon>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {/*<MenuItem onClick={handleDialog}>Удалить</MenuItem>*/}
                <MenuItem component={Link} to={`/result/`+props.props+`/expert`}>Отправить эксперту</MenuItem>
            </Menu>
            <Dialog PaperProps={{sx:{ borderRadius:3}}}
                    open={openDialog}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                    BackdropProps={{style:{ opacity:0.3}}}
            >

                <BootstrapDialogTitle color={'#4fb3ea'} onClose={handleClose}>Вы уверены, что хотите удалить результат диагностики?</BootstrapDialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description"  fontFamily={'Roboto'}>
                        Отменить данное действие будет невозможно
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {/*<Button  sx={{color: '#5a666b', marginInline:15,*/}
                    {/*    backgroundColor: '#ffffff',*/}
                    {/*    '&:focus': {backgroundColor: '#606972'},*/}
                    {/*    fontStyle: {fontFamily: 'Roboto', fontColor: '#484d54'}*/}
                    {/*}} onClick={handleDelete}>Удалить</Button>*/}
                    <Button sx={{color: '#4fb3ea', marginInline:15,
                        backgroundColor: '#ffffff',
                        '&:focus': {backgroundColor: '#4fb3ea'},
                        fontStyle: {fontFamily: 'Roboto', fontColor: '#4fb3ea'}
                    }} onClick={handleClose}>Не удалять</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
