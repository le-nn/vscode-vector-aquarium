import * as ReactDOM from 'react-dom';
import * as React from "react"
import { Global, css } from '@emotion/react'
import { Main } from './Main';

const styles = css`
body, html {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow-y: hidden;
    padding: 0;
}

#app{
    width: 100%;
    height: 100%;
    min-width: 180px;
    overflow-y: 0;
}
`;

ReactDOM.render(
    <>
        <Global styles={styles} />
        <Main />
    </>,
    document.getElementById('app')
);

