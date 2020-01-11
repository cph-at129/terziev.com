import React, {useState, useEffect} from 'react'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import CartItems from './CartItems'
import {StripeProvider} from 'react-stripe-elements'
import config from './../../config/config'
import Checkout from './Checkout'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  }
})

const Cart = ({ classes }) => {
  const [state, setState] = useState({
    checkout: false,
    stripe: null
  });

  useEffect(() => {
    if (window.Stripe) {
      setState({
        ...state,
        stripe: window.Stripe(config.stripe_test_api_key)
      })
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        setState({
          ...state,
          stripe: window.Stripe(config.stripe_test_api_key)
        })
      })
    }
  }, []);

  const setCheckout = val => {
    setState({
      ...state,
      checkout: val
    })
  }

  return (<div className={classes.root}>
    <Grid container spacing={24}>
      <Grid item xs={6} sm={6}>
        <CartItems checkout={state.checkout}
                   setCheckout={setCheckout}/>
      </Grid>
      {state.checkout &&
      <Grid item xs={6} sm={6}>
        <StripeProvider stripe={state.stripe}>
          <Checkout/>
        </StripeProvider>
      </Grid>}
    </Grid>
  </div>)
}

Cart.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Cart)
