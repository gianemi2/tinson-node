import React from 'react'
import { Redirect } from 'react-router-dom'

export default function Logout() {
    sessionStorage.removeItem('_id');
    return (
        <Redirect to="/login"></Redirect>
    )
}
