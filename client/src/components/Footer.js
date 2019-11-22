import React from 'react'
import { Typography, Icon } from '@material-ui/core'
import kofi from '../assets/ko-fi-logo.png'; // with import

export default function Footer() {
    return (
        <div className="footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography type="body2" style={{ display: "flex", alignItems: "center" }}>
                Made with <Icon style={{ marginLeft: 3, marginRight: 3 }}>favorite_border</Icon> in Italy
            </Typography>
            <div className="buttons-container" style={{ display: "flex", alignItems: "center" }}>
                <a className="ko-fi_button" href='https://ko-fi.com/L3L318MYF'>
                    <img alt="Logo di ko-fi" src={kofi}></img>
                    Help me maintain server on Ko-fi</a>
                <iframe src="https://ghbtns.com/github-btn.html?user=gianemi2&repo=tinson-node&type=star&size=large" frameBorder="0" scrolling="0" width="100px" height="30px" title="Star Tinson node by Gianemi2 on Github"></iframe>
                <iframe src="https://ghbtns.com/github-btn.html?user=gianemi2&type=follow&size=large" frameBorder="0" scrolling="0" width="182px" height="30px" title="Follow Gianemi2 on Github"></iframe>
            </div>
        </div>
    )
}
