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

export const Home = () => {
  const navigate = useNavigate();
  const { categoryId, sort, currentPage } = useSelector((state) => state.filterSlice);
  const dispatch = useDispatch();
  const { searchValue } = useContext(SearchContext);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
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
      fetchPizzas();
    }
    isSearch.current = false;
  }, [categoryId, sort, search, currentPage]);

  const fetchPizzas = () => {
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
        {loading
          ? [...Array(10)].map((_, i) => <Skeleton key={i} />)
          : pizzas.map((pizza) => <PizzaBlock key={pizza.id} {...pizza} />)}
      </div>
      <Pagination onChangePage={onChangePage} />
    </div>
  );
};
