import axios from 'axios'

const useFetch = async (url,offset) => {
        const results = await axios(url, {
            params: {
              api_key: "8LtZyZuQEXy64AmTffi7RH3pPha6iKRV",
              limit: 10,
              offset
            },
          });
        //console.log(results);
        return (results.data.data);
}
export default useFetch;