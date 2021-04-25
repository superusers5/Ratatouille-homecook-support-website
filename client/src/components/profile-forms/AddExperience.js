import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../actions/profile';
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


const AddExperience = ({ addExperience, history }) => {
  const classes = useStyles()

  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: '10',
    to: '',
    current: true,
    description: ''
  });

  const { company, title, location, from, to, current, description } = formData;

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
          addExperience(formData, history);
        }}
      >
        <div>
          
        <TextField
          id="outlined-full-width"
          style={{ margin: 8 }}
          placeholder="* Dish Name"
          name="title"
          value={title}
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
          name="company"
          value={company}
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
          name="location"
          value={location}
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
  addExperience: PropTypes.func.isRequired
};

export default connect(null, { addExperience })(AddExperience);
