import React from 'react'
import { Redirect } from 'react-router-dom'

export default function Logout() {
    document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    return (
        <Redirect to="/login"></Redirect>
    )
}
