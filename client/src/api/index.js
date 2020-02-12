import axios from 'axios';

export const checkToken = async () => {
    return axios.get('/checkToken')
        .then(res => {
            if (res.status === 200) {
                return { success: true, data: "User logged in", id: res.data.data };
            } else {
                throw new Error('User not logged in. Some problems appear.');
            }
        })
        .catch(err => {
            return { success: false, data: err };
        })
}

export const registerUser = async (name, password) => {
    const { data } = await axios.post('/api/register', {
        name: name,
        password: password
    })
    return data;
}

export const loginUser = async (name, password) => {
    return axios.post('/api/authenticate', { name, password })
        .then(response => {
            if (response.status === 200) {
                return { success: true, data: 'Account logged in succesfully.' }
            }
        })
        .catch(err => {
            return { success: false, data: err.data }
        });
}

export const addGameToList = async (gid, gname, legacy) => {
    const { data } = await axios.post('/api/add-game',
        {
            gid: gid,
            gname: gname,
            legacy: legacy
        },
        {
            headers: {
                'Authorization': sessionStorage.getItem('_id')
            }
        })
    return data;
}

export const fetchSuccessMessage = async () => {
    const { data } = await axios.get('/api/welcome-message', {
        headers: {
            'Authorization': sessionStorage.getItem('_id')
        }
    })
    return data;
}

export const setSuccessMessage = async (text) => {
    const { data } = await axios.post('/api/welcome-message',
        {
            message: text
        },
        {
            headers: {
                'Authorization': sessionStorage.getItem('_id')
            }
        })
    return data;
}

export const addFolderToList = async (gid, dirname, legacy) => {
    const { data } = await axios.post('/api/add-folder',
        {
            dirlink: gid,
            dirname: dirname,
            legacy: legacy
        },
        {
            headers: {
                'Authorization': sessionStorage.getItem('_id')
            }
        })
    return data;
}

export const fetchGameList = async () => {
    const { data } = await axios.get('/api/gamelist', {
        headers: {
            'Authorization': sessionStorage.getItem('_id')
        }
    })
    return data;
}

export const deleteEntriesFromList = async (i, folder) => {
    const { data } = await axios.post('/api/gamelist',
        {
            index: i,
            deletefolder: folder
        }
    );
    return data;
}