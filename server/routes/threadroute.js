  import Threadmodel from '../models/threadmodel.js';
  import express from 'express';
  const router = express.Router();
  import multer from 'multer';
  import crypto from 'crypto';
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


  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });


  // router.post('/thread/posts', upload.single('image'), async (req, res) => {
  //   console.log("req.body", req.body);
  //   console.log("req.file", req.file);

  //   try {
  //     // Upload image to S3
  //     req.file.buffer;
  //     const params = {
  //       Bucket: bucketName,
  //       Key: randomImageName(),
  //       Body: req.file.buffer,
  //       ContentType: req.file.mimetype,
  //     };
  //     const command = new PutObjectCommand(params);
  //     await s3.send(command);

  //     // Create the image URL based on S3 configuration
  //     // const imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); 
  //     // Replace with your URL construction logic

  //     const { post } = req.body;
  //     const item = new Threadmodel({ post, image: { url: imageUrl } });
  //     const savedItem = await item.save();

  //     console.log('Image URL:', imageUrl);
  //     console.log('Saved item:', savedItem);

  //     res.status(201).json(savedItem);

  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Failed to create post.' });
  //   }
  // });
    



  // router.get('/thread/posts', async (req, res) => {
  //   try {
  //     const threads = await Threadmodel.find(); // Retrieve all posts
  //     const formattedThreads = threads.map((thread) => ({
  //       _id: thread._id,
  //       post: thread.post,
  //       imageUrl: thread.image?.url || null, // Use optional chaining and nullish coalescing (?.)
  //     }));

  //     // Fetch signed URLs for image URLs
  //     for (const thread of formattedThreads) {
  //       const getObjectParams = {
  //         Bucket: bucketName,
  //         Key: thread.imageUrl, // Replace with the correct property name (imageName)
  //       };
  //       const command = new GetObjectCommand(getObjectParams);
  //       const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  //       thread.imageUrl = url;
  //     }
  //     res.send('Posts fetched successfully');

  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Failed to fetch posts' });
  //   }
  // });

  // Create a separate function to handle S3 interactions
const handleS3Upload = async (file) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: randomImageName(),
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Construct the signed URL here
    const imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return params.Key;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to upload image to S3.');
  }
};

// POST route
router.post('/thread/posts', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = await handleS3Upload(req.file);
    const { post } = req.body;
    const item = new Threadmodel({ post, image: { url: imageUrl } });
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

// GET route
router.get('/thread/posts', async (req, res) => {
  try {
    const threads = await Threadmodel.find();
    const formattedThreads = threads.map((thread) => ({
      _id: thread._id,
      post: thread.post,
      imageUrl: thread.image?.url || null,
    }));

    // Fetch signed URLs in a more efficient way
    const getUrlPromises = formattedThreads.map(async (thread) => {
      if (thread.imageUrl) { // Only fetch if imageUrl exists
        const getObjectParams = {
          Bucket: bucketName,
          Key: thread.imageUrl,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { ...thread, imageUrl: url };
      } else {
        return thread;
      }
    });

    const formattedThreadsWithUrls = await Promise.all(getUrlPromises);
    res.send(formattedThreadsWithUrls);
  } catch (err) {
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
