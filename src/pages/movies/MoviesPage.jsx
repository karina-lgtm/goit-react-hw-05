import { Field, Form, Formik } from "formik";
import style from "./MoviesPage.module.css";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { fetchMovies } from "../../api/api";
import MovieList from "../../components/movilist/MovieList";
import { useSearchParams } from "react-router-dom";

const searchValueSchema = Yup.object().shape({
  search: Yup.string()
    .min(3, "Min 3 chars")
    .max(30, "Max 30 chars")
    .required("This is a required field"),
});

const MoviesPage = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const handlerSubmit = (value) => {
    const newQuery = value.search;
    const nextSearchParams = new URLSearchParams();
    if (newQuery) {
      nextSearchParams.set("query", newQuery);
    } else {
      nextSearchParams.delete("query");
    }
    setSearchParams(nextSearchParams);
  };

  useEffect(() => {
    if (!query) {
      setCollection([]);
      return;
    }
    async function fetchSearchMovies(query) {
      try {
        setLoading(true);
        const res = await fetchMovies(query);
        setCollection(res.results); 
      } catch (error) {
        console.log(" error", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSearchMovies(query);
  }, [query]);

  return (
    <div className={style.container}>
      {loading && <strong>Loading posts...</strong>}
      <Formik
        initialValues={{ search: query ?? "" }}
        onSubmit={handlerSubmit}
        validationSchema={searchValueSchema}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              type="text"
              className={style.input}
              name="search"
              placeholder="Search movies..."
            />
            <button type="submit">Search</button>
            {errors.search && touched.search && (
              <div className={style.error}>{errors.search}</div>
            )}
          </Form>
        )}
      </Formik>
      {collection.length > 0 && <MovieList collection={collection} />}
    </div>
  );
};

export default MoviesPage;
