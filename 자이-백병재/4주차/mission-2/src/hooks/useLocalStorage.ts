export const useLocalStorage = (key: string) => {
    const setItem = (value: unknown) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }catch (error) {
            console.error("Error setting item to localStorage", error);
        }
    };

    const getItem = () => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }catch (error) {
            console.error("Error getting item from localStorage", error);
            return null;
        }
    };
    const removeItem = () => {
        try {
            localStorage.removeItem(key);
        }catch (error) {
            console.error("Error removing item from localStorage", error);
        }
    };

    return { setItem, getItem, removeItem };
}