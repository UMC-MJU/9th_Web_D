import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarPoint = ({ score }: { score: number }) => {
  const rating = score / 2;
  const stars = [];
  const roundedRating = Math.floor(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<FaStar key={i} color="gold" />);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<FaStarHalfAlt key={i} color="gold" />);
    } else {
      stars.push(<FaRegStar key={i} color="gold" />);
    }
  }

  return <div style={{ display: 'flex' }}>{stars}</div>;
};

export default StarPoint;