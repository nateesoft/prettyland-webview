import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImagePreview = ({ navigation, route }) => {
  const { index, images } = route.params;
  return <ImageViewer index={index} imageUrls={images} />;
};

export default ImagePreview;
