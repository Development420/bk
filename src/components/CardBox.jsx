import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  List,
  ListItem,
  Text,
  Link,
  Spacer,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  removeBookmarkDB,
  removeCategoryDB,
  renameCategoryDB,
  renameBookmarkDB,
} from "../Firebase/SDK";
import { IoMdDoneAll } from "react-icons/io";

const CardBox = ({ item, user }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [ctName, setCtName] = useState(item.name);
  const [isEdit, setIsEdit] = useState(false);

  const removeBookmark = (id) => {
    removeBookmarkDB({ uid: user.uid, cID: item.id, bID: id });
  };

  const removeCategory = () => {
    if (
      window.confirm(
        `Do you want to delete ${item.name} category! All bookmarks of this category will be deleted.`
      ) !== true
    )
      return;

    removeCategoryDB(user.uid, item.id);
    // console.log(item.id);
  };

  useEffect(() => {
    if (!item.bookmarks) return;

    const dataArr = Object.keys(item?.bookmarks).map((key) => ({
      ...item.bookmarks[key],
      id: key,
    }));

    setBookmarks(dataArr);
  }, []);

  const renameCategory = () => {
    renameCategoryDB(user.uid, item.id, ctName);

    setIsEdit(false);
  };

  if (!item.bookmarks) return;

  return (
    <Card m={"2"} rounded={4} overflow={"hidden"} minW={300} maxW={350}>
      <CardHeader
        p={1}
        display={"flex"}
        justifyContent={"space-between"}
        bgColor={"black"}
        color={"white"}
        rounded={"4px"}
      >
        {isEdit ? (
          <Input
            variant="flushed"
            value={ctName}
            onChange={(e) => setCtName(e.target.value)}
            placeholder="Please type new name!"
          />
        ) : (
          <Heading size={"sm"} ml={1}>
            {item.name}
          </Heading>
        )}

        <Box display={"flex"} alignItems={"center"}>
          {isEdit ? (
            <IoMdDoneAll
              style={{
                marginLeft: "10px",
                marginRight: "8px",
                color: "#f46a31",
              }}
              fontSize={"20px"}
              onClick={renameCategory}
            />
          ) : (
            <>
              <CiEdit fontSize={"22px"} onClick={() => setIsEdit(true)} />
              <MdDelete
                style={{ marginLeft: "5px", color: "#f46a31" }}
                fontSize={"20px"}
                onClick={removeCategory}
              />
            </>
          )}
        </Box>
      </CardHeader>

      <CardBody p={0}>
        <List spacing={3}>
          {bookmarks.map((bookmark, i) => (
            <SingleBookmark
              key={i}
              categoryId={item.id}
              bookmark={bookmark}
              removeBookmark={removeBookmark}
            />
          ))}
        </List>
      </CardBody>
    </Card>
  );
};

const SingleBookmark = ({ categoryId, bookmark, removeBookmark }) => {
  const renameBookmark = () => {
    renameBookmarkDB(categoryId, bookmark.id, "");
  };

  return (
    <ListItem
      style={{
        marginTop: "0px",
        borderBottom: "1px solid lightgray",
        padding: 2,
      }}
      display={"flex"}
      alignItems={"center"}
    >
      <Link
        href={bookmark.url}
        isExternal
        flex={1}
        display={"flex"}
        alignItems={"center"}
        style={{ textDecoration: "none" }}
      >
        <Box w={"12px"} mr={2} ml={2} mt={0.5}>
          <img src={bookmark.icon} alt="icon" height={"100%"} width={"100%"} />
        </Box>
        <Text fontSize={"sm"}>{bookmark.title}</Text>
        <Spacer />
      </Link>

      <CiEdit fontSize={"18px"} />
      <Box
        mr={2}
        ml={2}
        cursor={"pointer"}
        onClick={() => removeBookmark(bookmark.id)}
      >
        <MdDelete />
      </Box>
    </ListItem>
  );
};

export default CardBox;
