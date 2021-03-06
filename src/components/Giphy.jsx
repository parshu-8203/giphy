import React, { useEffect, useState, useRef, useCallback } from "react";
import Loader from "./Loader";
import useFetch from "./useFetch";
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Giphy = () => {
  const TRENDING_URL = "https://api.giphy.com/v1/gifs/trending";
  const SEARCH_URL = "https://api.giphy.com/v1/gifs/search";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0)
  const [searchText, setSearch] = useState("");
  const prevSearchText = usePrevious(searchText);

  const fetchData = async (e) => {
    setLoading(true)
    let finalURL = ''
    if (searchText.length > 0) {
      finalURL = SEARCH_URL + "?q=" + searchText;
    } else {
      finalURL = TRENDING_URL;
    }
    var res= [];
    res = await useFetch(finalURL,offset);
    setData((oldre) => [...new Set([...oldre, ...res])]);
    setLoading(false)
  };
  useEffect(() => {
    if (offset !== 0) {
      fetchData();
    }
  }, [offset])
  useEffect(() => {
    if (searchText.length === 0) {
      if (prevSearchText !== searchText) {
        setOffset(0)
        setData([]);
        fetchData();
      }
    }

  }, [searchText]);


  const observer = useRef()
  const lastGif = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        setOffset(prevOffset => prevOffset + 10)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading])

  const renderGifs = () => {
    return data.map((el, index) => {
      if (data.length === index + 1) {
        return (<div ref={lastGif} key={el.id} className="gif">
          <div>
            <img
              src={el.images.fixed_height.url}
              width="250"
              height="250"
              alt="gifs"
            />
          </div>
        </div>)
      }
      else {
        return (
          <div key={el.id} className="gif">
            <img
              src={el.images.fixed_height.url}
              width="250"
              height="250"
              alt="gifs"
            />
          </div>
        );
      }
    });
  };

  const handleSearchChange = (e) => {
   // console.log("searchText Text");
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    //console.log(searchText)
    e.preventDefault();
    setData([]);
    setOffset(0)
    fetchData();
  };
  return (
    <div className="m-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><g transform="matrix(.280932 0 0 .280932 66.155243 51.179423)"><rect rx="20" height="128" width="128" x="-220.746" y="-139.39" fill="#1a1a1a"/><path d="M-189.707-106.067l8.027-.213 1.663 62.658-8.027.213z" fill="#0f9"/><path d="M-133.07-91.5l8.037-.213 1.236 46.594-8.037.213z" fill="#93f"/><path d="M-188.045-43.424l64.247-1.705.213 8.037-64.247 1.705z" fill="#0cf"/><path d="M-189.92-114.1l40.156-1.066.213 8.037-40.156 1.066z" fill="#ff9"/><path d="M-149.126-91.08l24.1-.64-.2-8.03-8.04.2-.2-8.03-8.03.2-.2-8.03-8.04.2z" fill="#f66"/><path d="M-133.06-91.506l8.037-.213.213 8.037-8.037.213z" fill="#4c197f"/><path d="M-26.06-82.268c0-1.543-.28-2.104-1.964-2.057-3.834.14-7.622.047-11.456.047h-12.017c-1.03 0-1.496.234-1.45 1.356.094 3.18.094 6.36.047 9.54 0 .982.28 1.3 1.3 1.263 2.244-.094 4.442-.047 6.687 0 1.824 0 4.63-.608 5.284.28.935 1.3.468 3.74.374 5.658-.047.608-.608 1.45-1.216 1.777-2.993 1.73-6.313 2.244-9.726 2.104-5.94-.234-10.38-2.712-12.766-8.37-1.543-3.74-1.917-7.622-1.122-11.597 1.122-5.518 3.788-9.726 9.54-11.176 5.798-1.45 11.27-.608 16.085 3.133 1.356 1.075 2 .795 2.993-.327 1.683-1.917 3.507-3.694 5.284-5.518 2.104-2.15 2.104-2.104-.187-4.115-6.687-5.985-14.683-7.575-23.287-6.64-11.877 1.3-20.294 7.154-24.362 18.704-1.964 5.518-2.244 11.176-1.075 16.88 1.87 8.8 6.172 15.7 14.776 19.312 7.67 3.226 15.618 3.834 23.707 1.777 4.816-1.216 9.352-2.9 12.625-6.92 1.263-1.543 1.917-3.226 1.87-5.237l.047-19.873zm139.158 4.208l.047-25.625c0-1.263-.187-1.777-1.637-1.73a266.1 266.1 0 0 1-12.25 0c-1.263-.047-1.6.374-1.6 1.6v17.395c0 1.496-.468 1.73-1.824 1.73a469.23 469.23 0 0 0-16.226 0c-1.403.047-1.637-.468-1.6-1.73l.047-17.582c0-1.03-.187-1.45-1.3-1.403H63.953c-1.03 0-1.45.187-1.45 1.356v51.997c0 1.075.28 1.403 1.356 1.403h12.8c1.3.047 1.403-.514 1.403-1.543l-.047-17.395c0-1.17.28-1.496 1.45-1.496H96.3c1.356 0 1.543.468 1.543 1.637l-.047 17.208c0 1.216.234 1.637 1.543 1.6 4.02-.094 8.043-.094 12.017 0 1.45.047 1.777-.374 1.777-1.777l-.047-25.625zm-74.395-27.26c-9.305-.234-18.6-.14-27.87-.234-1.496 0-1.964.374-1.964 1.917l.047 25.578v25.812c0 1.122.187 1.6 1.45 1.543a299.68 299.68 0 0 1 13 0c1.216 0 1.496-.374 1.496-1.496l-.047-11.83c0-1.17.327-1.496 1.496-1.496 3.694.047 7.388.094 11.082-.094 4.9-.234 9.586-1.356 13.467-4.582 6.172-5.097 8.464-14.122 5.705-22.305-2.572-7.295-9.726-12.625-17.862-12.812zm-3.367 26.7c-3.133.047-6.22-.047-9.352.047-1.3.047-1.6-.42-1.496-1.6.094-1.73 0-3.413 0-5.144v-5.705c-.047-.935.28-1.216 1.17-1.17 3.32.047 6.593-.094 9.913.047 4.02.14 6.546 2.993 6.5 6.967-.14 4.068-2.572 6.5-6.733 6.546zm140.28-26.794c-4.957 0-9.913-.047-14.916.047-.7 0-1.637.56-2.057 1.17-3.413 5.237-6.733 10.474-9.96 15.805-.982 1.637-1.356 1.3-2.198-.094l-9.446-15.665c-.56-.935-1.17-1.263-2.244-1.263l-14.542.047c-.514 0-1.075.14-1.6.234.234.42.42.888.7 1.3l19.36 30.207c.514.795.795 1.87.842 2.806v18.517c0 1.17.187 1.683 1.543 1.637 4.208-.094 8.417-.094 12.625 0 1.263.047 1.45-.42 1.45-1.543l-.047-9.54c0-3.04-.094-6.126.047-9.165.047-1.03.374-2.15.935-2.946l20.2-30.067c.28-.374.374-.842.608-1.3-.42-.14-.842-.187-1.3-.187zM-1.838-104.2c0-1.122-.327-1.356-1.403-1.356h-12.4c-1.403-.047-1.637.42-1.637 1.683l.047 25.578v25.952c0 1.17.14 1.683 1.496 1.637 4.115-.094 8.277-.047 12.4 0 1.075 0 1.543-.094 1.543-1.403l-.047-52.1z" fill="#1a1a1a"/></g></svg>
      <form className="form-inline justify-content-center row m-2">
        <div className="col-auto">
          <input
            value={searchText}
            onChange={handleSearchChange}
            type="searchText"
            className="form-control"
            placeholder="Search"
          />
        </div>{" "}
        <div className="col-auto">
          <button
            onClick={handleSubmit}
            type="submit"
            className="btn btn-primary mb-3"
          >
            {" "}
            Go{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
      <div className="gifs">
        {renderGifs()}
      </div>
      <div className="gifs">
        {loading ? <Loader /> : null}
      </div>{" "}
    </div>
  );
};

export default Giphy;
