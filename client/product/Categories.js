import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Card from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import GridList, { GridListTile } from 'material-ui/GridList'
import Icon from 'material-ui/Icon'
import {list} from './api-product.js'
import Products from './Products'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    width:'100%',
    transform: 'translateZ(0)',
  },
  tileTitle: {
    verticalAlign: 'middle',
    lineHeight: 2.5,
    textAlign: 'center',
    fontSize: '1.5em',
    margin: '0 4px 0 0',
  },
  card: {
    margin: 'auto',
    marginTop: 20
  },
  title: {
    padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    backgroundColor: '#80808024',
    fontSize: '1.1em'
  },
  icon: {
    verticalAlign: 'sub',
    color: '#738272',
    fontSize: '0.9em'
  },
  link: {
    color: '#4d6538',
    textShadow: '0px 2px 12px #ffffff',
    cursor:'pointer'
  }
})

const Categories = ({ classes, categories }) => {
  const [state, setState] = useState({
    products: [],
    selected: ''
  });

  useEffect(() => {
    setState({
      ...state,
      selected: categories[0]
    })
    list({
      category: categories[0]
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setState({
          ...state,
          products: data
        })
      }
    })
  }, [categories]);

  const listbyCategory = category => event => {
    setState({
      ...state,
      selected: category
    })
    list({
      category: category
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setState({
          ...state,
          products: data
        })
      }
    })
  }

  return (
    <div>
      <Card className={classes.card}>
        <Typography type="title" className={classes.title}>
          Explore by category
        </Typography>
        <div className={classes.root}>
          <GridList className={classes.gridList} cols={4}>
            {categories.map((tile, i) => (
              <GridListTile key={i} className={classes.tileTitle} style={{height: '64px', backgroundColor: state.selected == tile? 'rgba(95, 139, 137, 0.56)':'rgba(95, 124, 139, 0.32)'}}>
                <span className={classes.link} onClick={listbyCategory(tile)}>{tile}  <Icon className={classes.icon}>{state.selected == tile && 'arrow_drop_down'}</Icon></span>
              </GridListTile>
            ))}
          </GridList>
        </div>
        <Divider/>
        <Products products={state.products} searched={false}/>
      </Card>
    </div>
  )
}
Categories.propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired
}

export default withStyles(styles)(Categories)
