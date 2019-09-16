import React, { useState, useEffect } from 'react'
import { Grid, FormControl, TextField, Button } from '@material-ui/core'

import { fetchSuccessMessage, setSuccessMessage } from '../../../api'

export default function SetSuccessMessage() {
    const [message, setMessage] = useState('');
    const [placeholderMessage, setPlaceholderMessage] = useState('');

    useEffect(() => {
        fetchSuccessMessage()
            .then(({ data }) => setPlaceholderMessage(data.success))
            .catch(() => console.log('Si è verificato un errore'))
    }, [placeholderMessage])

    const handleChange = ({ target }) => {
        setMessage(target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage(message);
        setPlaceholderMessage(message);
        setMessage('');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid
                    container
                    justify="flex-start"
                    alignItems="flex-end"
                >
                    <FormControl style={{ marginRight: 10, flex: 1 }}>
                        <TextField
                            name="message"
                            label="Welcome message for Tinfoil users"
                            value={message}
                            placeholder={placeholderMessage}
                            onChange={handleChange}
                            margin="normal"
                            type="text"
                        />
                    </FormControl>
                    <Button type="submit" style={{ marginBottom: 8 }} variant="contained" color="primary">Save success message</Button>
                </Grid>
            </form>
        </div>
    )
}
