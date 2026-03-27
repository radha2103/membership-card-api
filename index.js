const express = require('express');
const { generateCard } = require('./cardGenerator');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/generate-card', async (req, res) => {
    const { name, booth, voter_id, ward_name, state, valid_from, photo_url,qr_url } = req.body;

    

    try {
        const imageUrl = await generateCard(
            name, booth, voter_id, ward_name, state, valid_from, photo_url,qr_url
        );

        return res.json({
            imageUrl
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            error: 'Something went wrong',
            detail: err.message
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});