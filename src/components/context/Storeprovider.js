import { createContext, useEffect, useState } from "react";
import { addBookmarkDB, addCategoryDB, db, objName } from "../../Firebase/SDK";
import { onValue, ref } from "firebase/database";

export const AppStore = createContext();

export const StoreProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  // const [categories, setCategories] = useState([]);

  const handleUser = (user) => {
    setUser(user);
    localStorage.setItem("bookmarkUser", null);
    window.location.reload();
  };

  const addcategory = (value) => {
    addCategoryDB(value);
    // setCategories([...categories, { id, name: value }]);
  };

  // console.log(categories);
  const addBookmark = (value) => {
    // const id = addBookmarkDB(value);
    addBookmarkDB(value);
    // setItems([...items, { id, ...value }]);
  };

  // const addItems = (value) => {
  //   setItems([...items, value]);
  // };

  useEffect(() => {
    const user = localStorage.getItem("bookmarkUser");

    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    onValue(ref(db, objName), (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setItems([]);
        return;
      }
      const dataArr = Object.keys(data).map((key) => ({
        ...data[key],
        id: key,
      }));
      setItems(dataArr);
    });
  }, []);

  return (
    <AppStore.Provider
      value={{ items, addBookmark, addcategory, user, handleUser }}
    >
      {children}
    </AppStore.Provider>
  );
};
