const satori = require('satori').default;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const fontRegular = fs.readFileSync(path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'));
const fontBold = fs.readFileSync(path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'));
const photoBase64 = fs.readFileSync(path.join(__dirname, 'fonts', 'user.png')).toString('base64');
// const logoBase64 = fs.readFileSync(path.join(__dirname, 'fonts', 'inc.png')).toString('base64');
const qrBase64 = fs.readFileSync(path.join(__dirname, 'fonts', 'qr.png')).toString('base64');
const logoBase64 = fs.readFileSync(path.join(__dirname, 'fonts', 'inc_logo.png')).toString('base64');


async function generateCard(phone, name, membership_id, epic_no, ac_no, constituency,photo_url) {
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
        width: 700, height: 400,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Roboto',
        borderRadius: 20,
        // borderWidth: 2,
        borderStyle: 'solid',
        // borderColor: 'white',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', height: 80, position: 'relative' },
            children: [
              // Stripes
              { type: 'div', props: { style: { flex: 1, backgroundColor: '#f37022', borderTopLeftRadius: 20, borderTopRightRadius: 20 } } },
              { type: 'div', props: { style: { flex: 1, backgroundColor: '#ffffff' } } },
              { type: 'div', props: { style: { flex: 1, backgroundColor: '#138808' } } },
              // Logo centered on top of stripes
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  children: [{
                    type: 'img',
                    props: {
                      src: `data:image/png;base64,${logoBase64}`,
                      style: { height: 71, width: 65 }
                    }
                  }]
                }
              }
            ]
          }
        },
        // Title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 22,
              fontWeight: 'bold',
              color: '#094d2c',
              paddingTop: 4,
              paddingBottom: 4,
              width: 700,
            },
            children: 'INDIAN NATIONAL CONGRESS'
          }
        },
        // Body
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flex: 1,
              paddingTop: 14, paddingBottom: 14,
              paddingLeft: 24, paddingRight: 24,
              gap: 20
            },
            children: [
              // Photo
              {
                type: 'img',
                props: {
                  src: photoSrc,
                  style: { width: 130, height: 160 }
                }
              },
              // Details
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
                  children: [
                    row('Name:', name),
                    rowBadge('Membership ID:', membership_id),
                    row('EPIC No:', epic_no),
                    row('Phone Number:', phone),
                    row('AC No:', ac_no),
                    row('Constituency:', constituency),
                  ]
                }
              },
              // QR code
              // {
              //   type: 'img',
              //   props: {
              //     src: `data:image/png;base64,${qrBase64}`,
              //     style: { width: 100, height: 100, alignSelf: 'flex-end' }
              //   }
              // }
            ]
          }
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              width: 700,
              textAlign: 'center', fontSize: 22,
              color: '#444444', paddingTop: 0, paddingBottom: 6,
            },
            children: 'Indian National Congress – Karnataka'
          }
        },
        // Bottom stripe
        { type: 'div', props: { style: { height: 20, backgroundColor: '#138808', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 } } },
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
  return pngBuffer;
}

function row(label, value) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 },
      children: [
        { type: 'div', props: { style: { color: '#1a5276', fontWeight: 'bold', minWidth: 130 }, children: label } },
        { type: 'div', props: { style: { color: '#222222' }, children: String(value || '') } },
      ]
    }
  };
}

function rowBadge(label, value) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 },
      children: [
        { type: 'div', props: { style: { color: '#1a5276', fontWeight: 'bold', minWidth: 130 }, children: label } },
        {
          type: 'div',
          props: {
            style: {
              backgroundColor: '#1a6b4a', color: '#ffffff',
              paddingTop: 2, paddingBottom: 2,
              paddingLeft: 10, paddingRight: 10,
              borderRadius: 4, fontWeight: 'bold',
            },
            children: String(value || '')
          }
        },
      ]
    }
  };
}

module.exports = { generateCard };