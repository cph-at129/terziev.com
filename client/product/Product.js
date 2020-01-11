import React, {useState, useEffect} from 'react'
import Card, {CardHeader, CardMedia} from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {read, listRelated} from './api-product.js'
import {Link} from 'react-router-dom'
import Suggestions from './../product/Suggestions'
import AddToCart from './../cart/AddToCart'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  flex:{
    display:'flex'
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '24px',
    color: theme.palette.openTitle
  },
  price: {
    padding: '16px',
    margin: '16px 0px',
    display: 'flex',
    backgroundColor: '#93c5ae3d',
    fontSize: '1.3em',
    color: '#375a53',
  },
  media: {
    height: 200,
    display: 'inline-block',
    width: '50%',
    marginLeft: '24px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  link:{
    color: '#3e4c54b3',
    fontSize: '0.9em'
  },
  addCart: {
    width: '35px',
    height: '35px',
    padding: '10px 12px',
    borderRadius: '0.25em',
    backgroundColor: '#5f7c8b'
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  }
})

const Product = ({ classes, match }) => {

  const [state, setState] = useState({
    product: {shop: {}},
    suggestions: [],
    suggestionTitle: 'Related Products'
  });

  const loadProduct = (productId) => {
    read({productId: productId}).then((data) => {
      if (data.error) {
        setState({
          ...state,
          error: data.error
        })
      } else {
        console.log({ data })
        setState({
          ...state,
          product: data
        })
        listRelated({
          productId: data._id}).then((data) => {
          if (data.error) {
            console.log(data.error)
          } else {
            setState({
              ...state,
              suggestions: data
            })
          }
        })
     }
    })
  }

  useEffect(() => {
    loadProduct(match.params.productId)
  }, [match.params.productId]);

  const imageUrl = state.product._id
        ? `/api/product/image/${state.product._id}?${new Date().getTime()}`
        : '/api/product/defaultphoto'

  return (
      <div className={classes.root}>
        <Grid container spacing={40}>
          <Grid item xs={7} sm={7}>
            <Card className={classes.card}>
              <CardHeader
                title={state.product.name}
                subheader={state.product.quantity > 0? 'In Stock': 'Out of Stock'}
                action={
                  <span className={classes.action}>
                    <AddToCart cartStyle={classes.addCart} item={state.product}/>
                  </span>
                }
              />
              <div className={classes.flex}>
                <CardMedia
                  className={classes.media}
                  image={imageUrl}
                  title={state.product.name}
                />
                <Typography component="p" type="subheading" className={classes.subheading}>
                  {state.product.description}<br/>
                  <span className={classes.price}>$ {state.product.price}</span>
                  <Link to={'/shops/'+state.product.shop._id} className={classes.link}>
                    <span>
                      <Icon className={classes.icon}>shopping_basket</Icon> {state.product.shop.name}
                    </span>
                  </Link>
                </Typography>

              </div>
            </Card>
          </Grid>
          {state.suggestions.length > 0 &&
            (<Grid item xs={5} sm={5}>
              <Suggestions  products={state.suggestions} title='Related Products'/>
            </Grid>)}
        </Grid>
      </div>)
}

Product.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Product)
