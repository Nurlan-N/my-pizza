import Header from './components/Header';
import './scss/app.scss';
import { Route, Routes } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { createContext, useState } from 'react';


export const SearchContext = createContext('');

function App() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="wrapper">
      <SearchContext.Provider value={{searchValue,setSearchValue}}>
        <Header/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </SearchContext.Provider>
    </div>
  );
}

export default App;
