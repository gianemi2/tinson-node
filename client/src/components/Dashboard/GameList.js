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
    if (props.games.length > 0) {
        return (
            <React.Fragment>
                <List className={classes.root}>
                    {props.games.map((value, index) => {
                        const name = value.split('#')[1];
                        const labelId = `checkbox-list-label-${index}`;
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
                                <ListItemSecondaryAction>
                                    <a style={{textDecoration: 'none'}} href={value} target="_blank" rel="noopener noreferrer">
                                        <IconButton edge="end" aria-label="Comments">
                                            <Icon>open_in_new</Icon>
                                        </IconButton>
                                    </a>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
                <Button style={{marginTop: 15}} onClick={() => {
                    setChecked([])
                    props.onTriggerDelete(checked)
                }} variant="contained" color="secondary" className={classes.button}>
                    Delete
                    <DeleteIcon className={classes.rightIcon} />
                </Button>
            </React.Fragment>
        );
    } else {
        return 'No games found...';
    }
}