import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import axios from 'axios';
import qs from 'qs';

import Pagination from '../components/Pogination';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort, { sortList } from '../components/Sort';
import { SearchContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { fetchPizzas } from '../redux/slices/pizzaSlice';

export const Home = () => {
  const navigate = useNavigate();
  const { categoryId, sort, currentPage } = useSelector((state) => state.filterSlice);
  const {items,status} = useSelector((state) => state.pizza);

  const dispatch = useDispatch();
  const { searchValue } = useContext(SearchContext);
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const search = searchValue ? `&search=${searchValue}` : '';

  // İlk Renderin Olmağını yoxlamaq varsa URL-i dəyişmək
  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, currentPage]);

  // ilk Render Zamanı URL-parametrlərin redux-da yadda saxlamaq
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);
      dispatch(setFilters({ ...params, sort }));
      isSearch.current = true;
    }
  }, []);

  // ilk Render olubsa Datanı gətirmək
  useEffect(() => {
    window.scroll(0, 0);
    if (!isSearch.current) {
      getPizzas();
    }
    isSearch.current = false;
  }, [categoryId, sort, search, currentPage]);

  const getPizzas = () => {
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sort.sortProperty.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage,
      }),
    );
  };

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };
  const onChangePage = (e) => {
    dispatch(setCurrentPage(e.selected + 1));
  };

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={(id) => onChangeCategory(id)} />
        <Sort />
      </div>
      <h2 className="content__title">{searchValue ? searchValue : 'Все пиццы'}</h2>
      <div className="content__items">
        {status === 'loading'
          ? [...Array(10)].map((_, i) => <Skeleton key={i} />)
          : items.map((pizza) => <PizzaBlock key={pizza.id} {...pizza} />)}
      </div>
      <Pagination onChangePage={onChangePage} />
    </div>
  );
};
