import React, {useState} from 'react';
import {Button} from "@mui/material";
import {db} from './firebase';
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import "./imageUpload.css";
function ImageUpload({username}) {
    
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')

    const handlechange = (e) =>{
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    const handleUpload = () => {
        const storage = getStorage();

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'images/' + image.name);
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setProgress(progress);
        }, 
        (error) => {
            alert(error.message);
        }, 
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                addDoc (collection(db, 'posts'), {
                    timestamp: serverTimestamp(),
                    caption: caption,
                    imageUrl: downloadURL,
                    username: username
                });
                setProgress(0);
                setCaption("");
                setImage(null);
            });

        }
        );
    }

    return (
        <div className="imageupload">
            <progress className="imageupload_progress" value={progress} max="100"/>
            <input 
                type="text" placeholder='Enter a caption...' 
                onChange={event => setCaption(event.target.value)} 
                value={caption}
            />
            <input 
                type="file" onChange={handlechange}
            />
            <Button onClick={handleUpload}>upload</Button>
        </div>
    )
}

export default ImageUpload