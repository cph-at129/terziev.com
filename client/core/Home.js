import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Suggestions from './../product/Suggestions'
import {listLatest, listCategories} from './../product/api-product.js'
import Search from './../product/Search'
import Categories from './../product/Categories'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  }
})

const Home = ({ classes }) => {
  const [state, setState] = useState({
    suggestionTitle: "Latest Products",
    suggestions: [],
    categories: []
  });
  useEffect(() => {
    listLatest().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setState({
          ...state,
          suggestions: data
        })
      }
    })
    listCategories().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setState({
          ...state,
          categories: data
        })
      }
    })
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={8} sm={8}>
          <Search categories={state.categories}/>
          <Categories categories={state.categories}/>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Suggestions products={state.suggestions} title={state.suggestionTitle}/>
        </Grid>
      </Grid>
    </div>
  )
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)
