import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemText} from 'material-ui/List'
import Typography from 'material-ui/Typography'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import Collapse from 'material-ui/transitions/Collapse'
import Divider from 'material-ui/Divider'
import auth from './../auth/auth-helper'
import {listByShop} from './api-order.js'
import ProductOrderEdit from './ProductOrderEdit'

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing.unit,
    color: '#434b4e',
    fontSize: '1.1em'
  },
  customerDetails: {
    paddingLeft: '36px',
    paddingTop: '16px',
    backgroundColor:'#f8f8f8'
  }
})
const ShopOrders = ({ classes, match }) => {
  const [state, setState] = useState({
    open: 0,
    orders:[]
  });

  const loadOrders = () => {
    const jwt = auth.isAuthenticated()
    listByShop({
      shopId: match.params.shopId
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        console.log(data)
      } else {
        setState({
          ...state,
          orders: data
        })
      }
    })
  }

  useEffect(() => {
    loadOrders()
  }, []);

  const handleClick = index => event => {
    setState({
      ...state,
      open: index
    })
  }

  const updateOrders = (index, updatedOrder) => {
    let orders = state.orders
    orders[index] = updatedOrder
    setState({
      ...state,
      orders: orders
    })
  }

  return (
  <div>
    <Paper className={classes.root} elevation={4}>
      <Typography type="title" className={classes.title}>
        Orders in {match.params.shop}
      </Typography>
      <List dense >
        {state.orders.map((order, index) => {
          return   <span key={index}>
            <ListItem button onClick={handleClick(index)}>
              <ListItemText primary={'Order # '+order._id} secondary={(new Date(order.created)).toDateString()}/>
              {state.open == index ? <ExpandLess /> : <ExpandMore />}
            </ListItem><Divider/>
            <Collapse component="li" in={state.open == index} timeout="auto" unmountOnExit>
              <ProductOrderEdit shopId={match.params.shopId} order={order} orderIndex={index} updateOrders={updateOrders}/>
              <div className={classes.customerDetails}>
                <Typography type="subheading" component="h3" className={classes.subheading}>
                  Deliver to:
                </Typography>
                <Typography type="subheading" component="h3" color="primary"><strong>{order.customer_name}</strong> ({order.customer_email})</Typography>
                <Typography type="subheading" component="h3" color="primary">{order.delivery_address.street}</Typography>
                <Typography type="subheading" component="h3" color="primary">{order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zipcode}</Typography>
                <Typography type="subheading" component="h3" color="primary">{order.delivery_address.country}</Typography><br/>
              </div>
            </Collapse>
            <Divider/>
          </span>})}
      </List>
    </Paper>
  </div>)
}

ShopOrders.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ShopOrders)
