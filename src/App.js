import logo from './logo.svg'
import './App.css'
import React from 'react'
import axios from 'axios'
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home'
import Articles from './components/Articles'
import Checklists from './components/Checklists'
import LearningPaths from './components/LearningPaths'
import Login from './components/Login';
import ViewArticle from './components/ViewArticle'
import EditArticle from './components/EditArticle'
import CreateArticle from './components/CreateArticle';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/articles' element={<Articles/>} />
          <Route path='/checklists' element={<Checklists />}/>
          <Route path='/learning-paths' element={<LearningPaths />}/>
          <Route path="/articles/edit/:id" element={<EditArticle/>}/>
          <Route path="/articles/view/:id" element={<ViewArticle/>}/>
          <Route path="/articles/create" element={<CreateArticle/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
