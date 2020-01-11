import React, {useState} from 'react'
import {withStyles} from 'material-ui/styles'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import AddCartIcon from 'material-ui-icons/AddShoppingCart'
import DisabledCartIcon from 'material-ui-icons/RemoveShoppingCart'
import cart from './cart-helper.js'
import { Redirect } from 'react-router-dom'

const styles = theme => ({
  iconButton: {
    width: '28px',
    height: '28px'
  },
  disabledIconButton: {
    color: '#7f7563',
    width: '28px',
    height: '28px'
  }
})

const AddToCart = ({ classes, item, cartStyle }) => {
  const [state, setState] = useState({
    redirect: false
  });
  const addToCart = () => {
    cart.addItem(item, () => {
      setState({
        ...state,
        redirect:true
      })
    })
  }
  if (state.redirect) {
    return (<Redirect to={'/cart'}/>)
  }
  return (<span>
    {item.quantity >= 0 ?
      <IconButton color="secondary" dense="dense" onClick={addToCart}>
        <AddCartIcon className={cartStyle || classes.iconButton}/>
      </IconButton> :
      <IconButton disabled={true} color="secondary" dense="dense">
        <DisabledCartIcon className={cartStyle || classes.disabledIconButton}/>
      </IconButton>}
    </span>)
}

AddToCart.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  cartStyle: PropTypes.string
}

export default withStyles(styles)(AddToCart)
