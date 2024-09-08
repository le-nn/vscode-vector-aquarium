import * as ReactDOM from 'react-dom';
import * as React from "react"
import { Main } from './Main';

const styles = `
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
        <style>{styles}</style>
        <Main />
    </>,
    document.getElementById('app')
);

