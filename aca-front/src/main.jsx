import * as React from 'react';
import {createRoot} from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {TourProvider} from '@reactour/tour'
import {stepsUpload} from "./step";

//const BASE_URL = 'http://msa.mephi.ru/api/v3'
const BASE_URL = 'http://localhost:8000/api/v3'
//const BASE_URL = 'http://10.164.5.118:8099/api/v3'
//const BASE_URL = 'https://c3ab-79-139-147-67.ngrok-free.app/api/v3'
//const BASE_URL = '/api/v3'
const container = document.getElementById("root");
const root = createRoot(container)
const radius = 10
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <TourProvider scrollSmooth styles={{
                popover: (base) => ({
                    ...base,
                    '--reactour-accent': '#4FB3EAFF',
                    borderRadius: radius,
                }),
                maskArea: (base) => ({ ...base, rx: radius }),
                maskWrapper: (base) => ({ ...base, color: 'rgba(31,101,136,0.67)' }),
                badge: (base) => ({ ...base, left: 'auto', right: '-0.8125em' }),
                controls: (base) => ({ ...base, marginTop: 30 }),
                close: (base) => ({ ...base, right: 'auto', left: 10, top: 10 }),
            }}  steps={stepsUpload}>
                <App url={BASE_URL}/>
            </TourProvider>
        </BrowserRouter>
    </React.StrictMode>)






