import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db } from "./firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { Box, Button, Modal, Input } from "@mui/material";
import ImageUpload from "./ImageUpload";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [SignIn, setSignIn] = useState(false);

  useEffect(() => {
    const colref = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    return onSnapshot(colref, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const auth = getAuth();

  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, Email, Password).catch((error) => {
      alert(error.code);
      alert(error.message);
    });
    setOpen(false);
  };
  const signIn = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, Email, Password).catch((error) => {
      alert(error.code);
      alert(error.message);
    });
    setSignIn(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        //user has logged in
        // console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //don't update username
        } else {
          //if we just created someone's username
          return updateProfile(authUser, {
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username, auth]);

  return (
    <div className="app">
      <div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <form className="app_signUp">
              <center>
                <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
                  alt=""
                />
              </center>

              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="text"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                SIGN UP
              </Button>
            </form>
          </Box>
        </Modal>

        <Modal open={SignIn} onClose={() => setSignIn(false)}>
          <Box sx={style}>
            <form className="app_signIn">
              <center>
                <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
                  alt=""
                />
              </center>

              <Input
                placeholder="Email"
                type="text"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                SignIN
              </Button>
            </form>
          </Box>
        </Modal>
      </div>

      <div className="app-header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
          alt=""
        />
        {user ? (
          <Button
            onClick={() => {
              signOut(auth);
            }}
          >
            logout
          </Button>
        ) : (
          <div>
            <Button onClick={() => setSignIn(true)}>SIGN IN </Button>
            <Button onClick={() => setOpen(true)}>SIGN UP </Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imageurl={post.imageUrl}
          />
        ))}
      </div>

      {user?.displayName ? <ImageUpload username={user.displayName} /> : ""}
    </div>
  );
}

export default App;
