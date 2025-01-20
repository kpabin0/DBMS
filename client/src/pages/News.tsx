import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getFallbackNews, getFallbackSubNews } from '../data/_news';
import { INews, ISubNews } from '../data/ITypes';

const PORT_NUMBER = process.env.REACT_APP_PORT_NUMBER;

const News = () => {

  const [newsData, setNewsData] = useState<INews[]>();
  const [subNewsData, setSubNewsData] = useState<ISubNews[]>();

  
  useEffect(() => {
    const res = async () => {

      // eslint-disable-next-line
      const news =  await fetch(`http://localhost:${PORT_NUMBER}/news/`)
                    .then((res) => res.json())
                    .then((data) => { setNewsData(data); console.log(data); return data })
                    .catch((error) => { setNewsData(getFallbackNews()); console.log(error); });
                    
      // eslint-disable-next-line
      const subNews =  await fetch(`http://localhost:${PORT_NUMBER}/subnews/`)
                    .then((res) => res.json())
                    .then((data) => { setSubNewsData(data); console.log(data); return data })
                    .catch((error) => { setSubNewsData(getFallbackSubNews()); console.log(error); });

    }

    res();
  // eslint-disable-next-line
  }, [])

  return (
    <section className="flex flex-col justify-evenly items-center min-h-screen min-w-full">
        <h1 className="text-theme text-3xl font-bold uppercase my-10">News</h1>
        <div className="min-w-[80%] flex flex-col xl:flex-row justify-evenly items-center flex-wrap">
          <div className="flex flex-row flex-wrap justify-evenly items-center">
            {
              newsData ? newsData?.map((props, ind) => {
                return <NewsCard key={ind} {...props} />
              }) : <span className="text-3xl text-theme ">Loading...</span>
            }
          </div>
          <hr className="w-full border border-theme my-10"/>
          <div className="flex flex-col justify-evenly items-center space-y-2 my-4">
            {
              subNewsData ? subNewsData?.map((props, ind) => {
                return <SubNewsCard key={ind} {...props} />
              }) :  <span className="text-1xl text-theme ">Loading...</span>
            }
          </div>
        </div>
    </section>
  )
}

const NewsCard = ({title, img, description} : INews) => {
  return (
    <div className="p-2 space-y-6 flex flex-col justify-center">
      <h1 className="text-xl font-main-a font-bold">{title}</h1>
      <div className="rounded-xl w-[20rem] h-[15rem] bg-theme-g">
        { img ? <img className="rounded-xl w-full h-full" src={img} alt={title} /> : <></>}
      </div>
      <p className="font-light">{description}</p>
    </div>
  )
}

const SubNewsCard = ({title, url, description} : ISubNews) => {
  return (
    <div className="w-full pt-2 flex flex-col justify-between items-center bg-theme-w-alt border hover:border-theme" >
      <span className="font-bold text-md">{title}</span>
      <div className="w-full flex flex-row justify-between items-end">
        <p className="text-sm font-light p-2">{description}</p>
        <Link to={url ? url : "#"} className="p-1 px-2 bg-theme-w hover:bg-theme text-theme hover:text-theme-w">More</Link>
      </div>
    </div>
  )
}

export default News