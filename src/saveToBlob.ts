// direct send to vercel/blob doesn't work

// import axios from 'axios'
// import crypto from 'crypto'

// export function generateSHA1(buffer: Buffer) {
//   return crypto.createHash('sha1').update(buffer).digest('hex')
// }

// export const uploadToVercel = async (screenshotBuffer: Buffer, digest: string) => {
//   try {
//     const uploadResponse = await axios.post(
//       'https://api.vercel.com/v2/now/files',
//       [
//         {
//           file: screenshotBuffer.toString('base64'),
//           name: 'resume.png',
//           digest
//         }
//       ],
//       {
//         headers: {
//           Authorization: `Bearer Am8fzk393wNIaz2ekaAoKF0S`,
//           'Content-Type': 'application/json'
//         }
//       }
//     )

//     console.log(uploadResponse.data)
//     return uploadResponse.data

//     // Handle the upload response
//     // The uploadResponse.data will contain information about the uploaded file, such as the URL
//     console.log('Upload successful:', uploadResponse.data)
//   } catch (error) {
//     console.error('Error uploading to Vercel:', error)
//   }
// }
