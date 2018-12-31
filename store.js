const { Storage } = require('@google-cloud/storage');

const BUCKET_NAME = 'static.mustread.tech'

const storage = new Storage({ projectId: 'mustread-tech' }) 
const bucket = storage.bucket(BUCKET_NAME)

const saveFile = async (name, content, contentType) => {
  const file = bucket.file(name)
  await file.save(content)
  await file.setMetadata({ cacheControl: 'no-cache', contentType: contentType, contentDisposition: `inline; filename="${name}"` })
  await file.makePublic() 
}

module.exports = async (stats, rss) => {

  const bucketExists = await bucket.exists()
  if (!bucketExists) {
    await bucket.create()
  }

  await bucket.setMetadata({
    cors: [
      {
        origin: ['*'],
        method: ['*'],
        responseHeader: ["Content-Type"],
        maxAgeSeconds: 3600
      }
    ]
  })

  await saveFile('stats.json', stats, 'application/json')
  await saveFile('rss.xml', rss, 'application/xml')
}