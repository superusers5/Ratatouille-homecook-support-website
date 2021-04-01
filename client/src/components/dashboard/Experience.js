import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';
import formatDate from '../../utils/formatDate';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Experience = ({ experience, deleteExperience }) => {
  const classes = useStyles();
  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      {/* <td>
        {formatDate(exp.from)} - {exp.to ? formatDate(exp.to) : 'Now'}
      </td> */}
      <td className="hide-sm">{exp.location}</td>
      <td>
        <IconButton aria-label="delete"  onClick={() => deleteExperience(exp._id)}>
          <DeleteIcon />
        </IconButton>

      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Menu Items</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th className="hide-sm">Cuisine</th>
            <th className="hide-sm">Price</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);
