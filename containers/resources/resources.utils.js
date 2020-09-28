import { flatten } from "lodash";
import { getBookTree } from '../explore/exploreTreeView';

export const addCheckForBookHeaders = (bookHeaders, check,newUuid) => {
    return bookHeaders.map(bookHeader => {
        if(newUuid){
            return { ...bookHeader, tree: addCheckForBookHeaders(bookHeader.tree || [], check,newUuid), isCheck: check,uuid:Math.random() }

        }
        return { ...bookHeader, tree: addCheckForBookHeaders(bookHeader.tree || [], check,newUuid), isCheck: check }
    })
}


export const getBooksInGroup = (groups, allGroups) => {
    return groups.reduce((groups, group) => {
        let removeResource = { booksId: [], groupIds: '' }
        removeResource.booksId = (group.books || []).reduce((books, book) => {
            if (!book.isCheck || allGroups) {
                books.push(book.bookId)
            }
            return books;
        }, [])
        if (!group.isCheck || allGroups) {
            removeResource.groupIds = group.groupId;
        }
        groups.push(removeResource)

        if (group.subGroups && group.subGroups.length) {
            groups = [...groups, ...flatten(getBooksInGroup(group.subGroups, allGroups))]

        }
        return groups
    }, [])

}

export const getBookInfo = async (bookId, state, cache) => {
    if (cache[bookId]) {
        return cache[bookId]
    }
    const res = await getBookTree([bookId]).then((res) => {
        return { ...res[0], tree: addCheckForBookHeaders(res[0].tree, state,true) }
    })

    return res;
}


export const getAllBooksFromGroups = (groups) => {
    return groups.reduce((resources, group) => {
        resources = [...resources, ...(group.books || []).reduce((books, book) => {
            if (book.isCheck) {
                books.push({ ...book, groupName: group.groupName, groupId: group.groupId })
            }

            return books;
        }, [])]

        if (group.subGroups && group.subGroups.length) {
            resources = [...resources, ...(getAllBooksFromGroups(group.subGroups))]

        }
        return resources;
    }, [])

}


export const addCheckForResources = (resources, check) => {
    return resources.map(resource => {
        const books = resource.books.map(book => {
            return { ...book, isCheck: check }
        })
        let subGroups = []
        if (resource.subGroups.length) {
            subGroups = addCheckForResources(resource.subGroups, check)
        }
        return { ...resource, books, subGroups, isCheck: check }
    })
}