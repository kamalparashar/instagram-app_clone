import { useState, useEffect } from 'react';
import './Post.css'
import { Avatar, Button } from '@mui/material'
import { collection, onSnapshot, addDoc,} from 'firebase/firestore';
import {db} from './firebase';

function Post({postId,user,username,caption,imageurl}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if(postId) {
      unsubscribe=onSnapshot( collection(db,'posts',postId, 'comments'),
      (snapshot) => {
        setComments(snapshot.docs.map(doc => ({
          id: doc.id,
          com: doc.data()
        })))});
      }
        
      return () => {
        unsubscribe();
      }
  }, [postId]);
  

  const postComment = (event) => {
      event.preventDefault();
      addDoc(collection(db, 'posts',postId,'comments'), {
        text: comment,
        username: user.displayName
      })
      setComment('');
  }

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt= "Kamalparashar"
          src="https://tse4.mm.bing.net/th?id=OIP.R5eQvNx94-2cvbtf_Xz63QHaHa&pid=Api&P=0&w=155&h=155"
        />
      <h3>{username}</h3>
      </div>
      
      <img 
        className = "post_image" 
        src = {imageurl}
        alt = ""
      />
      
      <h4 className = "post_text">
        <strong>{username} </strong>{caption} 
      </h4>

      <div className="post_comments">
        {comments && comments.map((comment) => (
         
          <p key={comment.id}>
            <strong>{comment.com.username}</strong> {comment.com.text}
          </p>
          
        ))}
      </div>
      
      {user ? (
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            disabled={!comment} className="post_button"
            type="submit" onClick={postComment}
          >
            Post
          </Button>
        </form>
      ) : ('')
      }  
    </div>
  )
}

export default Post;