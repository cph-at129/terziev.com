import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import auth from './../auth/auth-helper'
import {remove} from './api-product.js'

const DeleteProduct = ({ shopId, product, onRemove }) => {
  const [state, setState] = useState({
    open: false
  });
  const clickButton = () => {
    setState({open: true})
  }
  const deleteProduct = () => {
    const jwt = auth.isAuthenticated()
    remove({
      shopId,
      productId: product._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setState({
          ...state,
          open: false
        }, () => {
          onRemove(product)
        })
      }
    })
  }
  const handleRequestClose = () => {
    setState({
      ...state,
      open: false
    })
  }
  return (<span>
    <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
      <DeleteIcon/>
    </IconButton>
    <Dialog open={state.open} onClose={handleRequestClose}>
      <DialogTitle>{"Delete "+product.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirm to delete your product {product.name}.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRequestClose} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteProduct} color="secondary" autoFocus="autoFocus">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </span>)
}
DeleteProduct.propTypes = {
  shopId: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}
export default DeleteProduct
