import { useState } from 'react'
import React from 'react'
import {BrowserRouter as Router, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Navbar />
      <br/>
      <Route path="/scout" exact component={scout} />
      <Route path="/scout/list" exact component={scout} />
      <Route path="/scout/observation" exact component={scout} />
      <Route path="/scout/editobservation" exact component={scout} />
      <Route path="/scout/new" exact component={scout} />
      <Route path="/scout/teamranking" exact component={scout} />
      <Route path="/admin" exact component={scout} />
      <Route path="/admin" exact component={scout} />
      <Route path="/" exact component={scout} />
    </Router>
  );
}
app.use('/account', account);
app.use('/scout', scout);
app.use('/scout/list', scout);
app.use('/scout/editobservation', scout);
app.use('/scout/teamranking', scout);
app.use('/scout/new', scout);
app.use('/admin', admin);
app.use('/admin/register', admin);
app.use('/admin/bulkimport', admin);
app.use('/admin/edituser', admin);
app.use('/admin/userlist', admin);
app.use('/admin/event', admin);
export default App;
