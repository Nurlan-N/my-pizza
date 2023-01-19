import Header from './components/Header';
import './scss/app.scss';
import { Route, Routes } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { useState } from 'react';

function App() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="wrapper">
      <Header searchValue={searchValue}  setSearchValue={setSearchValue} />
      <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
      </div>
    </div>
  );
}

export default App;
