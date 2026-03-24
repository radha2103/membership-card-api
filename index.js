const express = require('express');
const { generateCard } = require('./cardGenerator');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/generate-card', async (req, res) => {
    const { phone, name, membership_id, epic_no, ac_no, constituency, photo_url } = req.body;

    if (!phone || !name) {
        return res.status(400).json({ error: 'phone and name are required' });
    }

    try {
        const imageUrl = await generateCard(
            phone, name, membership_id, epic_no, ac_no, constituency, photo_url
        );

        return res.json({
            success: true,
            url: imageUrl
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