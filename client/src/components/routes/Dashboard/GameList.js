import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Checkbox,
    IconButton,
    Icon,
    Button
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 530,
        marginTop: 25,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function GameList(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    if (props.games && props.games.length > 0) {
        return (
            <React.Fragment>
                <List className={classes.root}>
                    {props.games.map((value, index) => {
                        const name = value.url ? value.url.split('#')[1] : value.split('#')[1];
                        const url = value.url ? value.url : value;
                        const labelId = `checkbox-list-label-${index}`;
                        const size = value.size ? formatBytes(value.size) : false;
                        return (
                            <ListItem key={index} role={undefined} dense button onClick={handleToggle(index)}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(index) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={name} />
                                {size ? <ListItemText primary={size} /> : null}
                                <ListItemSecondaryAction>
                                    <a style={{ textDecoration: 'none' }} href={url} target="_blank" rel="noopener noreferrer">
                                        <IconButton edge="end" aria-label="Comments">
                                            <Icon>open_in_new</Icon>
                                        </IconButton>
                                    </a>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
                <Button style={{ marginTop: 15 }} onClick={() => {
                    setChecked([])
                    props.onTriggerDelete(checked)
                }} variant="contained" color="secondary" className={classes.button}>
                    Delete
                    <DeleteIcon className={classes.rightIcon} />
                </Button>
            </React.Fragment>
        );
    } else {
        return props.loadingFolders ? 'No folders found...' : 'No files found...';
    }
}