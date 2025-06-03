import { Link, useLocation } from "react-router-dom";
import style from "./MovieList.module.css";

const MovieList = ({ collection }) => {
  console.log(" collection", collection);
  const location = useLocation();
  return (
    <ul className={style.content}>
      {collection.map(({ id, title }, index) => (
        <li className={style.item} key={index}>
          <Link to={`/movies/${id}`} className={style.link} state={location}>
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MovieList;
