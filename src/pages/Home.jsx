import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId } from '../redux/slices/filterSlice';
import axios from 'axios';

import Pagination from '../components/Pogination';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';
import { SearchContext } from '../App';

export const Home = () => {
  const {categoryId , sort} = useSelector((state) => state.filterSlice);

  const dispatch = useDispatch();
  const { searchValue } = useContext(SearchContext);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const search = searchValue ? `&search=${searchValue}` : '';
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sort.sortProperty.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';

    const GetPizzas = async () => {
      const respons = await axios.get(
        `https://63c3fe4ef0028bf85fa0c6fe.mockapi.io/pizza?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
      );
      setPizzas(respons.data);
      setLoading(false);
    };
    GetPizzas();
    window.scrollTo(0, 0);
  }, [categoryId, sort, search, currentPage]);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={(id) => onChangeCategory(id)} />
        <Sort />
      </div>
      <h2 className="content__title">{searchValue ? searchValue : 'Все пиццы'}</h2>
      <div className="content__items">
        {loading
          ? [...Array(10)].map((_, i) => <Skeleton key={i} />)
          : pizzas.map((pizza) => <PizzaBlock key={pizza.id} {...pizza} />)}
      </div>
      <Pagination onChangePage={(num) => setCurrentPage(num)} />
    </div>
  );
};
