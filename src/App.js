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
import CreateChecklist from './components/CreateChecklist';
import EditChecklist from './components/EditChecklist';
import CreateLearningPath from './components/CreateLearningPath';
import EditLearningPath from './components/EditLearningPath';
import ViewChecklist from './components/ViewChecklist';
import ViewLearningPath from './components/ViewLearningPath';
import CreateGame from './components/CreateGame';
import EditGame from './components/EditGame';
import Games from './components/Games';
import Test from './components/Test';
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
          <Route path='/games' element={<Games/>}/>
          <Route path="/articles/edit/:id" element={<EditArticle/>}/>
          <Route path="/articles/view/:id" element={<ViewArticle/>}/>
          <Route path="/articles/create" element={<CreateArticle/>}/>
          <Route path="/checklists/edit/:id" element={<EditChecklist/>}/>
          <Route path="/checklists/view/:id" element={<ViewChecklist/>}/> 
          <Route path="/checklists/create" element={<CreateChecklist/>}/>
          <Route path="/learning-paths/edit/:id" element={<EditLearningPath/>}/>
          <Route path="/learning-paths/view/:id" element={<ViewLearningPath/>}/> 
          <Route path="/learning-paths/create" element={<CreateLearningPath/>}/>
          <Route path='/games/create' element={<CreateGame/>}/>
          <Route path='/games/edit/:id' element={<EditGame/>}/>
          <Route path="/test/edit/:id" element={<EditArticle/>}/>
          <Route path="/test/view/:id" element={<ViewArticle/>}/>
          <Route path="/test/create" element={<Test/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
