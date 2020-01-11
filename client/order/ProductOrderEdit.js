import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import List, {ListItem, ListItemText} from 'material-ui/List'
import Typography from 'material-ui/Typography'
import MenuItem from 'material-ui/Menu/MenuItem'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import auth from './../auth/auth-helper'
import {getStatusValues, update, cancelProduct, processCharge} from './api-order.js'

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
    paddingBottom: 0
  },
  listImg: {
    width: '70px',
    verticalAlign: 'top',
    marginRight: '10px'
  },
  listDetails: {
    display: "inline-block"
  },
  listQty: {
    margin: 0,
    fontSize: '0.9em',
    color: '#5f7c8b'
  },
  textField: {
    width: '160px',
    marginRight: '16px'
  },
  statusMessage: {
    position: 'absolute',
    zIndex: '12',
    right: '5px',
    padding: '5px'
  }
})
const ProductOrderEdit = ({ classes, shopId, order, orderIndex, updateOrders }) => {

  const [state, setState] = useState({
      open: 0,
      statusValues: [],
      error: ''
  });

  const loadStatusValues = () => {
    getStatusValues().then((data) => {
      if (data.error) {
        setState({
          ...state,
          error: "Could not get status"
        })
      } else {
        setState({
          ...state,
          statusValues: data, error: ''})
      }
    })
  }

  useEffect(() => {
    loadStatusValues()
  }, []);

  const handleStatusChange = productIndex => event => {
    order.products[productIndex].status = event.target.value
    let product = order.products[productIndex]
    const jwt = auth.isAuthenticated()

    if(event.target.value == "Cancelled"){
        cancelProduct({
            shopId,
            productId: product.product._id
          },
          {t: jwt.token},
          { cartItemId: product._id,
            status: event.target.value,
            quantity: product.quantity
          })
          .then((data) => {
              if (data.error) {
                setState({
                  ...state,
                  error: "Status not updated, try again"
                })
              } else {
                updateOrders(orderIndex, order)
                setState({
                  ...state,
                  error: ''
                })
              }
          })
    }else if(event.target.value == "Processing"){
        processCharge({
            userId: jwt.user._id,
            shopId,
            orderId: order._id
          },
          {t: jwt.token},
          { cartItemId: product._id,
            status: event.target.value,
            amount: (product.quantity * product.product.price)
          })
          .then((data) => {
              if (data.error) {
                setState({
                  ...state,
                  error: "Status not updated, try again"
                })
              } else {
                updateOrders(orderIndex, order)
                setState({
                  ...state,
                  error: ''
                })
              }
          })
    }
    else{
        update({
          shopId
        },
        {t: jwt.token},
        { cartItemId: product._id,
          status: event.target.value
        })
        .then((data) => {
          if (data.error) {
            setState({
              ...state,
              error: "Status not updated, try again"
            })
          } else {
            updateOrders(orderIndex, order)
            setState({
              ...state,
              error: ''
            })
          }
        })
    }
  }
  return (
  <div>
    <Typography component="span" color="error" className={classes.statusMessage}>
      {state.error}
    </Typography>
    <List disablePadding style={{backgroundColor:'#f8f8f8'}}>
      {order.products.map((item, index) => {
        return <span key={index}>
                { item.shop == shopId &&
                  <ListItem button className={classes.nested}>
                    <ListItemText
                      primary={<div>
                                  <img className={classes.listImg} src={'/api/product/image/'+item.product._id}/>
                                  <div className={classes.listDetails}>
                                    {item.product.name}
                                    <p className={classes.listQty}>{"Quantity: "+item.quantity}</p>
                                  </div>
                                </div>}/>
                    <TextField
                      id="select-status"
                      select
                      label="Update Status"
                      className={classes.textField}
                      value={item.status}
                      onChange={handleStatusChange(index)}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      margin="normal"
                    >
                      {state.statusValues.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </ListItem>
                }
                <Divider style={{margin: 'auto', width: "80%"}}/>
              </span>})
            }
    </List>
  </div>)
}
ProductOrderEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  shopId: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
  orderIndex: PropTypes.number.isRequired,
  updateOrders: PropTypes.func.isRequired
}

export default withStyles(styles)(ProductOrderEdit)
