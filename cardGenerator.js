require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const satori = require('satori').default;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const fontRegular = fs.readFileSync(path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'));
const fontBold = fs.readFileSync(path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'));
const photoBase64 = fs.readFileSync(path.join(__dirname, 'fonts', 'user.png')).toString('base64');
const bgBase64 = fs.readFileSync(path.join(__dirname, 'fonts', 'bg.png')).toString('base64');

async function generateCard(name, booth, voter_id, ward_name, state, valid_from, photo_url) {
  let photoSrc = `data:image/png;base64,${photoBase64}`;
  if (photo_url) {
    const response = await fetch(photo_url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mime = response.headers.get('content-type') || 'image/jpeg';
    photoSrc = `data:${mime};base64,${base64}`;
  }

  const element = {
    type: 'div',
    props: {
      style: {
        width: 700,
        height: 430,
        display: 'flex',
        position: 'relative',
        fontFamily: 'Roboto',
        
      },
      children: [
        // ── BACKGROUND IMAGE (full card) ──
        {
          type: 'img',
          props: {
            src: `data:image/png;base64,${bgBase64}`,
            style: {
              position: 'absolute',
              top: 0, left: 0,
              width: 700, height: 430,
            }
          }
        },

        // ── OVERLAY: Photo + Details ──
        // top: 168 = below header+badge area; bottom: 90 = above footer
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 135,
              left: 40,
              right: 20,
              bottom: 90,
              display: 'flex',
              flexDirection: 'row',
              gap: 24,
              alignItems: 'flex-start',
            },
            children: [
              // Photo
              {
                type: 'img',
                props: {
                  src: photoSrc,
                  style: {
                    width: 140,
                    height: 170,
                    objectFit: 'cover',
                    borderRadius: 4,
                    border: '2px solid #cccccc',
                    marginLeft:40,
                    top:15,
                  }
                }
              },

              // Details column
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    flex: 1,
                    paddingTop: 5,
                    marginLeft:20,
                  },
                  children: [
                    // Name
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 30,
                          fontWeight: 'bold',
                          color: '#0e3970',
                          marginBottom: 1,
                        },
                        children: (name || '').toUpperCase()
                      }
                    },
                    detailRow('Booth No', booth || ''),
                    detailRow('Voter Id No', voter_id || ''),
                    detailRow('Ward Name', ward_name || ''),
                    detailRow('State', state),
                    detailRow('Valid From', valid_from || ''),
                  ]
                }
              },
            ]
          }
        },
      ]
    }
  };

  const svg = await satori(element, {
    width: 700,
    height: 430,
    fonts: [
      { name: 'Roboto', data: fontRegular, weight: 400 },
      { name: 'Roboto', data: fontBold, weight: 700 },
    ],
  });

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  const imageUrl = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'cards' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    ).end(pngBuffer);
  });

  return imageUrl;
}

function detailRow(label, value) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 16,
        gap: 0,
      },
      children: [
        {
          type: 'div',
          props: {
            style: { color: '#333333', minWidth: 105 },
            children: label
          }
        },
        {
          type: 'div',
          props: {
            style: { color: '#222222', fontWeight: 'bold' },
            children: `:  ${String(value)}`
          }
        },
      ]
    }
  };
}

module.exports = { generateCard };