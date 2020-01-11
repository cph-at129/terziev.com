import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import auth from './../auth/auth-helper'
import {remove} from './api-shop.js'

const DeleteShop = ({ shop, onRemove }) => {
  const [state, setState] = useState({
    open: false
  });

  const clickButton = () => {
    setState({
      ...state,
      open: true
    })
  }

  const deleteShop = () => {
    const jwt = auth.isAuthenticated()
    remove({
      shopId: shop._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setState({
          ...state,
          open: false
        }, () => {
          onRemove(shop)
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
        <DialogTitle>{"Delete "+shop.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your shop {shop.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteShop} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)
}
DeleteShop.propTypes = {
  shop: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}
export default DeleteShop
