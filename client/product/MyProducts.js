import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import Card, {CardMedia} from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui-icons/Edit'
import Icon from 'material-ui/Icon'
import List, {ListItem, ListItemSecondaryAction} from 'material-ui/List'
import Typography from 'material-ui/Typography'
import {Link} from 'react-router-dom'
import Divider from 'material-ui/Divider'
import auth from './../auth/auth-helper'
import {listByShop} from './../product/api-product.js'
import DeleteProduct from './../product/DeleteProduct'

const styles = theme => ({
  products: {
    padding: '24px'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  },
  title: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  cover: {
    width: 110,
    height: 100,
    margin: '8px'
  },
  details: {
    padding: '10px'
  },
})
const MyProducts = ({ classes, shopId }) => {
  const [state, setState] = useState({
    products: []
  });

  const loadProducts = () => {
    listByShop({
      shopId
    }).then((data)=>{
      if (data.error) {
        setState({
          ...state,
          error: data.error
        })
      } else {
        setState({
          ...state,
          products: data
        })
      }
    })
  }

  useEffect(() => {
   loadProducts()
  }, []);

  const removeProduct = (product) => {
    const updatedProducts = state.products
    const index = updatedProducts.indexOf(product)
    updatedProducts.splice(index, 1)
    setState({
      ...state,
      shops: updatedProducts
    })
  }

  return (
    <Card className={classes.products}>
      <Typography type="title" className={classes.title}>
        Products
        <span className={classes.addButton}>
          <Link to={"/seller/"+shopId+"/products/new"}>
            <Button color="primary" variant="raised">
              <Icon className={classes.leftIcon}>add_box</Icon>  New Product
            </Button>
          </Link>
        </span>
      </Typography>
      <List dense>
      {state.products.map((product, i) => {
          return <span key={i}>
            <ListItem>
              <CardMedia
                className={classes.cover}
                image={'/api/product/image/'+product._id+"?" + new Date().getTime()}
                title={product.name}
              />
              <div className={classes.details}>
                <Typography type="headline" component="h2" color="primary" className={classes.productTitle}>
                  {product.name}
                </Typography>
                <Typography type="subheading" component="h4" className={classes.subheading}>
                  Quantity: {product.quantity} | Price: ${product.price}
                </Typography>
              </div>
              <ListItemSecondaryAction>
                <Link to={"/seller/"+product.shop._id+"/"+product._id+"/edit"}>
                  <IconButton aria-label="Edit" color="primary">
                    <Edit/>
                  </IconButton>
                </Link>
                <DeleteProduct
                  product={product}
                  shopId={shopId}
                  onRemove={removeProduct}/>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider/></span>})}
      </List>
    </Card>)
}
MyProducts.propTypes = {
  classes: PropTypes.object.isRequired,
  shopId: PropTypes.string.isRequired
}

export default withStyles(styles)(MyProducts)
