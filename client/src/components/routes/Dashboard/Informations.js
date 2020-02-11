import React from 'react'

export const Informations = ({ id, repoURL }) => {
    return (
        <div>
            <h3>How to setup it properly:</h3>
            <ol>
                <li>Press <code>X</code> on file Browser on Tinfoil.</li>
                <li>Copy this link on configuration window:
                    <code style={{ marginLeft: 10, fontSize: 16 }}>
                        {
                            repoURL.indexOf('bit.ly') !== -1
                                ? repoURL
                                : repoURL + id}
                    </code>
                </li>
                <li>Press save and enjoy Tinson 🤖 </li>
            </ol>
        </div>
    )
}
export default Informations