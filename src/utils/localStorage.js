export const loadState = (key) => {
     try {
        const serializedState = localStorage.getItem(key)
        if (!serializedState) return undefined;
        return JSON.parse(serializedState)
     } catch (error) {
        console.error("Error loading state: ", error)
        return undefined
     }
}

export const saveState = (key, state) => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem(key, serializedState)
    } catch (error) {
        console.error("Error saving state: ", error)
    }
}