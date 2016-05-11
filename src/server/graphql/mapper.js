
export function mapToInternalType(typeName) {
  const PhotoType = require('./types/photo.js');
  const PhotoInfo = require('./types/photoInfo.js');
  const PhotoOwner = require('./types/photoowner.js');
  const PhotoSize = require('./types/photoSize.js');
  const CameraType = require('./types/camera.js');
  const User = require('./types/user.js');

  switch (typeName) {
    case 'photo':
      return PhotoType;

    case 'owner':
      return PhotoOwner;

    case 'info':
      return PhotoInfo;

    case 'camera':
      return CameraType;

    case 'size':
      return PhotoSize;

    case 'user':
      return User;

    default:
      throw new Error(`Cannot find internal type with given name: ${typeName}`);
  }
}
