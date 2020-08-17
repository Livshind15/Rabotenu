import * as React from 'react';

export const RabotenuContext = React.createContext();

export const RabotenuProvider = ({ children }) => {
    const [title, setTitle] = React.useState('');
    const [booksIds, setBooksIds] = React.useState([]);
    const [showBack, setShowBack] = React.useState({enable:false,navigator:null});
    const setBooks = (books) => {
        setBooksIds([...booksIds, ...books.reduce((books, book) => {
            if (!booksIds.includes(book)) {
                books.push(book)
            }
            return books
        }, [])])
    }
    return (
        <RabotenuContext.Provider value={{ title, setTitle,showBack, setShowBack, booksIds, setBooksIds:setBooks }}>
            {children}
        </RabotenuContext.Provider>
    )
}



