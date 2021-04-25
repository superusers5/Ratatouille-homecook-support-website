import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addDish } from '../../actions/dish';
import { makeStyles, withTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    color: 'white'
  },
  input: {
    '&::placeholder': {
      fontcolor: 'white',
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  multilineColor:{
    color:'white'
},
textInputStyle: {
  color: 'white',
  },
}));


const AddExperience = ({ addDish, history }) => {
  const classes = useStyles()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: ''
  });

  const { name, description, price, category } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">Add a Dish</h1>
      <p className="lead">
      <i class="fas fa-hamburger"></i> Start with a dish that is special to you!
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={e => {
          e.preventDefault();
          addDish(formData, history);
        }}
      >
        <div>
          
        <TextField
          id="outlined-full-width"
          style={{ margin: 8 }}
          placeholder="* Dish Name"
          name="name"
          value={name}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
            style: { color: 'white'},
          }}
          variant="filled"
        />
        </div>
        <div>
        <TextField
          id="outlined-full-width"
          style={{ margin: 8 }}
          placeholder="* Cuisine (example: Chinese, Indian)"
          name="category"
          value={category}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
            style: { color: 'white'},
          }}
          variant="filled"
        />
        </div>
        <div>
        <TextField
          id="outlined-full-width"
          style={{ margin: 8 }}
          placeholder="* Price (INR)"
          name="price"
          value={price}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
            style: { color: 'white'},
          }}
          variant="filled"
        />
        </div>
        {/* <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={onChange} />
        </div> */}
        {/* <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={() => {
                setFormData({ ...formData, current: !current });
              }}
            />{' '}
            Current Job
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={onChange}
            disabled={current}
          />
        </div> */}
        <div>
        <TextField
          id="outlined-full-width"
          style={{ margin: 8 }}
          placeholder="About Dish"
          name="description"
          value={description}
          onChange={onChange}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
            style: { color: 'white'},
          }}
          variant="filled"
        />

        </div>
        <input type="submit" className="btn btn-primary my-1" value= "Submit"/>
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddExperience.propTypes = {
  addDish: PropTypes.func.isRequired
};

export default connect(null, { addDish })(AddExperience);
