import './App.css';
import Register from './components/pages/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Home Page</p>
        <Router>
          <Routes>
            <Route path='/register' element={<Register />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
