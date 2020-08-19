import * as React from 'react';

export const RabotenuContext = React.createContext();

export const RabotenuProvider = ({ children }) => {
    const [title, setTitle] = React.useState('');
    const [booksIds, setBooksIds] = React.useState([]);
    const [textSize, setTextSide] = React.useState(0.15);
    
    const [grammar, setGrammar] = React.useState(false);
    const [exegesis, setExegesis] = React.useState(false);
    const [punctuation, setPunctuation] = React.useState(false);

    const [copyTitle, setCopyTitle] = React.useState({enable:false,position:0});
    const [godReplace,setGodReplace] = React.useState('יהוה');

    const [flavors, setFlavors] = React.useState(true);
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
        <RabotenuContext.Provider value={{ copyTitle,setCopyTitle,setGodReplace,godReplace,title,textSize, setTextSide,grammar,exegesis,punctuation,flavors, setFlavors, setPunctuation, setExegesis, setGrammar, setTitle,showBack, setShowBack, booksIds, setBooksIds:setBooks }}>
            {children}
        </RabotenuContext.Provider>
    )
}



