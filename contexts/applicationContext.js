import * as React from 'react';

export const RabotenuContext = React.createContext();

export const RabotenuProvider = ({ children }) => {
    const [title, setTitle] = React.useState('')
    return (
        <RabotenuContext.Provider value={{title, setTitle}}>
            {children}
        </RabotenuContext.Provider>
    )
}



