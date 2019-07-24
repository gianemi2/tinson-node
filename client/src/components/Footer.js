import React from 'react'
import { Typography, Icon } from '@material-ui/core'

export default function Footer() {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography type="body2" style={{ display: "flex", alignItems: "center" }}>
                Made with <Icon style={{ marginLeft: 3, marginRight: 3 }}>favorite_border</Icon> in Italy
            </Typography>
            <div>
                <iframe src="https://ghbtns.com/github-btn.html?user=gianemi2&repo=tinson-node&type=star&size=large" frameBorder="0" scrolling="0" width="100px" height="30px" title="Star Tinson node by Gianemi2 on Github"></iframe>
                <iframe src="https://ghbtns.com/github-btn.html?user=gianemi2&type=follow&size=large" frameBorder="0" scrolling="0" width="182px" height="30px" title="Follow Gianemi2 on Github"></iframe>
            </div>
        </div>
    )
}
