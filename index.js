const express = require('express');
const { generateCard } = require('./cardGenerator');
const sharp = require('sharp');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/generate-card', async (req, res) => {
    console.log('Request body:', req.body);
    const { phone, name, membership_id, epic_no, ac_no, constituency } = req.body;

    if (!phone || !name) {
        return res.status(400).json({ error: 'phone and name are required' });
    }

    try {
        // const imageBuffer = await generateCard({
        //   phone, name, membership_id, epic_no, ac_no, constituency, photo_url
        // });

        // res.set('Content-Type', 'image/png');
        // return res.send(imageBuffer);
        const imageBuffer = await generateCard(phone, name, membership_id, epic_no, ac_no, constituency);
        const resized = await sharp(imageBuffer).resize(300).toBuffer();
        res.set('Content-Type', 'image/png');
        return res.send(resized);

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Something went wrong', detail: err.message });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});



















// const satori = require('satori').default;
// const sharp = require('sharp');
// const fs = require('fs');
// const path = require('path');

// const fontRegular = fs.readFileSync(path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'));
// const fontBold    = fs.readFileSync(path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'));
// const photoBase64 = fs.readFileSync(path.join(__dirname, 'fonts', 'user.webp')).toString('base64');
// const logoBase64  = fs.readFileSync(path.join(__dirname, 'fonts', 'Indian_National_Congress_Flag.svg.png')).toString('base64');
// async function generateCard(member) {
//   const element = {
//     type: 'div',
//     props: {
//       style: {
//         width: 700, height: 430,
//         backgroundColor: '#ffffff',
//         display: 'flex',
//         fontFamily: 'Roboto',
//       },
//       children: [
//         {
//           type: 'div',
//           props: {
//             style: { fontSize: 20, color: '#000000' },
//             children: member.name
//           }
//         }
//       ]
//     }
//   };

//   const svg = await satori(element, {
//     width: 700,
//     height: 430,
//     fonts: [
//       { name: 'Roboto', data: fontRegular, weight: 400 },
//     ],
//   });

//   const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
//   return pngBuffer;
// }

// module.exports = { generateCard };
