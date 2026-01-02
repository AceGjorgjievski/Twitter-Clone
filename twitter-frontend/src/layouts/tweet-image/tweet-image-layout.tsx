import SingleImage from "./single-image";
import ThreeOrMoreImages from "./three-or-more-images";
import TwoImages from "./two-images";


type Props = {
    images: string[];
    tweetId: number | string;
    onImageClick: () => void;
}

export default function TweetImageLayout({ images, tweetId, onImageClick }: Props) {
  const imageCount = images.length;

  if (imageCount === 0) return null;


  switch (imageCount) {
    case 1:
      return <SingleImage images={images} onImageClick={onImageClick}/>;
    case 2:
      return <TwoImages images={images} tweetId={tweetId} onImageClick={onImageClick}/>;
    default:
      return <ThreeOrMoreImages images={images} onImageClick={onImageClick}/>;
  }
}
