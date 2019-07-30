import axios from 'axios';

export const userExists = async () => {
    const { data } = await axios.post('/api/exists', {
        _id: sessionStorage.getItem('_id')
    })
    return data;
}

export const registerUser = async (name, password) => {
    const { data } = await axios.post('/api/register', {
        name: name,
        password: password
    })
    return data;
}

export const loginUser = async (name, password) => {
    const { data } = await axios.post('/api/login', {
        name: name,
        password: password
    })
    return data;
}

export const addGameToList = async (gid, gname) => {
    const { data } = await axios.post('/api/add-game',
        {
            gid: gid,
            gname: gname
        },
        {
            headers: {
                'Authorization': sessionStorage.getItem('_id')
            }
        })
    return data;
}

export const addFolderToList = async (dirlink, dirname) => {
    const { data } = await axios.post('/api/add-folder',
        {
            dirlink: dirlink,
            dirname: dirname
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
        },
        {
            headers: {
                'Authorization': sessionStorage.getItem('_id')
            }
        }
    );
    return data;
}