self.addEventListener('message', async event => {
    const imageURL = event.data

    const response = await fetch(imageURL)
    let jsonObj = await response.json()

    self.postMessage({
      imageURL: imageURL,
      res: jsonObj
    })
  })