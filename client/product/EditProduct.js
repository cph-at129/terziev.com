import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import FileUpload from 'material-ui-icons/FileUpload'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {read, update} from './api-product.js'
import {Link, Redirect} from 'react-router-dom'

const styles = theme => ({
  card: {
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
    maxWidth: 500,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
})

const EditProduct = ({ classes, match }) => {

  const [state, setState] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: '',
    redirect: false,
    error: '',
    productData: new FormData()
  });

  useEffect(() => {
    read({
      productId: match.params.productId
    }).then((data) => {
      if (data.error) {
        setState({
          ...state,
          error: data.error
        })
      } else {
        setState({
          ...state,
          id: data._id, name: data.name, description: data.description, category: data.category, quantity:data.quantity, price: data.price
        })
      }
    })
  }, [])

  const clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    update({
      shopId: match.params.shopId,
      productId: match.params.productId
    }, {
      t: jwt.token
    }, state.productData).then((data) => {
      if (data.error) {
        setState({
          ...state,
          error: data.error
        })
      } else {
        setState({
          ...state,
          'redirect': true
        })
      }
    })
  }
  const handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : event.target.value
    state.productData.set(name, value)
    setState({
      ...state,
      [name]: value
    })
  }

  const imageUrl = state.id
        ? `/api/product/image/${state.id}?${new Date().getTime()}`
        : '/api/product/defaultphoto'
  if (state.redirect) {
    return (<Redirect to={'/seller/shop/edit/'+match.params.shopId}/>)
  }
  return (<div>
    <Card className={classes.card}>
      <CardContent>
        <Typography type="headline" component="h2" className={classes.title}>
          Edit Product
        </Typography><br/>
        <Avatar src={imageUrl} className={classes.bigAvatar}/><br/>
        <input accept="image/*" onChange={handleChange('image')} className={classes.input} id="icon-button-file" type="file" />
        <label htmlFor="icon-button-file">
          <Button variant="raised" color="secondary" component="span">
            Change Image
            <FileUpload/>
          </Button>
        </label> <span className={classes.filename}>{state.image ? state.image.name : ''}</span><br/>
        <TextField id="name" label="Name" className={classes.textField} value={state.name} onChange={handleChange('name')} margin="normal"/><br/>
        <TextField
          id="multiline-flexible"
          label="Description"
          multiline
          rows="3"
          value={state.description}
          onChange={handleChange('description')}
          className={classes.textField}
          margin="normal"
        /><br/>
        <TextField id="category" label="Category" className={classes.textField} value={state.category} onChange={handleChange('category')} margin="normal"/><br/>
        <TextField id="quantity" label="Quantity" className={classes.textField} value={state.quantity} onChange={handleChange('quantity')} type="number" margin="normal"/><br/>
        <TextField id="price" label="Price" className={classes.textField} value={state.price} onChange={handleChange('price')} type="number" margin="normal"/><br/>
        {
          state.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
            {state.error}</Typography>)
        }
      </CardContent>
      <CardActions>
        <Button color="primary" variant="raised" onClick={clickSubmit} className={classes.submit}>Update</Button>
        <Link to={'/seller/shops/edit/'+match.params.shopId} className={classes.submit}><Button variant="raised">Cancel</Button></Link>
      </CardActions>
    </Card>
  </div>)
}

EditProduct.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditProduct)
