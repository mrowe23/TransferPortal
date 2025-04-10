import React from 'react';
import { TransferMatrix } from './transferMatrix/transferMatrix';
import { createTheme, ThemeProvider } from '@mui/material';

const App: React.FC = () => {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark', // Enable dark mode
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
        <div>
            <TransferMatrix />
        </div>
        </ThemeProvider>
    );
};

export default App;