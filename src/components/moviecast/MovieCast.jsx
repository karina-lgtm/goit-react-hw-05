import { useParams } from "react-router-dom";
import style from "./MovieCast.module.css";
import { useEffect, useState } from "react";
import { fetchCreditsForMovie, fetchImgMoviePath } from "../../api/api";

const MovieCast = () => {
  const { movieId } = useParams();
  const [credits, setCredits] = useState(null);
  const [castImg, setCastImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posterUrl, setPosterUrl] = useState(null);

  const defaultImg =
    "https://dl-media.viber.com/10/share/2/long/vibes/icon/image/0x0/95e0/5688fdffb84ff8bed4240bcf3ec5ac81ce591d9fa9558a3a968c630eaba195e0.jpg";

  useEffect(() => {
    async function fetchMovieReviews() {
      try {
        setLoading(true);

        const [detailsCast, castImgPath] = await Promise.all([
          fetchCreditsForMovie(movieId),
          fetchImgMoviePath(),
        ]);
        setCredits(detailsCast.data.credits.cast);
        setCastImg(castImgPath.data.images);
      } catch (error) {
        console.log(" error", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovieReviews();
  }, [movieId]);
  useEffect(() => {
    if (credits) {
      const posterSize = "w200";
      const url = `${castImg.secure_base_url}${posterSize}`;

      return setPosterUrl(url);
    }
  }, [credits, castImg]);

  return (
    <div className={style.container}>
      {loading ? (
        <strong>Loading posts...</strong>
      ) : (
        <ul className={style.list}>
          {credits && credits.length > 0 ? (
            credits.map(({ id, name, character, profile_path }) => {
              return (
                <li key={id} className={style.item}>
                  <div className={style.blockImage}>
                    <h3 className={style.title}>{name}</h3>
                    <p className={style.text}>Character: {character}</p>
                  </div>
                  <img
                    src={
                      profile_path !== null
                        ? `${posterUrl}${profile_path}`
                        : defaultImg
                    }
                    alt={name}
                    width={250}
                  />
                </li>
              );
            })
          ) : (
            <strong>We don't have any reviews for this movie</strong>
          )}
        </ul>
      )}
    </div>
  );
};

export default MovieCast;
