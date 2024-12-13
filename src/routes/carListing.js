import express from 'express';
import CarListing from '../models/CarListing.js';
import { uploadToS3, upload } from '../middlewares/multer.js';
import { uploadFileToS3 } from '../utills/functions.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', upload.array('images', 10), uploadToS3, async (req, res) => {
    try {
        const { carModel, price, phone, city } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const files = req.files;
        const imageUrls = await Promise.all(files.map(uploadFileToS3));
        const carListing = new CarListing({
            userId,
            carModel,
            price: Number(price),
            phone,
            city,
            images: imageUrls
        });

        await carListing.save();
        res.status(201).json(carListing);
    } catch (error) {
        console.log(error)

        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
console.log(userId,'userId')
        const carListings = await CarListing.find({ userId: userId });
        res.status(200).json(carListings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
