import Threadmodel from '../models/threadmodel.js';
import express from 'express';
const router = express.Router();
import multer from 'multer';
import crypto from 'crypto'
import path from 'path';
import url from 'url';
import { S3Client, PutObjectCommand, GetObjectCommand, } from "@aws-sdk/client-s3"
import { getSignedUrl, } from "@aws-sdk/s3-request-presigner";

import dotenv from 'dotenv'
dotenv.config()

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
});

// function fullUrl(req) {
//   return url.format({
//     protocol: req.protocol,
//     host: req.get('host'),
//     pathname: req.originalUrl
//   });
// }

// // Set up multer for handling image uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'Images/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//   },
// });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create
// ...

// router.post('/thread', upload.single('image'), async (req, res) => {
//   try {
//     const { post } = req.body;

//     // Generate and store image URL
//     const imageUrl = req.protocol + '://' + req.get('host') + '/Images/' + req.file.filename; // For URL storage

//     const item = new Threadmodel({ post, image: { url: imageUrl } });
//     const savedItem = await item.save();

//     console.log('Image URL:', imageUrl);

//     res.status(201).json(savedItem);
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).json({ error: 'Failed to create post. Please try again.' }); // Informative message for the user
//   }
// });


router.post('/thread/posts', upload.single('image'), async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);

  try {
    // Upload image to S3
    req.file.buffer;
    const params = {
      Bucket: bucketName,
      Key: randomImageName(),
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Create the image URL based on S3 configuration
    const imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // Replace with your URL construction logic

    // Create and save the Threadmodel instance
    const newThread = new Threadmodel({
      post: req.body.post,
      image: {
        url: imageUrl,
        // Add other relevant image metadata as needed
      },
      // Add other fields as required by your schema
    });
    await newThread.save();

    res.send(newThread); // Or send a success response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});
  





// Read
// router.get('/thread/:filename', async (req, res) => {
//   try {
//     console.log(fullUrl(req));
//     const threads = await Threadmodel.find(); // Retrieve all posts
//     const formattedThreads = threads.map((thread) => ({
//       _id: thread._id,
//       post: thread.post,
//       imageUrl: thread.image ? thread.image.url : null, // Use thread.image.url if thread.image is not undefined, otherwise use null
//     }));
//     res.json(formattedThreads);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch posts' });
//   }
// });

router.get('/thread/post', async (req, res) => {
  try {
    const threads = await Threadmodel.find(); // Retrieve all posts
    const formattedThreads = threads.map((thread) => ({
      _id: thread._id,
      post: thread.post,
      imageUrl: thread.image?.url || null, // Use optional chaining and nullish coalescing (?.)
    }));
    for (thread of formattedThreads) {
      const getObjectParams ={
        Bucket: bucketName,
        Key: thread.imageName
      }
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      thread.imageUrl = url;
    }
    res.send(formattedThreads)
      res.json(formattedThreads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Update
router.put('/thread/:id', async (req, res) => {
  try {
    const updatedItem = await Threadmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/thread/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Threadmodel.findByIdAndDelete(id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
