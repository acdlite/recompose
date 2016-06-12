// Default transform is identity function
let transform = t => t

export const getTransform = () => transform

const configureObservable = newTransform => {
  transform = newTransform
}

export default configureObservable
