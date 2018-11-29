export default function getFramePromise (source, currentTime) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = source
    video.volume = 0
    video.setAttribute('crossOrigin', 'anonymous')

    play(video).then(seek(currentTime)).then(video => resolve(captureFrame(video)))
  })
}

let play = video => {
  return new Promise((resolve, reject) => {
    let onCanPlay = () => {
      video.removeEventListener('canplay', onCanPlay)
      resolve(video)
    }
    video.addEventListener('canplay', onCanPlay)
    video.play()
  })
}

let seek = currentTime => video => {
  return new Promise((resolve, reject) => {
    let onSeeked = () => {
      video.removeEventListener('seeked', onSeeked)
      resolve(video)
    }
    video.addEventListener('seeked', onSeeked)
    video.currentTime = currentTime
  })
}

let captureFrame = video => {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth * 0.15
  canvas.height = video.videoHeight * 0.15
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataUri = canvas.toDataURL('image/png')
  video.pause()
  return dataUri

  // const data = dataUri.split(',')[1]
  // return Buffer.from(data, 'base64')
}
