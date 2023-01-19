import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';

export const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(0);
  const [sortType, setSortType] = useState({ name: 'популярности', sortProperty: 'raiting' });

  useEffect(() => {
    setLoading(true);
    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.sortProperty.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const GetPizzas = async () => {
      const respons = await axios.get(
        `https://63c3fe4ef0028bf85fa0c6fe.mockapi.io/pizza?${category}&sortBy=${sortBy}&order=${order}`,
      );
      setPizzas(respons.data);
      setLoading(false);
    };
    GetPizzas();
    window.scrollTo(0, 0);
  }, [categoryId, sortType]);
  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={(id) => setCategoryId(id)} />
        <Sort value={sortType} onChangeSort={(i) => setSortType(i)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {loading
          ? [...Array(10)].map((_, i) => <Skeleton key={i} />)
          : pizzas.map((pizza) => <PizzaBlock key={pizza.id} {...pizza} />)}
      </div>
      <ul className="Pagination_root__uwB0O">
        <li className="previous disabled">
          <a
            href="/1"
            className=" "
            tabIndex="-1"
            role="button"
            aria-disabled="true"
            aria-label="Previous page"
            rel="prev">
            &lt;
          </a>
        </li>
        <li className="selected">
          <a
            href="/1"
            rel="canonical"
            role="button"
            tabIndex="-1"
            aria-label="Page 1 is your current page"
            aria-current="page">
            1
          </a>
        </li>
        <li>
          <a href="/1" rel="next" role="button" tabIndex="0" aria-label="Page 2">
            2
          </a>
        </li>
        <li>
          <a href="/1" role="button" tabIndex="0" aria-label="Page 3">
            3
          </a>
        </li>
        <li className="next">
          <a
            href="/1"
            className=""
            tabIndex="0"
            role="button"
            aria-disabled="false"
            aria-label="Next page"
            rel="next">
            &gt;
          </a>
        </li>
      </ul>
    </div>
  );
};
